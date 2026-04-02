import { Address } from "./iAddress";
import { JobResult } from "./jobResult";

export type Job = {
  uid: string;
  role_details: { name: string, category: string } | null;
  tipo_vaga_display: string | null;
  cargo_nome: string;
  categoria_nome: string | null;
  applications_count: number | null;
  tipo_vaga: string;
  titulo_personalizado: string | null;
  salario: number | null;
  turno?: string;
  company?: string | null;
  empresa_nome?: string;
  endereco?: Address;
  categoria?: string;
  descricao: string;
  is_active: boolean;
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



export interface JobCacheEntry {
  results: JobResult[];
  count: number;
  metadata: any;
  etag: string;
  updatedAt: number;
}

