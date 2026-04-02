// STATUS_CONFIG: Centraliza rótulos, cores e sub-mensagens para o sistema Delos
export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  // INSCRIÇÃO
  APPLIED: { label: "Candidatado", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  WITHDRAWN: { label: "Desistência", color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },

  // TRIAGEM
  SCREENING: { label: "Triagem", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  REVIEWING: { label: "Em Análise", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  SHORTLISTED: { label: "Pré-Seleção", color: "text-amber-400", bg: "bg-amber-400/15", border: "border-amber-400/30" },

  // ENTREVISTAS
  INTERVIEW_SCHEDULED: { label: "Agenda_Set", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  INTERVIEWING: { label: "Entrevista", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  INTERVIEW_COMPLETED: { label: "Entrevista_Ok", color: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-500/40" },

  // AVALIAÇÕES
  TECHNICAL_TEST: { label: "Teste Enviado", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  TEST_SUBMITTED: { label: "Teste Recebido", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  TEST_REVIEW: { label: "Avaliando Teste", color: "text-cyan-300", bg: "bg-cyan-500/20", border: "border-cyan-500/40" },

  // PROPOSTA
  OFFER_SENT: { label: "Proposta_Sent", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  OFFER_NEGOTIATION: { label: "Negociação", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  OFFER_ACCEPTED: { label: "Aceito", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40" },
  OFFER_DECLINED: { label: "Recusado", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },

  // RESULTADO FINAL
  HIRED: { label: "STAFF", color: "text-emerald-500", bg: "bg-emerald-500/20", border: "border-emerald-500/50" },
  REJECTED: { label: "Não Aprovado", color: "text-rose-600", bg: "bg-rose-600/10", border: "border-rose-600/20" },
  ON_HOLD: { label: "Suspenso", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
};

// STATUS_LABELS: Mantido para retrocompatibilidade simples se necessário
const STATUS_LABELS = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([key, value]) => [key, value.label])
);

export const FLOW_SEQUENCE = [
  'APPLIED', 'SCREENING', 'REVIEWING', 'SHORTLISTED',
  'INTERVIEW_SCHEDULED', 'INTERVIEWING', 'TECHNICAL_TEST',
  'TEST_SUBMITTED', 'TEST_REVIEW', 'OFFER_SENT', 'HIRED'
];

export const GROUPED_STATUS = {
  "01_Inscrição": ["APPLIED", "WITHDRAWN"],
  "02_Triagem": ["SCREENING", "REVIEWING", "SHORTLISTED"],
  "03_Entrevistas": ["INTERVIEW_SCHEDULED"],
  "06_Final": ["HIRED", "REJECTED", "ON_HOLD"]
};

export default STATUS_LABELS;