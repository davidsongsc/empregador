import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface RolePatch {
  id: number;
  type: 'CREATED' | 'UPDATED' | 'DELETED';
  data: Partial<Role>;
}

interface RoleState {
  roles: Role[];
  lastHash: string; // Sequence ID do Django
  loading: boolean;
  
  // Actions
  setInitialRoles: (roles: Role[], hash: string) => void;
  applyDelta: (patches: RolePatch[], newHash: string) => void;
  setLoading: (status: boolean) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      roles: [],
      lastHash: "0",
      loading: false,

      setLoading: (status) => set({ loading: status }),

      // Carga completa (Primeiro acesso ou Invalidação total)
      setInitialRoles: (roles, hash) => set({ 
        roles, 
        lastHash: hash, 
        loading: false 
      }),

      // PROTOCOLO DELTA: Modifica apenas os nós alterados
      applyDelta: (patches, newHash) => set((state) => {
        let currentRoles = [...state.roles];

        patches.forEach((patch) => {
          switch (patch.type) {
            case 'UPDATED':
              currentRoles = currentRoles.map(r => 
                r.id === patch.id ? { ...r, ...patch.data } : r
              );
              break;
            case 'DELETED':
              currentRoles = currentRoles.filter(r => r.id !== patch.id);
              break;
            case 'CREATED':
              if (!currentRoles.find(r => r.id === patch.id)) {
                currentRoles = [patch.data as Role, ...currentRoles];
              }
              break;
          }
        });

        return { roles: currentRoles, lastHash: newHash, loading: false };
      }),
    }),
    { name: "delos-roles-cache" }
  )
);