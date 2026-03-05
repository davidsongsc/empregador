import { ApplicationsResponse } from "@/interfaces/applicationResult";
import { api } from "@/lib/api";


export async function getApplications(params: { 
  status?: string; 
  job?: string; 
  search?: string;
  page?: number;
}): Promise<ApplicationsResponse> {
  const query = new URLSearchParams();
  
  if (params.status) query.append("status", params.status);
  if (params.job) query.append("job", params.job);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());

  return api(`/vagas/candidaturas/?${query.toString()}`, {
    method: "GET",
    credentials: "include",
  });
}