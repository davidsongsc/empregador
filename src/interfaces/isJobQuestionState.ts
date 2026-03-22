import { JobQuestion } from "./iJobQuestion";
import { JobsResponse } from "./ijobResponse";
export interface QuestionCacheEntry {
    items: JobQuestion[];
    hash: string; // O data_hash da sua API
    updatedAt: number;
}

export interface JobQuestionState {
    questions: JobQuestion[];
    loadingQuestions: boolean;
    questionCache: Record<string, QuestionCacheEntry>; // Chave será o jobId

    // Actions
    fetchQuestions: (jobId: string, force?: boolean) => Promise<void>;
    clearQuestionCache: (jobId?: string) => void;
}

interface CacheEntry {
    data: JobsResponse;
    timestamp: number;
}

interface JobsCacheState {
    // O cache é um mapa: { "usuario=123&page=1": { data, timestamp } }
    cache: Record<string, CacheEntry>;
    setCache: (key: string, data: JobsResponse) => void;
    getCache: (key: string, ttl: number) => JobsResponse | null;
    invalidate: (key?: string) => void;
}