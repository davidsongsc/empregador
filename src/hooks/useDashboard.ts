// hooks/useDashboard.ts
import { useEffect, useCallback } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function useDashboard() {
  const { stats, loading, error, fetchStats } = useDashboardStore();

  const refresh = useCallback(() => {
    return fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    // Carrega apenas se ainda não houver dados ou se desejar atualizar sempre
    if (!stats) {
      fetchStats();
    }
  }, [fetchStats, stats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}