import { Role } from "@/interfaces/iRoles";
import { RoleState } from "@/interfaces/isRoleState";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const CACHE_TTL = 10 * 24 * 60 * 60 * 1000; // 10 Dias em milissegundos

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      roles: [],
      lastHash: "0",
      loading: false,
      lastUpdated: 0,

      setLoading: (status) => set({ loading: status }),

      // Chamado quando o servidor envia a lista completa ou nova
      setInitialRoles: (roles, hash) => set({
        roles,
        lastHash: hash,
        lastUpdated: Date.now(),
        loading: false,
      }),

      // Adiciona o cargo recém-criado no topo sem esperar o polling do Delta
      addRoleLocal: (role) => set((state) => ({
        roles: [role, ...state.roles],
        lastUpdated: Date.now() // Renova o frescor por interação do usuário
      })),

      // Verifica se já passou de 10 dias desde a última sync
      isCacheStale: () => {
        const { lastUpdated, roles } = get();
        if (roles.length === 0) return true;
        return Date.now() - lastUpdated > CACHE_TTL;
      },
      applyDelta: (patches, newHash) => {
        const { roles } = get();
        let updatedRoles = [...roles];

        patches.forEach((patch) => {
          switch (patch.type) {
            case "CREATED":
              if (patch.data) {
                // Evita duplicatas se o addRoleLocal já tiver adicionado
                const exists = updatedRoles.some(r => r.id === patch.id);
                if (!exists) updatedRoles.unshift(patch.data as Role);
              }
              break;

            case "UPDATED":
              updatedRoles = updatedRoles.map((r) =>
                r.id === patch.id ? { ...r, ...patch.data } : r
              );
              break;

            case "DELETED":
              updatedRoles = updatedRoles.filter((r) => r.id !== patch.id);
              break;
          }
        });

        set({
          roles: updatedRoles,
          lastHash: newHash,
          lastUpdated: Date.now(),
          loading: false,
        });
      },

      resetStore: () => set({
        roles: [],
        lastHash: "0",
        lastUpdated: 0,
        loading: false,
      }),
    }),
    {
      name: "delos-roles-cache", // Chave no LocalStorage
      storage: createJSONStorage(() => localStorage),
      // Persistimos apenas o essencial para reconstruir o estado
      partialize: (state) => ({
        roles: state.roles,
        lastHash: state.lastHash,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);