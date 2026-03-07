import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData } from '@/interfaces/userData';
import { logout as apiLogout, checkSession } from '@/services/auth';
import Cookies from 'js-cookie';

interface AuthState {
  user: UserData | null;
  activeCompanyId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;

  // AÇÕES (Faltava declarar aqui)
  setUser: (user: UserData | null) => void;
  setActiveCompany: (id: string | null) => void; 
  setLoading: (loading: boolean) => void;
  setHydrated: (state: boolean) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      activeCompanyId: null,
      isAuthenticated: false,
      loading: true,
      isHydrated: false,

      setUser: (user) => {
        const empresas = user?.profile?.empresas || [];
        
        // MELHORIA: Só resetamos para null se o usuário for NOVO ou se não houver 
        // um activeCompanyId já salvo (preservando a escolha anterior)
        const currentActiveId = get().activeCompanyId;
        const autoSelectedId = empresas.length === 1 ? empresas[0].id : currentActiveId;

        set({
          user,
          isAuthenticated: !!user,
          activeCompanyId: autoSelectedId, 
          loading: false,
        });
      },

      setActiveCompany: (id) => set({ activeCompanyId: id }),

      setLoading: (loading) => set({ loading }),

      setHydrated: (state) => set({ isHydrated: state }),

      logout: async () => {
        try {
          await apiLogout();
        } catch (err) {
          console.warn("Erro ao deslogar no servidor...");
        } finally {
          Cookies.remove('access', { path: '/' });
          localStorage.removeItem('freelacerto_auth_storage');
          set({ user: null, activeCompanyId: null, isAuthenticated: false, loading: false });
          window.location.href = '/login';
        }
      },

      refresh: async () => {
        // Não resetamos o activeCompanyId aqui para não causar flash de "empresa não selecionada"
        set({ loading: true });
        try {
          const data = await checkSession();
          const userData = data?.user || (data?.whatsapp_number ? data : null);

          if (userData) {
            // USAMOS get().activeCompanyId para garantir que a escolha persista após o refresh
            set({ 
              user: userData, 
              isAuthenticated: true, 
              loading: false 
              // Note que não tocamos no activeCompanyId, o persist cuida dele
            });
          } else {
            set({ user: null, activeCompanyId: null, isAuthenticated: false, loading: false });
          }
        } catch (err) {
          set({ user: null, activeCompanyId: null, isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: 'freelacerto_auth_storage',
      storage: createJSONStorage(() => localStorage),
      // O partialize garante o que VAI para o disco
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeCompanyId: state.activeCompanyId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setHydrated(true);
        state.setLoading(state.isAuthenticated);
      },
    }
  )
);