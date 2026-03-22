export interface Experience {
  id: string;
  cargo: string;
  empresa: string;
  data_entrada: string;
  data_saida?: string | null;
  atualmente_trabalhando: boolean;
  descricao?: string;
}

export interface ExperiencePagination {
  experiences: Experience[];
  total: number;
  page: number;
  size: number;
  pages: number;
  data_hash: string;
}

