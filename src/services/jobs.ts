import { api } from "@/lib/api";

export type Job = {
  uid: string;
  cargo: string;
  salario: number | null;
  turno: string;
  empresa: string | null;
  local: string;
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  perguntas: string[];
};

export type PaginatedJobsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
};

export async function getJobs(page: number) {
  // Passamos 'true' como terceiro argumento para indicar que é uma rota pública
  return await api(`/vagas/?page=${page}`, { method: "GET" }, true);
}