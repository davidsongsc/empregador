import { JobResult } from "./jobResult";

export interface JobsResponse {
    total_count: number;
    total_pages: number; // 🔹 Este é o campo que o FastAPI está enviando
    page: number;
    page_count: number;
    results: JobResult[];
}