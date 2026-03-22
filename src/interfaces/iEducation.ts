export interface Education {
  id: string;
  curso: string;
  instituicao: string;
  data_inicio: string;
  data_fim?: string | null;
  cursando_atualmente: boolean;
  descricao?: string;
  profile_id?: string;
}

export interface EducationPagination {
  results: Education[];
  total_count: number;
  page: number;
  pages: number;
  size: number;
  data_hash: string;
}
