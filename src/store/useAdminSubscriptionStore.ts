import { create } from "zustand";
import { AdminSubscription, getAdminSubscriptions } from "@/services/adminSubscriptionService";

interface AdminSubState {
  subscriptions: AdminSubscription[];
  loading: boolean;
  lastUpdate: Date | null;
  error: string | null; // Adicionado para feedback na UI

  // Actions
  fetchSubscriptions: () => Promise<void>;
  clearSubscriptions: () => void; // Útil para logouts ou resets
}

export const useAdminSubscriptionStore = create<AdminSubState>((set) => ({
  subscriptions: [],
  loading: false,
  lastUpdate: null,
  error: null,

  fetchSubscriptions: async () => {
    // 1. Inicia o loading e limpa erros anteriores
    set({ loading: true, error: null });

    try {
      const data = await getAdminSubscriptions();

      // LOGIC_CLEANUP: Trata o objeto indexado {"0": {}, "1": {}, "ok": true}
      let cleanData: AdminSubscription[] = [];

      if (Array.isArray(data)) {
        cleanData = data;
      } else if (data && typeof data === "object") {
        // Removemos a chave 'ok' e transformamos o restante em Array
        const { ok, ...indexedItems } = data as any;
        cleanData = Object.values(indexedItems).filter(
          (item: any) => item && typeof item === "object" && item.id
        ) as AdminSubscription[];
      }

      set({
        subscriptions: cleanData,
        lastUpdate: new Date(),
        loading: false
      });

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Nexus_Admin] Sync_Complete: ${cleanData.length} nodes active.`);
      }

    } catch (error: any) {
      console.error("Nexus_Admin::Fetch_Subs_Error", error);

      set({
        error: error.message || "Falha na sincronização de assinaturas",
        loading: false,
        subscriptions: [] // Opcional: limpa a lista se houver erro crítico
      });
    }
  },

  clearSubscriptions: () => set({ subscriptions: [], lastUpdate: null, error: null }),
}));