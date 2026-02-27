import { api } from "@/lib/api";

export interface JobResult {
  uid: string;
  tipo_vaga_display: string;
  role_details: {
    name: string;
    category: string;
  };
  cargo_exibicao: string;
  turno: string;
  candidatos_count?: number;
  created_at?: string;
  empresa_nome?: string; // Útil para o feed
  descricao?: string;
  perguntas?: any[];
}

export interface JobsResponse {
  count: number;
  next: string | null;      // ADICIONADO: URL para a próxima página
  previous: string | null;  // ADICIONADO: URL para a página anterior
  results: JobResult[];
}
/**
 * ROTA PÚBLICA: Busca todas as vagas (usada na Home/Landing Page)
 */
export async function getAllJobs(): Promise<JobsResponse> {
  return api(`/vagas/`, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * ROTA PRIVADA: Busca apenas vagas que o usuário ainda NÃO se candidatou
 * (Requer que a JobFeedView esteja configurada no Django como vimos)
 */
export async function getJobFeed(): Promise<JobsResponse> {
  // Buscamos o token do localStorage manualmente se o seu 'api' não fizer isso
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  return api(`/vagas/feed/`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`, // Garante que o Django identifique o user
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

/**
 * Busca as vagas filtradas por usuário ou empresa (Visão do Recrutador/Empresa)
 */
export async function getMyJobs(params: { usuario?: string; company?: string }): Promise<JobsResponse> {
  const query = new URLSearchParams();
  if (params.usuario) query.append("usuario", params.usuario);
  if (params.company) query.append("company", params.company);

  return api(`/vagas/?${query.toString()}`, {
    method: "GET",
    credentials: "include",
  });
}