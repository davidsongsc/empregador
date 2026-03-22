import { JobCacheEntry, JobResult } from "./iJob";

export interface JobPatch {
    uid: string;
    type: 'CREATED' | 'UPDATED' | 'DELETED';
    data: Partial<JobResult>;
}
export interface iJobCategoryResponse {
    name: string;
    total_vagas: number;
}


export interface JobState {
    cache: Record<string, JobCacheEntry>;
    categoriesCache: Record<number, {
        results: iJobCategoryResponse[];
        updatedAt: number
    }>;
    globalTotal: number;
    loading: boolean;
    error: string | null;
    currentRequest: string | null;

    // Discovery & Stats
    categories: iJobCategoryResponse[];
    categoriesLoading: boolean;
    categoriesUpdatedAt: number;
    total_vagas: number;
    total_vagas_freela: number;
    total_vagas_efetivo: number;
    total_vagas_prestador: number;

    // ACTIONS
    fetchJobsDelta: (companyId: string) => Promise<void>;
    fetchJobs: (params: any, user: any, selectedCategory?: any, isSilent?: boolean) => Promise<void>;
    fetchCategories: (page?: number, force?: boolean) => Promise<void>;
    applyDeltaPatches: (patches: JobPatch[]) => void;
    removeJobFromCache: (jobId: string) => void;
    fetchJobById: (uid: string, companyId: string) => Promise<JobResult>;
    clearCache: () => void;
}