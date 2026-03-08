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

interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * ROTA PÚBLICA: Busca todas as vagas com paginação
 */
export async function getAllJobs(params: PaginationParams = {}): Promise<JobsResponse> {
  // Se não passar nada, o Django assume page_size=10 conforme configuramos
  const queryString = buildQuery(params);

  return api(`/vagas/?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * ROTA PRIVADA: Feed de vagas (vagas que o usuário não se candidatou)
 */
export async function getJobFeed(params: PaginationParams = {}): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/feed/?${queryString}`, {
    method: "GET",
    credentials: "include", // O token 'access' geralmente já vai via cookie se configurado no seu 'api'
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

  return api(`/vagas/?${queryString}`, {
    method: "GET",
    credentials: "include",
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