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
  
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>
    </>
  );
}