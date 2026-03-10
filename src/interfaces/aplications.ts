import { CandidateDetails } from "./applicationResult";

export interface Application {
    id: string;
    status: string;
    data_aplicacao: string;
    candidate_details: CandidateDetails;
}