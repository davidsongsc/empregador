import { Job } from "@/interfaces/iJob";
import { api } from "@/lib/api";

export async function getJobs(page: number) {
  // Passamos 'true' como terceiro argumento para indicar que é uma rota pública
  return await api(`/vagas/?page=${page}`, { method: "GET" }, true);
}

export async function createJob(jobData: Job) {
  return await api("/vagas/postar/", {
    method: "POST",
    body: JSON.stringify(jobData),
    credentials: "include", // Envia cookies/session
    headers: { "Content-Type": "application/json" }
  });
}
export async function updateJob(uid: string, jobData: Job) {
  return await api(`/vagas/${uid}/editar/`, {
    method: "PATCH",
    body: JSON.stringify(jobData),
    credentials: "include", // Crucial para autorização do PATCH
    headers: { "Content-Type": "application/json" }
  });
}
export async function getCorporateApplications(companyId: string, jobId?: string): Promise<Job> {
  const query = jobId ? `?job=${jobId}` : '';

  return api(`/vagas/corporate/candidaturas/${query}`, {
    method: "GET",
    headers: {
      "X-Company-Id": companyId, // Cabeçalho que a View espera
    },
    credentials: "include",
  });
}

export async function deleteJob(uid: string) {
  // A URL deve ser idêntica à definida no path do Django
  return await api(`/vagas/${uid}/editar/`, {
    method: "DELETE",
    credentials: "include",
  });
}