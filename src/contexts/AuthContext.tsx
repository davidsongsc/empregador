"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

const PUBLIC_ROUTES = ["/login", "/cadastro", "/", "/vagas"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, refresh, setLoading } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 1. O Zustand já hidratou o estado do localStorage automaticamente aqui.
    setIsHydrated(true);

    // 2. Disparamos a verificação real com o servidor em background.
    const verify = async () => {
      await refresh();
      
      // Regra de perfil incompleto (movemos para cá)
      const currentUser = useAuthStore.getState().user;
      if (currentUser && !currentUser.profile?.name && pathname !== "/perfil") {
        router.push("/perfil");
      }
    };

    verify();
  }, [refresh, pathname, router]);

  const isPublicPage = PUBLIC_ROUTES.includes(pathname);

  // PREVENÇÃO DE FLICKER: 
  // Enquanto o Zustand não carregou o localStorage, não renderizamos nada (é instantâneo).
  if (!isHydrated) return null;

  // LÓGICA DE PERFORMANCE:
  // Só mostramos o Loading Screen se:
  // - A página for privada
  // - O sistema ainda estiver validando (loading)
  // - E NÃO tivermos usuário no cache (Zustand isAuthenticated)
  if (loading && !isPublicPage && !isAuthenticated) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}