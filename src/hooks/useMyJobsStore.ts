import { create } from "zustand";
import { getMyJobs } from "@/services/jobService";
import { JobsResponse } from "@/interfaces/jobResponse";
import { toast } from "@/components/Notification";

const CACHE_TTL = 60 * 1000; // 60 segundos

interface MyJobsState {
  data: JobsResponse | null;
  loading: boolean;
  error: string | null;
  cache: Record<string, { data: JobsResponse; timestamp: number }>;
  
  // Ações
  fetchJobs: (filter: any, forceRefresh?: boolean) => Promise<void>;
  invalidateCache: () => void;
}

export const useMyJobsStore = create<MyJobsState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  cache: {},

  fetchJobs: async (filter, forceRefresh = false) => {
    const cacheKey = JSON.stringify(filter);
    const now = Date.now();

    // Verificação de Cache
    if (!forceRefresh) {
      const cached = get().cache[cacheKey];
      if (cached && now - cached.timestamp < CACHE_TTL) {
        set({ data: cached.data, loading: false, error: null });
        return;
      }
    }

    set({ loading: true, error: null });

    try {
      const response = await getMyJobs(filter);
      
      set((state) => ({
        data: response,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { data: response, timestamp: now }
        }
      }));
    } catch (err: any) {
      const msg = err.message || "Erro ao carregar vagas";
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  invalidateCache: () => set({ cache: {} })
}));