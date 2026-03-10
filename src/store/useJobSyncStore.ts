import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useJobStore } from "./useJobStore";

interface JobSyncStore {
  lastSequenceId: string; // O nosso Hash de Integridade (Sequence ID do Django)
  isSyncing: boolean;
  
  // Ações
  syncData: (patches: any[], newHash: string) => void;
  setSyncing: (status: boolean) => void;
}

export const useJobSyncStore = create<JobSyncStore>()(
  persist(
    (set) => ({
      lastSequenceId: "0",
      isSyncing: false,

      setSyncing: (status) => set({ isSyncing: status }),

      syncData: (patches, newHash) => {
        // Acessamos a função de patch do store principal
        const { applyDeltaPatches } = useJobStore.getState();
        
        if (patches.length > 0) {
          applyDeltaPatches(patches);
        }

        set({ 
          lastSequenceId: newHash, 
          isSyncing: false 
        });
      },
    }),
    { name: "nexus-sync-metadata" }
  )
);