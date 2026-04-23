import { JobsResponse } from "@/interfaces/ijobResponse";
import { JobResult } from "@/interfaces/jobResult";
import { api } from "@/lib/api";
import buildQuery from "@/utils/buildQuery";

interface FetchOptions {
  headers?: Record<string, string>;
}

interface JobSearchParams extends PaginationParams {
  selectedCategory?: string;
  fields?: string[];
  category?: string;
  search?: string;
  ordering?: string;
}

interface PaginationParams {
  page?: number;
  page_size?: number;
}
// No seu jobService.ts
const cleanProtocolId = (id: any): string => {
  // 🔹 Se for um objeto, tenta extrair o campo 'id' ou 'company_id'
  const actualId = (id && typeof id === 'object') ? (id.id || id.company_id || id.uid) : id;

  return String(actualId || "")
    .replace(/["'“”]/g, '')
    .split(',')[0]
    .trim();
};
/**
 * ROTA PÚBLICA
 */
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
 * ROTA PRIVADA: Feed (Candidato)
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
 * ROTA CORPORATIVA: Vagas da Empresa
 */
interface MyJobsParams extends JobSearchParams {
  company: string;
}

export async function getMyJobs(params: MyJobsParams, companyId: string): Promise<JobsResponse> {
  const queryString = buildQuery(params);
  const cleanId = cleanProtocolId(companyId);

  return api(`/api/v1/jobs/managed/company?${queryString}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-company-id": cleanId,
    },
  });
}

/**
 * ROTA CORPORATIVA: Listar Candidatos (SaaS)
 */
export async function getCorporateApplications(filters: any, companyId: string) {
  const queryString = buildQuery(filters);
  const cleanId = cleanProtocolId(companyId);

  return api(`/api/v1/applications-saas/listar${queryString ? `?${queryString}` : ''}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "x-company-id": cleanId,
    },
  });
}

/**
 * ROTA CORPORATIVA: Atualizar Status
 */
export async function updateApplicationStatus(applicationId: string, newStatus: string, companyId: string) {
  const url = `/api/v1/applications-saas/${applicationId}`;
  const cleanId = cleanProtocolId(companyId);

  return api(url, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus }),
    headers: {
      "Content-Type": "application/json",
      "x-company-id": cleanId,
    },
    credentials: "include",
  });
}

export async function getJobById(uid: string, companyId: string): Promise<JobResult> {
  const cleanId = cleanProtocolId(companyId);

  return api(`/api/v1/jobs/getbyid/${uid}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "x-company-id": cleanId
    }
  });
}

export async function patchJobDelta(uid: string, companyId: string, data: Partial<JobResult>) {
  const cleanId = cleanProtocolId(companyId);

  return api(`/api/v1/jobs/update/${uid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "x-company-id": cleanId,
    },
    credentials: "include",
  });
}

/**
 * Busca perguntas personalizadas
 */
export async function getJobQuestions(jobId: string, params: { pagina?: number; tamanho?: number } = {}) {
  const cleanId = cleanProtocolId(jobId);
  const { pagina = 1, tamanho = 10 } = params;
  const queryString = `?job_id=${cleanId}&pagina=${pagina}&tamanho=${tamanho}`;

  return api(`/api/v1/jobs/questions/${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

/**
 * Busca as categorias de vagas.
 * @param page Página atual
 * @param companyId ID da empresa (Obrigatório conforme regras do Backend)
 */
export async function getJobCategories(page: number = 1, companyId: string): Promise<any> {
  // Garantimos que o ID nunca seja undefined antes de tentar limpar
  // Se vier vazio, cleanProtocolId lidará com a string vazia
  const cleanId = cleanProtocolId(companyId || "");

  return api(`/api/v1/categories/categories?page=${page}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-company-id": cleanId, // Agora enviamos sempre, como exige o seu Backend
    },
  });
}