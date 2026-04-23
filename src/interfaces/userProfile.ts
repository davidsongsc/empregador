import { Address } from "./iAddress";
import { Education } from "./iEducation";
import { Experience } from "./iExperience";

export type UserProfile = {
  id: string; // Removi o ? pois o JSON sempre envia
  usuario_id: string;
  name: string;
  last_name: string | null;
  ocupation: string | null;
  bio: string | null;
  phone: string | null;
  email_contato: string | null;
  foto_url: string | null;
  role: string;
  data_nascimento: string | null;
  addresses: Partial<Address>[]; // Use Partial se o backend ocultar campos por LGPD
  experiences: Experience[];
  educations?: Education[];
};