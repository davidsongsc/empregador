// STATUS_CONFIG: Centraliza rótulos, cores e sub-mensagens para o sistema Delos
export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  // INSCRIÇÃO
  applied: { label: "Candidatado", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  withdrawn: { label: "Desistência", color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },

  // TRIAGEM (Agrupados sob "Análise")
  screening: { label: "Triagem", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  reviewing: { label: "Em Análise", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  shortlisted: { label: "Pré-Seleção", color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/30" },

  // ENTREVISTAS (Agrupados sob "Protocolo de Voz")
  interview_scheduled: { label: "Agenda_Set", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  interviewing: { label: "Entrevista", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  interview_completed: { label: "Entrevista_Ok", color: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-500/40" },

  // AVALIAÇÕES (Agrupados sob "Data_Test")
  technical_test: { label: "Teste Enviado", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  test_submitted: { label: "Teste Recebido", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  test_review: { label: "Avaliando Teste", color: "text-cyan-300", bg: "bg-cyan-500/20", border: "border-cyan-500/40" },

  // PROPOSTA
  offer_sent: { label: "Proposta_Sent", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  offer_negotiation: { label: "Negociação", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  offer_accepted: { label: "Aceito", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40" },
  offer_declined: { label: "Recusado", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },

  // RESULTADO FINAL
  hired: { label: "STAFF", color: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/50" },
  rejected: { label: "Não Aprovado", color: "text-rose-600", bg: "bg-rose-600/10", border: "border-rose-600/20" },
  on_hold: { label: "Suspenso", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
};

// STATUS_LABELS: Mantido para retrocompatibilidade simples se necessário
const STATUS_LABELS = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([key, value]) => [key, value.label])
);


export const FLOW_SEQUENCE = [
  'applied', 'screening',
  'interview_scheduled',
  'offer_sent'
];

export const GROUPED_STATUS = {
  "01_Inscrição": ["applied", "withdrawn"],
  "02_Triagem": ["screening", "reviewing", "shortlisted"],
  "03_Entrevistas": ["interview_scheduled"],
 // "04_Avaliações": ["technical_test", "test_submitted", "test_review"],
//  "05_Proposta": ["offer_sent", "offer_negotiation", "offer_accepted", "offer_declined"],
  "06_Final": ["hired", "rejected", "on_hold"]
};
export default STATUS_LABELS;