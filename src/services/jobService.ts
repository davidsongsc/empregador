import { JobsResponse } from "@/interfaces/jobResponse";
import { api } from "@/lib/api";

// Helper para construir a query string com paginação e filtros
const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value.toString());
    }
  });
  return query.toString();
};
interface FetchOptions {
  headers?: Record<string, string>;
}
interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * ROTA PÚBLICA: Busca todas as vagas com paginação
 */
// jobService.ts
export async function getAllJobs(
  params: PaginationParams = {},
  options: FetchOptions = {} // <--- ADICIONE ESTE ARGUMENTO
): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...options.headers, // <--- MESCLE OS HEADERS AQUI
    }
  });
}

/**
 * ROTA PRIVADA: Feed de vagas (vagas que o usuário não se candidatou)
 */
export async function getJobFeed(
  params: PaginationParams = {},
  options: FetchOptions = {} // <--- ADICIONE ESTE ARGUMENTO
): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/feed/?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...options.headers, // <--- MESCLE OS HEADERS AQUI
    }
  });
}

/**
 * Busca as vagas filtradas (Visão do Recrutador/Empresa)
 */
interface MyJobsParams extends PaginationParams {
  usuario?: string;
  company?: string;
}

export async function getMyJobs(params: MyJobsParams): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/internas/?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      // Garantimos que sempre será uma string para o TS não reclamar
      "X-Company-Id": String(params.company || ""),
    },
  });
}

/**
 * Interface para os filtros da listagem corporativa
 */
export interface CorporateFilterParams {
  job?: string;      // UUID da vaga específica
  status?: string;   // Status da candidatura (applied, hired, etc)
  page?: number;     // Página atual
  page_size?: number;// Quantidade por página
  search?: string;   // Busca textual por nome do candidato
}

/**
 * ROTA CORPORATIVA: Busca todos os candidatos vinculados à empresa ativa.
 * @param companyId UUID da empresa selecionada pelo usuário
 * @param filters Objeto contendo paginação e filtros de busca
 */

export async function getCorporateApplications(companyId: string, filters: any) {
  // LIMPEZA DE SEGURANÇA: Se o ID vier duplicado, pega só o primeiro
  const cleanCompanyId = companyId.includes(',')
    ? companyId.split(',')[0].trim()
    : companyId;

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value.toString()); // .set evita duplicar na URL
  });

  return api(`/vagas/corporate/candidaturas/?${params.toString()}`, {
    method: "GET",
    headers: {
      "X-Company-Id": cleanCompanyId, // Envia o ID limpo
    },
    credentials: "include",
  });
}

/**
 * Atualiza o status de uma candidatura específica.
 * @param applicationId UUID da candidatura (id)
 * @param newStatus O novo status (ex: 'hired', 'rejected')
 */
export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  // A URL deve terminar com a barra "/" e NÃO conter QueryParams (?job=...)
  const url = `/vagas/candidaturas/${applicationId}/`;

  return api(url, {
    method: "PATCH",
    body: JSON.stringify({
      status: newStatus
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export async function getOwnerJobs(companyId?: string): Promise<JobsResponse> {
  return api(`/vagas/owner/`, {
    method: "GET",
    headers: {
      // Se companyId for null/undefined, o backend cai na lógica de "vagas do user"
      ...(companyId && { "X-Company-Id": companyId }),
    },
  });
}