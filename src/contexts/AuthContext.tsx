"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkSession, logout } from "@/services/auth";


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

  async function refreshSession() {
    setLoading(true);
    try {
      const data = await checkSession();
      // O backend retorna { user: { ... } }, pegamos a propriedade correta
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser() {
    await logout();
    setUser(null);
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}