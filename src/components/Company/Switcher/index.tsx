"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect
import { RefreshCw, Box } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { CompanySelectorModal } from "@/components/Modal/CompanySelectorModal";

export function CompanySwitcher() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Novo estado

  // Lógica para monitorar o scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Opção A: Aparece após rolar 300px
      // Opção B: Aparece só no final (scrollTop + clientHeight >= scrollHeight - 50)
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const empresas = user?.profile?.empresas || [];
  if (empresas.length <= 1) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          fixed bottom-6 right-6 lg:bottom-8 lg:right-8
          flex items-center justify-center
          w-12 h-12 lg:w-auto lg:h-auto lg:px-5 lg:py-4
          bg-[#121212] text-slate-500
          border border-white/5
          hover:border-amber-600/50 hover:text-white
          transition-all duration-700 z-50
          group overflow-hidden
          shadow-[0_20px_50px_rgba(0,0,0,0.8)]
          ${isVisible 
            ? "translate-y-0 opacity-100 pointer-events-auto" 
            : "translate-y-20 opacity-0 pointer-events-none"}
        `}
      >
        {/* ... conteúdo interno do botão permanece igual ... */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20" />
        <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative flex items-center gap-4">
          <div className="relative w-4 h-4">
            <Box 
              size={16} 
              className="absolute inset-0 group-hover:scale-75 group-hover:opacity-0 transition-all duration-500" 
            />
            <RefreshCw 
              size={16} 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 text-amber-600" 
            />
          </div>

          <div className="hidden lg:flex flex-col border-l border-white/10 pl-4">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse" />
              <div className="w-1.5 h-1.5 bg-white/10" />
              <div className="w-1.5 h-1.5 bg-white/10" />
            </div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] mt-1 text-slate-600 group-hover:text-amber-600 transition-colors">
              Mudar_Equipe
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-600 group-hover:w-full transition-all duration-700" />
      </button>

      <CompanySelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}