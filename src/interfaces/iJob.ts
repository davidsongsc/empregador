import { Address } from "./iAddress";
import { JobResult } from "./jobResult";

export type Job = {
  uid: string;
  role_details: { name: string, category: string } | null;
  tipo_vaga_display: string | null;
  cargo_nome: string;
  tipo: string;
  titulo_personalizado: string | null;
  salario: number | null;
  turno?: string;
  company?: string | null;
  empresa_nome?: string;
  endereco?: Address;
  categoria?: string;
  descricao: string;
  requisitos?: string[];
  beneficios?: string[];
  perguntas?: string[];
};

export interface JobPayload {
  role: string; // UID do cargo selecionado
  titulo_personalizado: string;
  company: string;
  salario: number | null;
  turno: string;
  endereco: { cidade: string } | null;
  descricao: string;
  beneficios: { description: string }[];
  requisitos: { description: string }[];
  metodo_contato: string;
  tipo_vaga: string;
  is_active: boolean;
  perguntas: any[];
}

export type PaginatedJobsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
};

export interface JobCacheEntry {
  results: JobResult[];
  count: number;
  metadata: any;
  etag: string;
  updatedAt: number;
}

