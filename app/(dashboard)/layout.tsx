"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/useAuthStore";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  // Adicionamos o isHydrated para saber se o AuthInitializer já terminou de ler o serverUser
  const { isAuthenticated, loading, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // SÓ redirecionamos se:
    // 1. O Store já foi hidratado (o AuthInitializer já rodou)
    // 2. O carregamento de sessão terminou
    // 3. O usuário realmente não está autenticado
    if (isHydrated && !loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, isHydrated, router]);

  // Enquanto o Zustand não foi populado pelo AuthInitializer ou ainda está buscando o /me/
  if (!isHydrated || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  // Se após a hidratação confirmarmos que não está logado, bloqueamos o conteúdo 
  // enquanto o useEffect acima dispara o router.replace
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}