"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { checkSession, logout } from "@/services/auth";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { UserData } from "@/interfaces/userData";

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // refreshSession é a função que "consulta" o Remember Me indiretamente
  const refreshSession = useCallback(async () => {
    try {
      // O browser envia os cookies automaticamente aqui
      const data = await checkSession();
      const userData = data.user;
      
      setUser(userData);

      // --- REGRA DE REDIRECIONAMENTO ---
      // Se logado sem nome no perfil, obriga a ir para /perfil
      if (userData && !userData.profile?.name && pathname !== "/perfil") {
        router.push("/perfil");
      }
    } catch (err) {
      // Se não houver cookie (sessão expirada), user vira null
      setUser(null);
      
      // Opcional: Proteger rotas privadas aqui ou via Middleware
      const privateRoutes = ["/perfil", "/dashboard", "/vagas/postar"];
      if (privateRoutes.some(route => pathname.startsWith(route))) {
        router.push("/login");
      }
    } finally {
      // O loading só vira false APÓS a tentativa de recuperar sessão
      setLoading(false);
    }
  }, [pathname, router]);

  const logoutUser = async () => {
    try {
      setLoading(true);
      await logout(); // Backend limpa os Cookies HttpOnly
    } catch (err) {
      console.error("Erro ao deslogar", err);
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  // Inicialização única ao montar o app
  useEffect(() => {
    refreshSession();
  }, []); // Removido refreshSession da dependência para evitar disparos em loop

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshSession,
        logoutUser,
      }}
    >
      {/* ESTADO DE CARREGAMENTO GLOBAL:
          Se o usuário tiver o "Remember Me" ativo, este spinner aparecerá 
          por alguns milissegundos enquanto o cookie é validado.
      */}
      {loading ? (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center space-y-4">
          <div className="opacity-10 scale-75">
             <Header />
          </div>
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
              Autenticando...
            </span>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}