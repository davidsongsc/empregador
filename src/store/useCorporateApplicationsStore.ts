import { create } from "zustand";
import { getCorporateApplications } from "@/services/jobService";
import { CorporateApplicationsState } from "@/interfaces/iscorporateApplicationState";

export const useCorporateApplicationsStore = create<CorporateApplicationsState>((set) => ({
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

  fetchApplications: async (filters = {}) => {
    set({ loading: true, error: null });

    try {
      const data = await getCorporateApplications(filters);
      
      set({
        applications: data.items ?? [],
        pagination: {
          page: data.page,
          page_size: data.page_size,
          total: data.total,
          total_pages: data.total_pages
        },
        data_hash: data.data_hash ?? null,
        loading: false
      });

    } catch (err: any) {
      set({
        error: err?.message ?? "Erro ao carregar candidaturas.",
        loading: false
      });
    }
  },

  updateApplicationStatusLocal: (appId, newStatus) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    }));
  }
}));