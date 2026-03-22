import { Address } from "./iAddress";
import { Education } from "./iEducation";
import { Experience } from "./iExperience";

export type UserProfile = {
  id?: string;
  name?: string;
  last_name?: string;
  full_name?: string;
  ocupation?: string;
  email_contato?: string;
  role?: string;
  bio?: string;
  foto?: string | null;
  foto_url?: string;
  endereco?: Address;
  data_nascimento?: string;
  empresas?: {
    id: string;
    name: string;
    role: string;
    is_active: boolean;
  }[];
  experiences?: Experience[];
  educations?: Education[];

  usuario_id?: string;
};

