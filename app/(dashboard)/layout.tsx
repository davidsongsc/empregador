"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { MODULE_PERMISSIONS } from "@/constants/permissions";
import { toast } from "@/components/Notification";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  // 1. Lógica de extração baseada no array de empresas
  const hasAccess = useMemo(() => {
    if (!user?.profile?.empresas || user.profile.empresas.length === 0) {
      return false;
    }

    // Verifica se existe alguma empresa onde o cargo do usuário está na lista de permissões
    return user.profile.empresas.some(empresa => 
      MODULE_PERMISSIONS.RECRUITMENT.includes(empresa.role) && empresa.is_active
    );
  }, [user]);

  useEffect(() => {
    if (isHydrated && !hasAccess) {
      // Pegamos o cargo da primeira empresa apenas para o log/toast, se existir
      const currentRole = user?.profile?.empresas?.[0]?.role || "GUEST";
      
      toast.error(`Acesso negado. Seu cargo (${currentRole}) não tem permissão.`);
      router.replace("/vagas");
    }
  }, [isHydrated, hasAccess, user, router]);

  // --- RENDERIZAÇÃO ---
  if (!isHydrated || !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}