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
      loading: true, // Começa em true para evitar flash de conteúdo público
      isHydrated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),

      setHydrated: (state) => set({ isHydrated: state }),

      logout: async () => {
        try {
          // 1. Tenta avisar o backend para invalidar a sessão
          await apiLogout();
        } catch (err) {
          console.warn("Erro ao deslogar no servidor, limpando localmente...");
        } finally {
          // 2. Limpa TUDO, independente de erro na API
          // Se o cookie de acesso não for HttpOnly, o remove funciona.
          // Se for HttpOnly, o backend já deve ter limpado no apiLogout.
          Cookies.remove('access', { path: '/' }); 
          
          // Limpa o storage do Zustand manualmente
          localStorage.removeItem('freelacerto_auth_storage');
          
          set({ user: null, isAuthenticated: false, loading: false });
          
          // 3. Redireciona via window.location para limpar qualquer estado residual de memória
          window.location.href = '/login';
        }
      },

      refresh: async () => {
        // Se já estiver carregando, não dispara outro refresh
        set({ loading: true });
        try {
          const data = await checkSession();
          
          // Ajuste para lidar com diferentes formatos de resposta do Django
          const userData = data?.user || (data?.whatsapp_number ? data : null);

          if (userData) {
            set({ user: userData, isAuthenticated: true, loading: false });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (err) {
          // Se o /me/ falhar (401), o usuário não está logado
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

        // Ao terminar de ler o localStorage, marca como hidratado
        state.setHydrated(true);

        // Se o localStorage diz que está logado, mantemos o loading 
        // até que o AuthInitializer/checkSession confirme a validade do cookie.
        if (state.isAuthenticated) {
            state.setLoading(true);
        } else {
            state.setLoading(false);
        }
      },
    }
  )
);