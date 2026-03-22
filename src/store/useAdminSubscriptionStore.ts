import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {  getAdminSubscriptions } from "@/services/adminSubscriptionService";
import { AdminSubState } from "@/interfaces/isSubscriptions";
import { AdminSubscription } from "@/interfaces/iSubscription";


const FRESHNESS_THRESHOLD = 30 * 1000; 

export const useAdminSubscriptionStore = create<AdminSubState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      total: 0,
      loading: false,
      lastUpdate: null,
      error: null,
      currentRequest: false,
      dataHash: null,

      fetchSubscriptions: async (force = false) => {
        const { lastUpdate, subscriptions, currentRequest, dataHash } = get();
        const now = Date.now();
        
        if (currentRequest) return;

        // Validação de Freshness
        if (!force && subscriptions.length > 0 && lastUpdate && (now - lastUpdate < FRESHNESS_THRESHOLD)) {
          return;
        }

        set({ loading: subscriptions.length === 0, error: null, currentRequest: true });

        try {
          // Passamos o hash atual para o serviço tentar um 304 Not Modified
          const response: any = await getAdminSubscriptions();

          // 1. CENÁRIO DELTA (Se o backend suportar envio de patches)
          if (response?.isDelta && response?.patches) {
            get().applyDeltaPatches(response.patches);
            set({ 
                lastUpdate: now, 
                loading: false, 
                currentRequest: false,
                dataHash: response.data_hash || dataHash 
            });
            return;
          }

          // 2. LÓGICA DE EXTRAÇÃO REVISADA (Foco no campo 'items')
          let cleanData: AdminSubscription[] = [];
          let totalCount = 0;

          if (Array.isArray(response?.items)) {
            // Padrão atual do seu JSON
            cleanData = response.items;
            totalCount = response.total || response.items.length;
          } else if (Array.isArray(response)) {
            // Fallback para array puro
            cleanData = response;
            totalCount = response.length;
          } else if (Array.isArray(response?.planos)) {
            // Compatibilidade com versões anteriores
            cleanData = response.planos;
            totalCount = response.total || response.planos.length;
          }

          set({
            subscriptions: cleanData,
            total: totalCount,
            dataHash: response?.data_hash || null,
            lastUpdate: now,
            loading: false,
            currentRequest: false
          });

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Nexus_Admin] Sincronizado: ${cleanData.length} planos via Terminal.`);
          }

        } catch (error: any) {
          // Tratamento de 304 via Exception
          if (error.status === 304) {
            set({ lastUpdate: now, loading: false, currentRequest: false });
            return;
          }

          set({
            error: error.message || "FALHA_NA_SINCRONIZACAO_ADMIN",
            loading: false,
            currentRequest: false
          });
        }
      },

      applyDeltaPatches: (patches) => set((state) => {
        let updatedList = [...state.subscriptions];
        patches.forEach((patch) => {
          if (patch.type === 'CREATED') {
            if (!updatedList.find(s => s.id === patch.id)) updatedList = [patch.data, ...updatedList];
          } else if (patch.type === 'UPDATED') {
            updatedList = updatedList.map(s => s.id === patch.id ? { ...s, ...patch.data } : s);
          } else if (patch.type === 'DELETED') {
            updatedList = updatedList.filter(s => s.id !== patch.id);
          }
        });
        return { subscriptions: updatedList, total: updatedList.length };
      }),

      addSubscription: (newSub) => set((state) => ({
        subscriptions: [newSub, ...state.subscriptions],
        total: state.total + 1,
        lastUpdate: Date.now()
      })),

      updateSubscription: (id, data) => set((state) => ({
        subscriptions: state.subscriptions.map((sub) => sub.id === id ? { ...sub, ...data } : sub),
        lastUpdate: Date.now()
      })),

      removeSubscription: (id) => set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        total: Math.max(0, state.total - 1),
        lastUpdate: Date.now()
      })),

      clearSubscriptions: () => set({ 
        subscriptions: [], 
        total: 0, 
        lastUpdate: null, 
        error: null, 
        currentRequest: false,
        dataHash: null 
      }),
    }),
    {
      name: "nexus-admin-plans-vault", // Nome único para não conflitar com outros storages
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        subscriptions: state.subscriptions,
        total: state.total,
        lastUpdate: state.lastUpdate,
        dataHash: state.dataHash
      }),
    }
  )
);