"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logout as apiLogout, checkSession } from '@/services/auth';
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";
import { toast } from '@/components/Notification';
import { AuthState } from '@/interfaces/isAuthState';

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
          // 1. Verificação de Identidade (Evita loops de re-render)
          if (user && state.user && state.user.id === user.id) {
            const hasChanges = JSON.stringify(state.user) !== JSON.stringify(user);
            if (!hasChanges) return { ...state, loading: false };
          }

          // 2. Protocolo de Logout (Limpeza Atômica)
          if (!user) {
            deleteCookie("active_company");
            return {
              user: null,
              isAuthenticated: false,
              activeCompanyId: null,
              loading: false,
              lastUpdated: Date.now()
            };
          }

          // 3. Merge de Dados (Preserva campos locais se necessário)
          const updatedUser = { ...state.user, ...user };
          
          // 4. Lógica Multi-tenant (Ajustada para Single vs Multi Company)
          const memberships = updatedUser?.profile?.memberships || updatedUser?.memberships || [];
          let activeId = getCookie("active_company") || state.activeCompanyId;

          // --- AJUSTE SOLICITADO ---
          if (memberships.length === 1) {
            // Se só tem uma empresa, força ela como ativa (Protocolo de Conveniência)
            activeId = memberships[0].company_id;
            setCookie("active_company", activeId, 7);
          } else if (memberships.length > 1) {
            // Se tem várias, valida se a que está no cache/estado ainda é válida
            const stillHasAccess = memberships.some((m: any) => m.company_id === activeId);
            if (!stillHasAccess) {
              // Se perdeu acesso ou não tem nada setado, não força a primeira
              // Deixa o usuário escolher no seletor do Header
              activeId = null;
              deleteCookie("active_company");
            }
          } else {
            // Caso raro: Usuário sem nenhuma membership
            activeId = null;
            deleteCookie("active_company");
          }

          return {
            user: updatedUser,
            isAuthenticated: true,
            activeCompanyId: activeId,
            loading: false,
            lastUpdated: Date.now()
          };
        }),

      setActiveCompany: (id) => {
        // 1. Sincronização de Persistência (Cookies para SSR/Middleware)
        if (id) {
          // Definimos o cookie com path "/" para garantir que a API e o Next.js o vejam em qualquer rota
          setCookie("active_company", id, 7);
        } else {
          deleteCookie("active_company");
        }

        // 2. Sincronização de Estado (Zustand para Client-side)
        set({
          activeCompanyId: id,
          // Dica: Atualize o timestamp para forçar o 'refresh' da sessão se necessário
          lastUpdated: Date.now()
        });

        console.log(`[AUTH_STORE] DELTA_SYNC: Active_Company -> ${id}`);

        // 3. (Opcional) Forçar Re-fetch de dados globais
        // Se você tiver uma função que busca as vagas da empresa, 
        // você pode disparar um evento aqui ou deixar que o useEffect dos componentes reaja ao activeCompanyId.
      },

      setLoading: (loading) => set({ loading }),

      setHydrated: (state) => set({ isHydrated: state }),

      logout: async () => {
        try {
          await apiLogout();
        } catch (err) {
          console.warn("[AUTH_STORE] Erro ao comunicar logout com a API. Limpando localmente.");
        } finally {
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

      refresh: async () => {
        const state = get();
        if (!state.isHydrated) return;

        const now = Date.now();
        if (now - state.lastUpdated < 10000 && state.user) {
          set({ loading: false });
          return;
        }

        set({ loading: true });
        try {
          const data = await checkSession();

          if (!data || data.authenticated === false) {
            if (state.isAuthenticated) {
              get().logout();
            }
            return;
          }

          const userData = data.user;
          if (userData) {
            get().setUser(userData);
          }
        } catch (err: any) {
          if (state.isAuthenticated) {
            console.error("[AUTH_STORE] Revalidação de sessão falhou.");
            if (err.response?.status === 401) get().logout();
          }
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'freelacerto_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeCompanyId: state.activeCompanyId,
        lastUpdated: state.lastUpdated
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.setHydrated(true);

        if (state.isAuthenticated) {
          state.refresh();
        } else {
          state.setLoading(false);
        }
      },
    }
  )
);