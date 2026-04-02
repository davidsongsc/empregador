export type ApplicationStatus =
  | 'APPLIED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'



export interface CandidateDetails {
  is_locked: boolean;
  name: string;
  foto: string | null;
  ocupation: string | null;
  bio: string | null;
  experiences: any[];
  certifications: any[];
  educations: any[];
  localizacao: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  github: string | null;
  email: string | null;
  data_nascimento: string | null;
}
export interface JobDetails {
  id: string;
  cargo_nome: string;
  tipo_vaga_display: string;
  empresa_nome: string;
  local: string;
  salario: number;
  turno: string;

}
export interface ApplicationResult {
  id: string;
  job: string; // UID da vaga
  status: string; // Ex: "applied"
  status_display: string; // Ex: "Candidatado"
  data_aplicacao: string; // Data formatada vinda da API
  cargo: string;
  empresa: string;
  cover_letter: string | null;
  candidate_details: CandidateDetails;
  job_details: JobDetails;
  respostas: any[];
}

export interface ApplicationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApplicationResult[];
}


export interface JobApplication {
  job_id: string
  cover_letter: string | null
  resume_url: string | null
  id: string
  candidate_id: string
  status: ApplicationStatus
  created_at: string
  updated_at: string
  cargo_nome: string
  empresa_nome: string | null
}
export interface PaginatedResponse<T> {
  total: number
  page: number
  page_size: number
  total_pages: number
  data_hash: string
  items: T[]
}