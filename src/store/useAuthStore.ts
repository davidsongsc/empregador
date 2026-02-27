import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData } from '@/interfaces/userData';
import { logout as apiLogout, checkSession } from '@/services/auth';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean; // Novo: para saber quando o localStorage foi lido

  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (state: boolean) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      isHydrated: false,

      // Centralizamos a lógica de login/update aqui
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user, 
          loading: false 
        }),

      setLoading: (loading) => set({ loading }),
      
      setHydrated: (state) => set({ isHydrated: state }),

      logout: async () => {
        try {
          await apiLogout();
        } finally {
          // Limpa tudo de uma vez para evitar estados fantasmas
          set({ user: null, isAuthenticated: false, loading: false });
          localStorage.removeItem('freelacerto_auth_storage');
          window.location.href = '/login';
        }
      },

      refresh: async () => {
        try {
          const data = await checkSession();
          // Se o servidor retornar user, o setUser acima será disparado pela api.ts
          // mas garantimos a atualização aqui também por segurança
          set({ user: data.user, isAuthenticated: !!data.user, loading: false });
        } catch (err) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: 'freelacerto_auth_storage',
      storage: createJSONStorage(() => localStorage),
      // Crucial: define o que o React deve carregar do disco
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      // Avisa o app quando terminar de ler o localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.setLoading(false);
      },
    }
  )
);