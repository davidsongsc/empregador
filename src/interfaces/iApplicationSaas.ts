import { UserProfile } from "./userProfile";

export interface IApplicationSaas {
    id: string;
    job_id: string;
    profile_id: string;
    status: string; // ou Enum 'SCREENING' | 'APPLIED' etc
    cover_letter: string;
    resume_url: string;
    cargo_nome: string | null;
    empresa_nome: string | null;
    created_at: string;
    updated_at: string;
    profile: UserProfile; // Aqui entra sua interface
}