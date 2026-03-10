import { JobResult } from "./jobResult";

export interface JobsResponse {
    count: number;
    next: string | null;      // ADICIONADO: URL para a próxima página
    previous: string | null;  // ADICIONADO: URL para a página anterior
    results: JobResult[];
}