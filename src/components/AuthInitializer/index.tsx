"use client";
import { UserData } from "@/interfaces/userData";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef } from "react";

export function AuthInitializer({ serverUser }: { serverUser: UserData | null }) {
  const { setUser, setHydrated, isHydrated } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Executa apenas uma vez quando o app "acorda" (F5 ou primeiro acesso)
    if (!initialized.current) {
      
      if (serverUser) {
        // Se o servidor (SSR) encontrou a sessão nos cookies, sincronizamos o Zustand
        setUser(serverUser);
      } else {
        // Se o servidor não achou nada, limpamos o estado para garantir
        // Mas atenção: não checamos Cookies.get pois ele é HttpOnly
        setUser(null);
      }

      setHydrated(true); // Marca que o estado inicial foi resolvido
      initialized.current = true;
    }
  }, [serverUser, setUser, setHydrated]);

  return null;
}