import { api } from "@/lib/api";
import { DashboardStats } from "@/types/dashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  // Chamada autenticada para a nova rota de estatísticas
  return await api("/vagas/dashboard/stats/", {
    method: "GET",
  });
}