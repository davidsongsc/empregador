import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData } from '@/interfaces/userData';
import { logout as apiLogout, checkSession } from '@/services/auth';
import Cookies from 'js-cookie';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;

  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (state: boolean) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true, 
      isHydrated: false,

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
          Cookies.remove('access', { path: '/' });
          localStorage.removeItem('freelacerto_auth_storage');
          set({ user: null, isAuthenticated: false, loading: false });
          window.location.href = '/login';
        }
      },

      refresh: async () => {
        try {
          const data = await checkSession();
          if (data?.user) {
            set({ user: data.user, isAuthenticated: true, loading: false });
          } else {
            // Se a API diz que não tem user, limpa tudo
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (err) {
          set({ user: null, isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: 'freelacerto_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Marca como hidratado
        state.setHydrated(true);

        /**
         * REMOVIDO: state.setUser(null) baseado no cookie JS.
         * MOTIVO: Se o cookie for HttpOnly, o JS não o vê e desloga o usuário por erro.
         * Deixe que o AuthInitializer decida se deve limpar baseado no serverUser.
         */
        
        state.setLoading(false);
      },
    }
  )
);