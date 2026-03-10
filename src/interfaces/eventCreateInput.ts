export interface EventCreateInput {
  name: string;
  description: string;
  owner_company: string; // UID da empresa
  fixed_organizers?: string[]; // Array de UIDs de profiles
  sponsors?: string[]; // Array de UIDs de empresas/parceiros
}