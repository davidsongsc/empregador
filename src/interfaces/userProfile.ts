export type UserProfile = {
  name?: string;
  last_name?: string;
  full_name?: string;
  ocupation?: string;
  email?: string;
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
  // AJUSTE AQUI: Definido como Array de objetos
  empresas?: {
    id: string;
    name: string;
    role: string;
    is_active: boolean;
  }[];
};