import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserData } from '@/interfaces/userData';
import { logout as apiLogout, checkSession } from '@/services/auth';
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { toast } from '@/components/Notification';

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

        }
      },

      // useAuthStore.ts
      refresh: async () => {
        const state = get();

        // 1. BLOQUEIO DE SEGURANÇA: Se já estiver carregando ou não estiver hidratado, aborte.
        if (state.loading || !state.isHydrated) return;

        // 2. PROTOCOLO DELTA: Evite refresh se a última atualização foi há menos de 10 segundos
        // Isso evita loops causados por re-renders rápidos do React
        const now = Date.now();
        if (now - state.lastUpdated < 10000) {
          set({ loading: false });
          return;
        }

        set({ loading: true });
        try {
          const data = await checkSession();

          if (data?.no_changes) {
            // Importante: Atualizamos o timestamp mesmo no no_changes 
            // para reiniciar o contador de 1 minuto
            set({ loading: false });
            return;
          }

          const userData = data?.user || data;
          if (userData) {
            get().setUser(userData);
          }
        } catch (err: any) {
          let backendError = "Erro ao processar solicitação.";

          // Se o FastAPI retornar erro de validação (422)
          if (err.response?.data?.detail && Array.isArray(err.response.data.detail)) {
            const errorDetail = err.response.data.detail[0];
            const campo = errorDetail.loc[1]; // ex: "email"
            const mensagem = errorDetail.msg;  // ex: "value is not a valid email address"

            backendError = `Erro no campo ${campo}: ${mensagem}`;
          }
          // Se for um erro manual que você deu raise (400)
          else if (err.response?.data?.detail) {
            backendError = err.response.data.detail;
          }

          toast.error(backendError);
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