// store/useApplicationStore.ts
import { create } from "zustand";
import { getApplications } from "@/services/applicationResult";
import { ApplicationResult } from "@/interfaces/applicationResult";

interface ApplicationState {
  data: ApplicationResult[];
  loading: boolean;
  cache: Record<string, { data: ApplicationResult[]; timestamp: number }>;
  currentRequest: string | null;

  fetchApplications: (filters: any, force?: boolean) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  data: [],
  loading: false,
  cache: {},
  currentRequest: null,

  fetchApplications: async (filters, force = false) => {
    const cacheKey = JSON.stringify(filters);
    const now = Date.now();

    // Bloqueio Delta X: Impede que duas chamadas idênticas batam na VPS
    if (get().currentRequest === cacheKey) return;

    // Validação de Cache (TTL de 1 minuto)
    if (!force) {
      const cached = get().cache[cacheKey];
      if (cached && now - cached.timestamp < 60000) {
        // Se o dado em exibição já for o do cache, evitamos re-render
        if (get().data !== cached.data) set({ data: cached.data, loading: false });
        return;
      }
    }

    set({ loading: true, currentRequest: cacheKey });

    try {
      const response = await getApplications(filters);
      const results = response.results || [];

      set((state) => ({
        data: results,
        currentRequest: null,
        cache: { 
          ...state.cache, 
          [cacheKey]: { data: results, timestamp: now } 
        }
      }));
    } catch (err) {
      set({ loading: false, currentRequest: null });
    } finally {
      set({ loading: false, currentRequest: null });
    }
  }
}));