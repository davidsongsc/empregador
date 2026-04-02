import { Address } from "./iAddress";
import { JobQuestion } from "./iJobQuestion";

export interface JobResult {
  id: string;
  tipo_vaga_display?: string;
  role_details?: {
    name: string;
    category: string;
  };
  cargo_nome?: string;
  turno?: string;
  applications_count?: number;
  categoria_nome?: string;
  tipo_vaga?: string;
  created_at?: string;
  empresa_nome?: string; // Útil para o feed
  endereco?: Address ;
  salario?: number;
  descricao?: string;
  perguntas?: JobQuestion[];
  is_active?: boolean;
}