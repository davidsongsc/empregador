
export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  created_at: string;
  updated_at: string;
  cargo_nome: string;
  empresa_nome: string;
}

export interface ApplicationsResponse {
  total: number;
  pagina: number;
  tamanho: number;
  paginas_totais: number;
  data_hash: string;
  items: Application[];
}