"use client"; 
import { useState } from "react";
import { Building2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { CompanySelectorModal } from "@/components/Modal/CompanySelectorModal";

export function CompanySwitcher() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Só mostra o botão se o usuário tiver mais de uma empresa
  const empresas = user?.profile?.empresas || [];
  if (empresas.length <= 1) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          hidden lg:flex
          fixed bottom-6 right-6
          items-center gap-2
          px-4 py-3
          bg-indigo-600 text-white
          rounded-xl shadow-lg
          hover:bg-indigo-700
          transition z-50
        "
      >
        <Building2 size={18} />
        <span className="font-bold">Trocar Unidade</span>
      </button>

      <CompanySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}