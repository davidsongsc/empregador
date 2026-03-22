import { Address } from "./iAddress";
import { JobQuestion } from "./iJobQuestion";

export interface JobResult {
  uid: string;
  tipo_vaga_display?: string;
  role_details?: {
    name: string;
    category: string;
  };
  cargo_nome?: string;
  turno?: string;
  candidatos_count?: number;
  categoria?: string;
  tipo?: string;
  created_at?: string;
  empresa_nome?: string; // Útil para o feed
  endereco?: Address ;
  salario?: number;
  descricao?: string;
  perguntas?: JobQuestion[];
  is_active?: boolean;
}