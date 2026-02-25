"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logout } from "@/services/auth";
import SkeletonJob from "@/components/Loading";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";


type UserProfile = {
  name?: string;
  last_name?: string;
  full_name?: string;
  ocupation?: string;
  role?: string;
  bio?: string;
  foto?: string | null;
  endereco?: {
    id?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  };
};

type UserData = {
  id: string;
  whatsapp_number: string;
  is_active?: boolean;
  is_staff?: boolean;
  profile?: UserProfile;
  skills?: unknown[];
};

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
    // Não precisamos de setLoading(true) aqui se for apenas uma checagem em segundo plano,
    // mas na inicialização (useEffect) é essencial.
    try {
      const data = await checkSession();
      setUser(data.user);
    } catch (err) {
      setUser(null);
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
        <Header />
        <LoadingSpinner /> </> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}