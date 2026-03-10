export interface JobResult {
  uid: string;
  tipo_vaga_display: string;
  role_details: {
    name: string;
    category: string;
  };
  cargo_exibicao: string;
  turno: string;
  candidatos_count?: number;
  created_at?: string;
  empresa_nome?: string; // Útil para o feed
  endereco?: {
    cidade: string;
    estado: string;
    lagradouro: string;
    cep: string;
  };
  salario?: number;
  descricao?: string;
  perguntas?: any[];
  is_active?: boolean;
}