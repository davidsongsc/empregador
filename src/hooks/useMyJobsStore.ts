import { create } from "zustand";
import { getMyJobs } from "@/services/jobService";
import { JobsResponse } from "@/interfaces/ijobResponse";
import { toast } from "@/components/Notification";

const CACHE_TTL = 60 * 1000; // 1 minuto de frescor

interface MyJobsState {
  data: JobsResponse | null;
  loading: boolean;
  error: string | null;
  cache: Record<string, { data: JobsResponse; timestamp: number }>;
  currentRequest: string | null; // Trava para evitar chamadas duplicadas

  fetchJobs: (filter: any, forceRefresh?: boolean) => Promise<void>;
  invalidateCache: () => void;
}

export const useMyJobsStore = create<MyJobsState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  cache: {},
  currentRequest: null,

  fetchJobs: async (filter, forceRefresh = false) => {
    const cacheKey = JSON.stringify(filter);
    const now = Date.now();

    // 1. BLOQUEIO DE DUPLICIDADE (Mata o refresh duplo na navegação)
    if (get().currentRequest === cacheKey) return;

    // 2. VERIFICAÇÃO DE CACHE
    if (!forceRefresh) {
      const cached = get().cache[cacheKey];
      if (cached && now - cached.timestamp < CACHE_TTL) {
        // Se o dado no cache já é o que está em 'data', nem atualiza estado
        if (get().data !== cached.data) {
          set({ data: cached.data, loading: false, error: null });
        }
        return;
      }
    }

    // Marca que esta chave específica está sendo buscada
    set({ loading: true, error: null, currentRequest: cacheKey });

    try {
      const response = await getMyJobs(filter);

      set((state) => ({
        data: response,
        loading: false,
        currentRequest: null, // Libera a trava
        cache: {
          ...state.cache,
          [cacheKey]: { data: response, timestamp: now }
        }
      }));
    } catch (err: any) {
      const msg = err.message || "Erro ao carregar vagas";
      set({ error: msg, loading: false, currentRequest: null });
      toast.error(msg);
    }
  },

  invalidateCache: () => set({ cache: {}, data: null })
}));