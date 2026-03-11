"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Suspense } from "react";
import LoginTrigger from "@/components/MiniComponents/LoginTrigger";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: isLoading } = useAuthStore(); // Supondo que seu store tenha loading
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se o carregamento terminou e não temos usuário
    if (!isLoading && !user) {
      // Injetamos o parâmetro na URL para o Trigger abrir o Modal
      // Mantemos o usuário na página atual (pathname)
      router.replace(`${pathname}?showLogin=true&from=${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  // Enquanto verifica ou se não estiver logado, você pode optar por 
  // esconder o conteúdo sensível (children)
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-delos-surface flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-delos-amber border-t-transparent animate-spin rounded-full" />
          <span className="text-[10px] text-delos-grey tracking-[0.3em] uppercase">
            Verificando_Protocolos...
          </span>
        </div>
        <Suspense fallback={null}>
           <LoginTrigger />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>
    </>
  );
}