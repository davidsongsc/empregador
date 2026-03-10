export type StatusSummary = {
  status: string;
  total: number;
};

export type DashboardStats = {
  total_vagas: number;
  total_candidaturas: number;
  novas_candidaturas: number;
  vagas_com_processo_seletivo: number;
  resumo_por_status: StatusSummary[];
};