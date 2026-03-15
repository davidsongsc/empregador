import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AdminSubscription, getAdminSubscriptions } from "@/services/adminSubscriptionService";

interface AdminSubState {
  subscriptions: AdminSubscription[];
  loading: boolean;
  lastUpdate: number | null;
  error: string | null;
  currentRequest: boolean;

  fetchSubscriptions: (force?: boolean) => Promise<void>;
  applyDeltaPatches: (patches: any[]) => void;
  addSubscription: (newSub: AdminSubscription) => void;
  updateSubscription: (id: string | number, data: Partial<AdminSubscription>) => void;
  removeSubscription: (id: string | number) => void;
  clearSubscriptions: () => void;
}

const FRESHNESS_THRESHOLD = 30 * 1000; // 30 segundos

export const useAdminSubscriptionStore = create<AdminSubState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      loading: false,
      lastUpdate: null,
      error: null,
      currentRequest: false,

      fetchSubscriptions: async (force = false) => {
        const { lastUpdate, subscriptions, currentRequest } = get();
        const now = Date.now();
        
        if (currentRequest) return;

        if (!force && subscriptions.length > 0 && lastUpdate && (now - lastUpdate < FRESHNESS_THRESHOLD)) {
          return;
        }

        set({ loading: subscriptions.length === 0, error: null, currentRequest: true });

        try {
          const response: any = await getAdminSubscriptions();

          // 3. CENÁRIO DELTA (Inalterado)
          if (response?.isDelta && response?.patches) {
            get().applyDeltaPatches(response.patches);
            set({ lastUpdate: Date.now(), loading: false, currentRequest: false });
            return;
          }

          // 4. CENÁRIO FULL - AJUSTADO PARA ESTRUTURA "PLANOS"
          let cleanData: AdminSubscription[] = [];
          
          /**
           * LÓGICA DE EXTRAÇÃO RESILIENTE:
           * 1. Verifica se 'planos' é o array direto (seu JSON atual).
           * 2. Verifica se existe 'planos.results' (formato anterior).
           * 3. Verifica se existe 'results' no nível raiz.
           */
          if (Array.isArray(response?.planos)) {
            cleanData = response.planos;
          } else if (Array.isArray(response?.planos?.results)) {
            cleanData = response.planos.results;
          } else if (Array.isArray(response?.results)) {
            cleanData = response.results;
          } else if (response && typeof response === "object") {
             // Caso venha o objeto indexado do Django
            const { ok, etag, isDelta, count, planos, results, ...indexedItems } = response;
            cleanData = Object.values(indexedItems).filter(
              (item: any) => item && typeof item === "object" && item.id
            ) as AdminSubscription[];
          }

          set({
            subscriptions: cleanData,
            lastUpdate: Date.now(),
            loading: false,
            currentRequest: false
          });

          if (process.env.NODE_ENV === 'development') {
            console.log(`[Nexus_Admin] Sincronização: ${cleanData.length} planos ativos.`);
          }

        } catch (error: any) {
          if (error.status === 304 || error.message?.includes("304")) {
            set({ lastUpdate: Date.now(), loading: false, currentRequest: false });
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
        return { subscriptions: updatedList };
      }),

      addSubscription: (newSub) => set((state) => ({
        subscriptions: [newSub, ...state.subscriptions],
        lastUpdate: Date.now()
      })),

      updateSubscription: (id, data) => set((state) => ({
        subscriptions: state.subscriptions.map((sub) => sub.id === id ? { ...sub, ...data } : sub),
        lastUpdate: Date.now()
      })),

      removeSubscription: (id) => set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        lastUpdate: Date.now()
      })),

      clearSubscriptions: () => set({ subscriptions: [], lastUpdate: null, error: null, currentRequest: false }),
    }),
    {
      name: "nexus-admin-vault",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        subscriptions: state.subscriptions,
        lastUpdate: state.lastUpdate
      }),
    }
  )
);