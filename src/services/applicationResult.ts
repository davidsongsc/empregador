import { ApplicationsResponse } from "@/interfaces/applicationResult";
import { api } from "@/lib/api";

// Tipagem rigorosa para evitar erros de "property does not exist"
export interface GetApplicationsParams {
  status?: string; 
  job_id?: string; // Alinhado com o seu backend que usa job_id como filtro
  search?: string;
  pagina?: number; // Alinhado com o Query(1, ge=1) do FastAPI
  tamanho?: number;
}

export async function getApplications(params: GetApplicationsParams): Promise<ApplicationsResponse> {
  const query = new URLSearchParams();
  
  // Mapeamento de filtros para o Protocolo do Backend
  if (params.status) query.append("status", params.status.toUpperCase()); // Garante o Uppercase
  if (params.job_id) query.append("job_id", params.job_id);
  if (params.search) query.append("search", params.search);
  
  // Paginação: O Backend espera 'pagina' e 'tamanho'
  query.append("pagina", (params.pagina || 1).toString());
  query.append("tamanho", (params.tamanho || 10).toString());

  // Rota corrigida conforme o seu @router.get("/")
  return api(`/api/v1/applications/?${query.toString()}`, {
    method: "GET",
    credentials: "include",
  });
}