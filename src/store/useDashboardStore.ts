// store/useDashboardStore.ts
import { create } from "zustand";
import { DashboardStats } from "@/types/dashboard";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardState } from "@/interfaces/isDashboardState";



export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getDashboardStats();
      set({ stats: data, loading: false });
    } catch (err: any) {
      set({ error: "Erro ao carregar estatísticas", loading: false });
    }
  },
}));