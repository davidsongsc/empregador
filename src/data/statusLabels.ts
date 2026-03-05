const STATUS_LABELS: Record<string, string> = {
    applied: "Candidatado",
    reviewing: "Em Análise",
    interview: "Entrevista",
    hired: "Contratado",
    rejected: "Recusado",
    withdrawn: "Desistência",
};

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  applied: { label: "Candidatados", color: "text-blue-600" },
  reviewing: { label: "Em Análise", color: "text-orange-600" },
  interview: { label: "Entrevistas", color: "text-purple-600" },
  hired: { label: "Contratados", color: "text-emerald-600" },
  rejected: { label: "Não Selecionados", color: "text-red-600" },
  withdrawn: { label: "Desistências", color: "text-slate-600" },
};

export default STATUS_LABELS;