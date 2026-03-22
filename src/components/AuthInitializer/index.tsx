"use client";
import { UserData } from "@/interfaces/userData";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef } from "react";

// AuthInitializer.tsx
// AuthInitializer.tsx
export function AuthInitializer({ serverUser }: { serverUser: UserData | null }) {
  const { setUser, setHydrated, refresh } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true; // Marca como disparado IMEDIATAMENTE

      if (serverUser) {
        setUser(serverUser);
      } else {
        // Só busca se o servidor não enviou nada e o app está "acordando"
        refresh();
      }
      setHydrated(true);
    }
  }, []); // Dependências vazias para rodar apenas no mount

  return null;
}