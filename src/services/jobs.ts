import { api } from "@/lib/api";

export type Job = {
  uid: string;
  role_details: { name: string, category: string } | null;
  cargo_exibicao: string;
  titulo_personalizado: string | null;
  salario: number | null;
  turno: string;
  company: string | null;
  empresa_nome: string;
  endereco: { cidade: string, estado: string } | null;
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

export async function createJob(jobData: any) {
  // Chamada POST para a nova rota de criação
  return await api("/vagas/postar/", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}