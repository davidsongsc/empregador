import { Job, JobPayload } from "@/interfaces/iJob";
import { api } from "@/lib/api";

export async function getJobs(page: number) {
  // Passamos 'true' como terceiro argumento para indicar que é uma rota pública
  return await api(`/vagas/?page=${page}`, { method: "GET" }, true);
}

export async function createJob(jobData: Job) {
  return await api("/api/v1/jobs/", {
    method: "POST",
    body: JSON.stringify(jobData),
    credentials: "include", // Envia cookies/session
    headers: { "Content-Type": "application/json" }
  });
}
export async function updateJob(uid: string, jobData: JobPayload) {
  return await api(`/api/v1/jobs/update/${uid}`, {
    method: "PATCH",
    body: JSON.stringify(jobData),
    credentials: "include", // Crucial para autorização do PATCH
    headers: { "Content-Type": "application/json" }
  });
}

export async function deleteJob(uid: string) {
  // A URL deve ser idêntica à definida no path do Django
  return await api(`/api/v1/jobs/delete/${uid}`, {
    method: "DELETE",
    credentials: "include",
  });
}