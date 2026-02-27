"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/useAuthStore";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Se parou de carregar e NÃO está autenticado, manda pro login
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Enquanto o AuthContext verifica o cookie de 30 dias...
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  // Se não está logado, bloqueia a renderização enquanto o router.replace acontece
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Opcional: Coloque o Header fixo aqui se todas as páginas privadas usarem */}
      <Header />
      <main>{children}</main>
    </div>
  );
}