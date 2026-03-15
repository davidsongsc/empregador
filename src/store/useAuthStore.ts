import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData } from '@/interfaces/userData';
import { logout as apiLogout, checkSession } from '@/services/auth';
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

interface AuthState {
  user: UserData | null;
  activeCompanyId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
  lastUpdated: number; // Essencial para o Protocolo Delta

  // Ações
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
      lastUpdated: 0,

      setUser: (user) =>
        set((state) => {
          // 1. Verificação de Identidade e Integridade
          // Se o usuário for o mesmo, não disparamos re-render desnecessário
          if (user && state.user && state.user.id === user.id) {
            // Se houver campos novos (Delta), fazemos o merge
            const hasChanges = JSON.stringify(state.user) !== JSON.stringify(user);
            if (!hasChanges) return state;
          }

          const updatedUser = user ? { ...state.user, ...user } : null;
          const empresas = updatedUser?.profile?.empresas || [];

          // 2. Sincronização de Contexto da Empresa (Multi-tenant)
          // Prioridade: Cookie > Estado Atual > Primeira empresa da lista
          let activeId = getCookie("active_company") || state.activeCompanyId;

          if (!activeId && empresas.length === 1) {
            activeId = empresas[0].id;
            setCookie("active_company", activeId, { expires: 7 });
          }

          return {
            user: updatedUser,
            isAuthenticated: !!updatedUser,
            activeCompanyId: activeId,
            loading: false,
            lastUpdated: Date.now()
          };
        }),

      setActiveCompany: (id) => {
        if (id) {
          setCookie("active_company", id, { expires: 7 });
        } else {
          deleteCookie("active_company");
        }

        set({ activeCompanyId: id });
        console.log(`[AUTH_STORE] DELTA_SYNC: Active_Company -> ${id}`);
      },

      setLoading: (loading) => set({ loading }),

      setHydrated: (state) => set({ isHydrated: state }),

      logout: async () => {
        try {
          // Tenta avisar a VPS para invalidar a session/blacklist
          await apiLogout();
        } catch (err) {
          console.warn("[AUTH_STORE] Erro ao comunicar logout com a VPS.");
        } finally {
          // Limpeza atômica de persistência
          deleteCookie("active_company");
          localStorage.removeItem('freelacerto_auth_storage');

          set({
            user: null,
            activeCompanyId: null,
            isAuthenticated: false,
            loading: false,
            lastUpdated: Date.now()
          });

          // Redirecionamento físico para limpar estados de memória
          window.location.href = "/";
        }
      },

      // useAuthStore.ts
      refresh: async () => {
        const { lastUpdated, loading, isHydrated } = get();

        // 1. Bloqueio de Segurança: Não busca se já está carregando 
        // ou se foi atualizado há menos de 1 minuto (Throttling)
        const ONE_MINUTE = 60 * 1000;
        if (loading || (isHydrated && Date.now() - lastUpdated < ONE_MINUTE)) {
          return;
        }

        set({ loading: true });
        try {
          // 2. Protocolo Delta: Envia o timestamp para a VPS
          const data = await checkSession(lastUpdated);

          if (data?.no_changes) {
            // Importante: Atualizamos o timestamp mesmo no no_changes 
            // para reiniciar o contador de 1 minuto
            set({ lastUpdated: Date.now(), loading: false });
            return;
          }

          const userData = data?.user || data;
          if (userData) {
            get().setUser(userData);
          }
        } catch (err: any) {
          if (err.response?.status === 401) {
            // Se a VPS diz que a sessão expirou, apenas desloga no front 
            // SEM dar o redirect forçado que está no método logout()
            set({ user: null, isAuthenticated: false, loading: false });
          }
          console.error("[Delta X] Sync silenciado.");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'freelacerto_auth_storage',
      storage: createJSONStorage(() => localStorage),
      // Partialize: O que realmente vai para o disco para o Delta X
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeCompanyId: state.activeCompanyId,
        lastUpdated: state.lastUpdated
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Finaliza hidratação
        state.setHydrated(true);

        // Se o cache diz que não está autenticado, encerra o loading imediatamente
        if (!state.isAuthenticated) {
          state.setLoading(false);
        }
      },
    }
  )
);