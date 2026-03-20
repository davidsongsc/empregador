import { create } from "zustand";
import { getApplications } from "@/services/applicationResult"; // Serviço de busca/filtros
import { myApplicationService } from "@/services/applications"; // Serviço do perfil do candidato
import { ApplicationResult } from "@/interfaces/applicationResult";
import { toast } from "@/components/Notification";

interface ApplicationState {
  // Estado
  data: ApplicationResult[];
  total: number;
  loading: boolean;
  cache: Record<string, { data: ApplicationResult[]; total: number; timestamp: number }>;
  currentRequest: string | null;

  // Actions
  // Unificamos: se passar 'isMyApps', ele usa o serviço do candidato, senão usa o de busca
  fetchApplications: (filters?: any, force?: boolean, isMyApps?: boolean) => Promise<void>;

  // Operações Locais (Otimistas)
  removeItem: (id: string) => void;
  addOptimistic: (newApp: any) => void;

  // Helpers
  getStats: () => {
    total: number;
    applied: number;
    withdrawn: number;
    reviewing: number;
  };
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  data: [],
  total: 0,
  loading: false,
  cache: {},
  currentRequest: null,

  fetchApplications: async (filters = {}, force = false, isMyApps = false) => {
    // Geramos uma chave única que separa "minhas vagas" das "vagas gerais"
    const prefix = isMyApps ? "MY_APPS_" : "SEARCH_";
    const cacheKey = prefix + JSON.stringify(filters);
    const now = Date.now();

    if (get().currentRequest === cacheKey) return;

    // Validação de Cache (TTL de 3 minutos)
    if (!force) {
      const cached = get().cache[cacheKey];
      if (cached && now - cached.timestamp < 180000) {
        set({ data: cached.data, total: cached.total, loading: false });
        return;
      }
    }

    set({ loading: true, currentRequest: cacheKey });

    try {
      // Decisão de Protocolo: Qual serviço chamar?
      const response: any = isMyApps
        ? await myApplicationService.getMyApplications(force)
        : await getApplications(filters);

      // Padronização do retorno (seja 'items' ou 'results')
      const results = response?.items || response?.results || [];
      const totalCount = response?.total || results.length;

      set((state) => ({
        data: results,
        total: totalCount,
        currentRequest: null,
        cache: {
          ...state.cache,
          [cacheKey]: { data: results, total: totalCount, timestamp: now }
        }
      }));
    } catch (err: any) {
      toast.error("Falha na sincronização com o Terminal Delos.");
      set({ loading: false, currentRequest: null });
    }
  },

  removeItem: (id: string) => set((state) => {
    // O ERRO PODE ESTAR AQUI: Deve ser !== (diferente)
    const newData = state.data.filter(a => a.id !== id);

    const newCache = { ...state.cache };
    Object.keys(newCache).forEach((key) => {
      const entry = newCache[key];
      newCache[key] = {
        ...entry,
        // AQUI TAMBÉM: Deve ser !== para manter os outros e tirar o alvo
        data: entry.data.filter(item => item.id !== id),
        total: Math.max(0, entry.total - 1)
      };
    });

    return { data: newData, cache: newCache, total: state.total - 1 };
  }),

  addOptimistic: (newApp) => set((state) => ({
    data: [newApp, ...state.data],
    total: state.total + 1,
    cache: {}
  })),

  getStats: () => {
    const apps = get().data;
    return {
      total: get().total,
      // Usando os Enums em MAIÚSCULO como definimos no Backend
      applied: apps.filter(a => a.status === 'APPLIED').length,
      withdrawn: apps.filter(a => a.status === 'WITHDRAWN').length,
      reviewing: apps.filter(a => a.status === 'REVIEWING').length,
    };
  }
}));