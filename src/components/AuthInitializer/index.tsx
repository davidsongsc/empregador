"use client";
import Cookies from "js-cookie";
import { UserData } from "@/interfaces/userData";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef } from "react";

// components/AuthInitializer.tsx
export function AuthInitializer({ serverUser }: { serverUser: UserData | null }) {
  const { setUser, isAuthenticated, isHydrated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // SÓ atualizamos se o servidor de fato encontrou um usuário
      // ou se o cliente ainda não está autenticado.
      if (serverUser) {
        setUser(serverUser);
      } else if (!Cookies.get('access')) {
        // Só limpamos se REALMENTE não houver cookie no navegador
        setUser(null);
      }
      initialized.current = true;
    }
  }, [serverUser]);

  return null;
}