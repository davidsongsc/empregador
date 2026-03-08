import { create } from 'zustand';
import { JobsResponse } from '@/interfaces/jobResponse';

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

export const useJobsCacheStore = create<JobsCacheState>((set, get) => ({
  cache: {},

  setCache: (key, data) => set((state) => ({
    cache: { 
      ...state.cache, 
      [key]: { data, timestamp: Date.now() } 
    }
  })),

  getCache: (key, ttl) => {
    const entry = get().cache[key];
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttl;
    if (isExpired) return null;

    return entry.data;
  },

  invalidate: (key) => set((state) => {
    if (key) {
      const newCache = { ...state.cache };
      delete newCache[key];
      return { cache: newCache };
    }
    return { cache: {} };
  })
}));