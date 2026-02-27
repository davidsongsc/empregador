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
  candidatos_count?: number; // Adicionado para o dashboard
  created_at?: string;
}

export interface JobsResponse {
  count: number;
  results: JobResult[];
}

/**
 * Busca as vagas filtradas por usuário ou empresa
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