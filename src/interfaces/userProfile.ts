export type UserProfile = {
  name?: string;
  last_name?: string;
  full_name?: string;
  ocupation?: string;
  role?: string;
  bio?: string;
  foto?: string | null;
  endereco?: {
    id?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
};
