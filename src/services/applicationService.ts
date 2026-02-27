// services/applicationService.ts
import { api } from "@/lib/api";

export async function getJobApplications(jobId: string) {
  return api(`/vagas/${jobId}/candidaturas/`, {
    method: "GET",
    credentials: "include",
  });
}

// Opcional: Função para mudar o status do candidato
export async function updateApplicationStatus(id: string, status: string) {
  return api(`/vagas/candidaturas/${id}/`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ status }),
  });
}