export interface CandidateDetails {
  is_locked: boolean;
  name: string;
  foto: string | null;
  ocupation: string | null;
  bio: string | null;
  experiences: any[];
  certifications: any[];
  educations: any[];
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