import { JobsResponse } from "@/interfaces/jobResponse";
import { api } from "@/lib/api";
import { Job } from "./jobs";
import { JobResult } from "@/interfaces/jobResult";

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

interface JobSearchParams extends PaginationParams {
  selectedCategory?: string;
  fields?: string[]; // Array de campos sob demanda
  category?: string;
  search?: string;
  ordering?: string;
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
  params: JobSearchParams = {},
  options: FetchOptions = {}
): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/public/roles/?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: { ...(options.headers || {}) }
  });
}

/**
 * ROTA PRIVADA: Feed de vagas (vagas que o usuário não se candidatou)
 */
export async function getJobFeed(
  params: JobSearchParams = {},
  options: FetchOptions = {}
): Promise<JobsResponse> {
  const queryString = buildQuery(params);

  return api(`/vagas/feed/?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: { ...(options.headers || {}) }
  });
}

/**
 * Busca as vagas filtradas (Visão do Recrutador/Empresa)
 */
interface MyJobsParams extends JobSearchParams {
  company: string;
}

/**
 * ROTA CORPORATIVA: Busca as vagas da empresa (Visão Interna)
 * Aplicando o Protocolo Delta e Sparse Fieldsets
 */
export async function getMyJobs(params: MyJobsParams): Promise<JobsResponse> {
  // 1. Criamos uma cópia limpa para evitar efeitos colaterais
  // Se o seu buildQuery já faz o join(',') do array fields, 
  // você pode passar o objeto direto. 
  const queryString = buildQuery(params);

  return api(`/vagas/internas/?${queryString}`, {
    method: "GET",
    // Importante: No Next.js/Browser, 'include' permite enviar os cookies da sessão
    credentials: "include",
    headers: {
      // O Header X-Company-Id é o que ativa o Mixin no Django
      "X-Company-Id": String(params.company || ""),
      "Content-Type": "application/json",
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
  const cleanCompanyId = companyId.includes(',')
    ? companyId.split(',')[0].trim()
    : companyId;

  const queryString = buildQuery(filters);

  return api(`/vagas/corporate/candidaturas/?${queryString}`, {
    method: "GET",
    headers: { "X-Company-Id": cleanCompanyId },
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
export async function getJobCategories(page: number = 1): Promise<any> {
  // Passamos o page na query string
  return api(`/vagas/public/roles/categories/?page=${page}`, {
    method: "GET",
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


export async function getJobById(uid: string, companyId: string): Promise<JobResult> {
  // Limpeza para evitar a duplicidade/aspas que vimos no log
  const cleanCompanyId = companyId.toString().replace(/["'“”]/g, '').split(',')[0].trim();

  // REMOVIDO o /editar/ para bater na rota limpa do Django
  return api(`/vagas/internas/${uid}/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "X-Company-Id": cleanCompanyId,
    },
  });
}

export async function patchJobDelta(uid: string, companyId: string, data: Partial<JobResult>) {
  const cleanCompanyId = companyId.toString().replace(/["'“”]/g, '').split(',')[0].trim();

  return api(`/vagas/internas/${uid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "X-Company-Id": cleanCompanyId,
    },
    credentials: "include",
  });
}