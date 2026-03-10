export type UserProfile = {
  id?: string;
  name?: string;
  last_name?: string;
  full_name?: string;
  ocupation?: string;
  email?: string;
  role?: string;
  bio?: string;
  foto?: string | null;
  endereco?: Endereco;
  data_nascimento?: string;
  empresas?: {
    id: string;
    name: string;
    role: string;
    is_active: boolean;
  }[];
  experiences?: Experience[];
  educations?: Educations[];
};

export type Endereco = {
  id?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
};

export type Experience = {
  id?: string;
  cargo?: string;
  empresa?: string;
  inicio?: string;
  fim?: string;
  descricao?: string;
};

export type Educations = {
  id?: string;
  instituicao?: string;
  curso?: string;
  inicio?: string;
  fim?: string;
};