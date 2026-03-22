import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useJobStore } from "./useJobStore";
import { JobSyncStore } from "@/interfaces/isJobSyncStore";

export const useJobSyncStore = create<JobSyncStore>()(
  persist(
    (set, get) => ({
      lastSequenceId: "0",
      isSyncing: false,

      setSyncing: (status) => {
        // Evita disparar um novo estado se o status já for o mesmo
        if (get().isSyncing !== status) {
          set({ isSyncing: status });
        }
      },

      syncData: (patches, newHash) => {
        // 1. Evita atualizar se o Hash for idêntico (Redundância de segurança)
        if (get().lastSequenceId === newHash) {
          set({ isSyncing: false });
          return; // Aborta se já estamos sincronizados

        }

        const { applyDeltaPatches } = useJobStore.getState();

        // 2. Aplica os patches na store principal de Jobs
        if (patches && patches.length > 0) {
          applyDeltaPatches(patches);
        }

        // 3. Atualiza o metadado de sincronismo
        set({
          lastSequenceId: newHash,
          isSyncing: false
        });
      },
    }),
    {
      name: "freelacerto-sync-metadata",
      storage: createJSONStorage(() => localStorage), // Explícito para o Next.js
    }
  )
);