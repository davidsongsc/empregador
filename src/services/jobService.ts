import { JobsResponse } from "@/interfaces/ijobResponse";
import { JobResult } from "@/interfaces/jobResult";
import { api } from "@/lib/api";

import buildQuery from "@/utils/buildQuery";

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
  params: any,
  options: FetchOptions = {}
): Promise<JobsResponse> {


  return api(`/api/v1/jobs/public/category/${params}`, {
    method: "GET",
    credentials: "include",
    headers: { ...(options.headers || {}) }
  });
}

/**
 * ROTA PRIVADA: Feed de vagas (vagas que o usuário não se candidatou)
 */
export async function getJobFeed(
  params: any = {},
  options: FetchOptions = {}
): Promise<JobsResponse> {

  return api(`/api/v1/jobs/category/${params}`, {
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

  return api(`/api/v1/jobs/managed/company?${queryString}`, {
    method: "GET",
    // Importante: No Next.js/Browser, 'include' permite enviar os cookies da sessão
    credentials: "include",
    headers: {
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

export async function getCorporateApplications(filters: any) {

  console.log('filters', filters);
  const queryString = buildQuery(filters);

  return api(`/api/v1/applications-saas/listar${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
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
  const url = `/api/v1/applications-saas/${applicationId}`;

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
  return api(`/api/v1/categories/categories?page=${page}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getOwnerJobs(companyId?: string): Promise<JobsResponse> {
  return api(`/vagas/owner/`, {
    method: "GET",

  });
}


export async function getJobById(uid: string, companyId: string): Promise<JobResult> {
  // Limpeza para evitar a duplicidade/aspas que vimos no log
  const cleanCompanyId = companyId.toString().replace(/["'“”]/g, '').split(',')[0].trim();

  // REMOVIDO o /editar/ para bater na rota limpa do Django
  return api(`/api/v1/jobs/getbyid/${uid}`, {
    method: "GET",
    credentials: "include",

  });
}

export async function patchJobDelta(uid: string, companyId: string, data: Partial<JobResult>) {
  const cleanCompanyId = companyId.toString().replace(/["'“”]/g, '').split(',')[0].trim();

  return api(`/api/v1/jobs/update/${uid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}


/**
 * Busca perguntas personalizadas de uma vaga específica.
 * @param jobId O UID da vaga (UUID)
 * @param params Objeto contendo pagina e tamanho (conforme sua API Server Response)
 */
export async function getJobQuestions(jobId: string, params: { pagina?: number; tamanho?: number } = {}) {
  // Garante que o ID esteja limpo caso venha com aspas de algum storage/cache
  const cleanJobId = jobId.toString().replace(/["'“”]/g, '').trim();

  const { pagina = 1, tamanho = 10 } = params;

  // Montagem da query string seguindo o padrão: ?job_id=UUID&pagina=1&tamanho=10
  const queryString = `?job_id=${cleanJobId}&pagina=${pagina}&tamanho=${tamanho}`;

  return api(`/api/v1/jobs/questions/${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}