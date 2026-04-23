import { create } from "zustand";
import { getCorporateApplications } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { Application } from "@/interfaces/aplications";

interface CorporateApplicationsState {
  applications: Application[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  data_hash: string | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  fetchApplications: (companyId: string, filters?: any) => Promise<void>;
  updateApplicationStatusLocal: (appId: string, newStatus: string) => void;
  clearApplications: () => void;
}

export const useCorporateApplicationsStore = create<CorporateApplicationsState>((set, get) => ({
  applications: [],
  pagination: {
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0
  },
  data_hash: null,
  loading: false,
  error: null,

  /**
   * Busca as candidaturas no backend filtrando por empresa (header) e filtros (query params)
   */
  fetchApplications: async (companyId, filters = {}) => {
    // 1. BLINDAGEM: Tenta extrair o ID caso receba o objeto da empresa por erro de tipagem no componente
    const idToUse = (companyId && typeof companyId === 'object') 
      ? (companyId as any).id || (companyId as any).company_id 
      : companyId;

    // 2. VALIDAÇÃO: Impede o envio de [object Object] ou IDs nulos
    if (!idToUse || idToUse === "[object Object]") {
      console.warn("⚠️ [fetchApplications]: Tentativa de busca bloqueada por Company ID inválido.");
      return;
    }

    set({ loading: true, error: null });

    try {
      // 3. CHAMADA AO SERVICE: (filtros, id_da_empresa)
      // O service cuidará de converter 'filters' em query string e 'idToUse' em Header
      const data = await getCorporateApplications(filters, idToUse);

      set({
        applications: data.items ?? [],
        pagination: {
          page: data.page ?? 1,
          page_size: data.page_size ?? 10,
          total: data.total ?? 0,
          total_pages: data.total_pages ?? 0
        },
        data_hash: data.data_hash ?? null,
        loading: false
      });

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao carregar candidaturas.";

      set({
        error: errorMessage,
        loading: false,
        applications: [] // Limpa a lista em caso de erro crítico (ex: 403)
      });

      if (errorMessage !== "canceled") {
        toast.error(errorMessage);
      }
    }
  },

  /**
   * Atualiza o status de uma candidatura localmente (Optimistic Update)
   */
  updateApplicationStatusLocal: (appId, newStatus) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    }));
  },

  /**
   * Reseta o estado (Útil ao trocar de empresa no dashboard)
   */
  clearApplications: () => set({ 
    applications: [], 
    pagination: { page: 1, page_size: 10, total: 0, total_pages: 0 },
    data_hash: null,
    error: null 
  })
}));