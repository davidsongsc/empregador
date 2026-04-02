"use client";

import { LogOut, Thermometer } from "lucide-react";
import SidebarNav from "@/components/MiniComponents/SidebarNav";
import { useState } from "react";
import SelectCompanyModal from "@/components/Modal/SelectCompany";
import { ThemePanel } from "@/components/Modal/ThemeModal";

interface AdminSidebarProps {
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ isOpen, isActive, onClose, onLogout }: AdminSidebarProps) => {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-delos-surface/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-delos-surface border-r border-delos-amber/[0.03] 
        transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* LOGO AREA */}
          <div className="p-8 pb-12">
            <div className="flex flex-col group cursor-default">
              <button
                onClick={() => setIsCompanyModalOpen(true)} // Altere para o nome da sua state que abre o modal
                className="group flex items-center text-[13px] font-black tracking-[0.4em] uppercase transition-all active:scale-95 outline-none focus:ring-0"
                title="Mudar Empresa"
              >
                {/* Parte "Freela" */}
                <span className={`px-3 py-1 transition-all duration-500 ${isActive
                  ? 'bg-delos-amber text-delos-black shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                  : 'bg-delos-black/10 text-delos-amber'
                  } group-hover:bg-delos-amber group-hover:text-delos-black group-hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]`}
                >
                  Freela
                </span>

                {/* Parte "Facil" */}
                <span className="border border-delos-black/10 px-3 py-1 ml-1 text-delos-black bg-transparent group-hover:bg-delos-black group-hover:text-delos-amber transition-all duration-300 flex items-center gap-2">
                  Facil
                  {/* Opcional: um pequeno ícone de troca para indicar que é clicável */}
                  <div className="w-1 h-1 bg-delos-amber rounded-full animate-pulse opacity-0 group-hover:opacity-100" />
                </span>
              </button>
              <div className="flex items-center gap-2 mt-0 opacity-90 relative left-1/2 transform -translate-x-1/2">
                <div className={`h-[1px] bg-delos-amber transition-all duration-1000 ${isActive ? 'w-full' : 'w-0'}`} />

                <span className="text-[11px] font-mono tracking-[0.5em] uppercase whitespace-nowrap">É Isso</span>

              </div>
            </div>
          </div>
  

          {/* NAV DIRECTORIES */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div className="mb-4 px-4">
              <p className="text-[13px] font-bold text-delos-grey uppercase tracking-[0.3em] mb-4">Menu Principal</p>
              <SidebarNav />
            </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="p-6 bg-[#0A0A0A] border-t border-white/[0.03]">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 hover:border-amber-600/30 transition-all group"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] font-black">De-authorize</span>
              <LogOut className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
        </div>
        
      </aside>
      
      <SelectCompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

    </>

  );
};