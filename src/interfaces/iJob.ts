export type Job = {
  uid: string;
  role_details: { name: string, category: string } | null;
  tipo_vaga_display: string | null;
  cargo_exibicao: string;
  tipo_vaga: string;
  titulo_personalizado: string | null;
  salario: number | null;
  turno?: string;
  company?: string | null;
  empresa_nome?: string;
  endereco?: { cidade: string, estado: string } | null;
  descricao: string;
  requisitos?: string[];
  beneficios?: string[];
  perguntas?: string[];
};

export type PaginatedJobsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
};

export interface JobResult {
  uid: string;
  cargo_exibicao: string;
  empresa_nome: string;
  tipo_vaga: string;
  salario?: string;
  local?: string;
  category?: string;
  [key: string]: any;
}

export interface JobCacheEntry {
  results: JobResult[];
  count: number;
  metadata: any;
  etag: string;
  updatedAt: number;
}

