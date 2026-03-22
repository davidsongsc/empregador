import { create } from "zustand";
import { getCorporateApplications } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { CorporateApplicationsState } from "@/interfaces/iscorporateApplicationState";


// store/useCorporateApplicationsStore.ts
export const useCorporateApplicationsStore = create<CorporateApplicationsState>((set) => ({
  applications: [],
  pagination: { count: 0, next: null, previous: null },
  loading: false,
  error: null,

  fetchApplications: async (companyId, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await getCorporateApplications(companyId, filters);
      set({ 
        applications: data.results || [], 
        pagination: { 
          count: data.count, 
          next: data.next, 
          previous: data.previous 
        },
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  // Função para atualizar o status sem recarregar a lista toda
  updateApplicationStatusLocal: (appId, newStatus) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      ),
    }));
  }
}));