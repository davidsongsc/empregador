import { DashboardStats } from "@/types/dashboard";

export interface DashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}