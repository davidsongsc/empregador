import { create } from "zustand";
import { getMyJobs } from "@/services/jobService";
import { JobsResponse } from "@/interfaces/ijobResponse";
import { toast } from "@/components/Notification";

const CACHE_TTL = 60 * 1000; // 1 minuto

interface MyJobsState {
  data: JobsResponse | null;
  loading: boolean;
  error: string | null;
  cache: Record<string, { data: JobsResponse; timestamp: number }>;
  currentRequest: string | null;

  // 🔹 Agora precisamos receber o companyId
  fetchJobs: (companyId: string, filter: any, forceRefresh?: boolean) => Promise<void>;
  invalidateCache: () => void;
}

export const useMyJobsStore = create<MyJobsState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  cache: {},
  currentRequest: null,

  fetchJobs: async (companyId, filter, forceRefresh = false) => {
    // 🔹 A chave do cache deve incluir o companyId para evitar misturar dados de empresas diferentes
    const cacheKey = `${companyId}-${JSON.stringify(filter)}`;
    const now = Date.now();

    // 1. BLOQUEIO DE DUPLICIDADE
    if (get().currentRequest === cacheKey) return;

    // 2. VERIFICAÇÃO DE CACHE
    if (!forceRefresh) {
      const cached = get().cache[cacheKey];
      if (cached && now - cached.timestamp < CACHE_TTL) {
        if (get().data !== cached.data) {
          set({ data: cached.data, loading: false, error: null });
        }
        return;
      }
    }

    set({ loading: true, error: null, currentRequest: cacheKey });

    try {
      // 🔹 PASSANDO O ID PARA O SERVICE (Crucial para o Header x-company-id)
      const response = await getMyJobs({ ...filter }, companyId);
      console.log("objeto companyId recebido no store", companyId);
      set((state) => ({
        data: response,
        loading: false,
        currentRequest: null,
        cache: {
          ...state.cache,
          [cacheKey]: { data: response, timestamp: now }
        }
      }));
    } catch (err: any) {
      // 🔹 Tratamento de erro padronizado com o seu novo backend
      const msg = err.response?.data?.message || err.message || "Erro ao carregar vagas";
      set({ error: msg, loading: false, currentRequest: null });
      
      // Evita mostrar toast se for cancelamento de requisição ou erro silencioso
      if (msg !== "canceled") {
          toast.error(msg);
      }
    }
  },

  invalidateCache: () => set({ cache: {}, data: null, currentRequest: null })
}));