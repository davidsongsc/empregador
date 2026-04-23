import { CandidateDetails } from "./applicationResult";
import { iAplicationResponse } from "./iAplicationResponse";
import { IModelBase } from "./iModelBase";
import { UserProfile } from "./userProfile";

export interface Application extends IModelBase {
    profile_id: string;
    job_id: string;
    candidate_id: string;
    status: string;
    profile: UserProfile;
    data_aplicacao: string;
    cargo_nome: string;
    empresa_nome: string;
    cover_letter: string | null;
    resume_url: string | null;
    respostas: iAplicationResponse[];
}