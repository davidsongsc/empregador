import { JobsCacheState } from '@/interfaces/isJobQuestionState';
import { create } from 'zustand';

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