import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Role {
  id: number;
  uid?: string; // Adicionado para bater com seu componente de Modal
  name: string;
  category?: string; // Adicionado para bater com seu componente de Modal
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
  lastHash: string; 
  loading: boolean;
  lastUpdated: number; 
  
  // Actions
  setInitialRoles: (roles: Role[], hash: string) => void;
  applyDelta: (patches: RolePatch[], newHash: string) => void;
  setLoading: (status: boolean) => void;
  resetStore: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      roles: [],
      lastHash: "0",
      loading: false,
      lastUpdated: 0,

      setLoading: (status) => set({ loading: status }),

      // Carga completa: Resetamos o timestamp para agora
      setInitialRoles: (roles, hash) => set({ 
        roles, 
        lastHash: hash, 
        lastUpdated: Date.now(), 
        loading: false 
      }),

      // PROTOCOLO DELTA: Aplica patches e renova o frescor do cache
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
              // Evita duplicatas se o polling rodar duas vezes
              if (!currentRoles.find(r => r.id === patch.id)) {
                currentRoles = [patch.data as Role, ...currentRoles];
              }
              break;
          }
        });

        return { 
          roles: currentRoles, 
          lastHash: newHash, 
          lastUpdated: Date.now(), // Atualiza para o cálculo de 10 dias
          loading: false 
        };
      }),

      // Útil para Logout ou Debugging
      resetStore: () => set({ 
        roles: [], 
        lastHash: "0", 
        lastUpdated: 0, 
        loading: false 
      }),
    }),
    { 
      name: "delos-roles-cache",
      // Opcional: define quais campos persistir
      partialize: (state) => ({ 
        roles: state.roles, 
        lastHash: state.lastHash, 
        lastUpdated: state.lastUpdated 
      }),
    }
  )
);