import { CandidateDetails } from "./applicationResult";
import { UserProfile } from "./userProfile";

export interface Application {
    id: string;
    status: string;
    data_aplicacao: string;
    profile: UserProfile;
}