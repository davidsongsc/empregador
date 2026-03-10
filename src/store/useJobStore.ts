import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JobResult } from "@/interfaces/jobResult";

interface CacheEntry {
  results: JobResult[];
  count: number;
  metadata: any;
  etag?: string; // Aqui guardaremos o Sequence ID (Hash de Integridade)
  updatedAt: number;
}

interface JobPatch {
  uid: string;
  type: 'CREATED' | 'UPDATED' | 'DELETED';
  data: Partial<JobResult>;
}

interface JobState {
  cache: Record<string, CacheEntry>;
  setCache: (key: string, data: CacheEntry) => void;
  // APLICAÇÃO DELTA: Modifica apenas os campos alterados vindos do servidor
  applyDeltaPatches: (patches: JobPatch[]) => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      cache: {},
      setCache: (key, data) =>
        set((state) => ({ cache: { ...state.cache, [key]: data } })),

      applyDeltaPatches: (patches: JobPatch[]) => set((state) => {
        const newCache = { ...state.cache };

        Object.keys(newCache).forEach(key => {
          let currentResults = [...newCache[key].results];

          patches.forEach(patch => {
            switch (patch.type) {
              case 'UPDATED':
                currentResults = currentResults.map(job =>
                  job.uid === patch.uid ? { ...job, ...patch.data } : job
                );
                break;
              case 'DELETED':
                currentResults = currentResults.filter(job => job.uid !== patch.uid);
                break;
              case 'CREATED':
                // Só adiciona se não estiver no array para evitar duplicatas em tempo real
                if (!currentResults.find(j => j.uid === patch.uid)) {
                  currentResults = [patch.data as JobResult, ...currentResults];
                }
                break;
            }
          });

          newCache[key].results = currentResults;
        });

        return { cache: newCache };
      }),
    }),
    { name: "jobs-delta-storage" }
  )
);