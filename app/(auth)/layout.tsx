"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o cara JÁ ESTÁ logado e tenta ver Login/Cadastro, manda pro Início
    if (!loading && isAuthenticated) {


    }
    else {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <LoadingScreen />;

  // Se não está autenticado, permite ver as telas de login/cadastro
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );
}