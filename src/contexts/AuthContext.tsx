"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logout } from "@/services/auth";
import SkeletonJob from "@/components/Loading";
import { useRouter } from "next/navigation";
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

  async function refreshSession() {
    try {
      const data = await checkSession();
      console.log("Sessão recuperada:", data); // Verifique isso no console da Vercel
      setUser(data.user);
    } catch (err) {
      console.error("Falha na sessão em produção:", err);
      setUser(null);
      // Em produção, se der erro aqui, o middleware da Vercel pode estar limpando os cookies
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error("Erro ao deslogar no servidor", err);
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login"); // Garante que o usuário saia da página protegida
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

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
      {/* Se estiver carregando a sessão pela primeira vez, 
        mostramos a animação de loading para evitar que o 
        usuário veja flash de conteúdo não autorizado.
      */}
      {loading ? <>
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <Header />
          <LoadingSpinner />
        </div></> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}