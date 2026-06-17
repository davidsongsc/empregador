"use client";

import { LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import SidebarNav from "@/components/MiniComponents/SidebarNav";
import { useState } from "react";
import SelectCompanyModal from "@/components/Modal/SelectCompany";

interface AdminSidebarProps {
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ isOpen, isActive, onClose, onLogout }: AdminSidebarProps) => {
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para o recolhimento

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
        fixed inset-y-0 left-0 z-50 bg-delos-surface border-r border-white/[0.03] 
        transform transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-0" : "w-70"} 
      `}>

        {/* BOTÃO PARA RECOLHER (COLLAPSE TRIGGER) - Visível apenas em Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={` hidden lg:flex absolute ${isCollapsed ? "-right-4" : "-right-0"}
           w-4 h-screen bg-delos-black border border-white/[0.05] items-center justify-center
            text-delos-amber hover:bg-delos-amber hover:text-black hover:w-8 ${isCollapsed ? "hover:-right-8" : ""} transition-all z-[60]`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="h-full flex flex-col overflow-hidden">

          {/* LOGO AREA */}
          <div className={`p-2 transition-all duration-500 ${isCollapsed ? "opacity-0 invisible h-0 p-0" : "opacity-100"}`}>
            <div className="flex flex-col group cursor-default">
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="group flex items-center text-[13px] font-black tracking-[0.4em] uppercase transition-all active:scale-95 outline-none"
              >
                <span className={`px-3 py-1 transition-all duration-500 ${isActive ? 'bg-delos-amber text-delos-black' : 'bg-delos-black/10 text-delos-amber'}`}>
                  Freela
                </span>
                <span className="border border-delos-black/10 px-3 py-1 ml-1 text-delos-black bg-transparent group-hover:bg-delos-black group-hover:text-delos-amber transition-all">
                  Facil
                </span>
              </button>
            </div>
          </div>

          {/* ÍCONE SUBSTITUTO QUANDO RECOLHIDO */}
          {isCollapsed && (
            <div className="flex justify-center py-10 text-delos-amber animate-in fade-in zoom-in">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/[0.02]">
                <span className="text-[10px] font-black italic">FF</span>
              </div>
            </div>
          )}

          {/* NAV DIRECTORIES */}
          <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
            <div className={`mb-4 transition-all duration-300 ${isCollapsed ? "px-0" : "px-0"}`}>
              {!isCollapsed && (
                <p className="text-[11px] font-bold text-delos-grey uppercase tracking-[0.3em] mb-6 opacity-40">Main_System</p>
              )}
              {/* Note: O SidebarNav precisaria aceitar a prop isCollapsed para esconder textos dos links se desejar */}
              <SidebarNav isCollapsed={isCollapsed} />
            </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="p-6 bg-[#0A0A0A] border-t border-white/[0.03]">
            <button
              onClick={onLogout}
              className={`flex items-center transition-all group ${isCollapsed ? "justify-center w-10 h-10 mx-auto border-white/5 border" : "w-full justify-between px-4 py-3 border border-white/5"}`}
              title="De-authorize"
            >
              {!isCollapsed && <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-white">Log_Off</span>}
              <LogOut className={`w-3 h-3 text-slate-500 group-hover:text-red-500 transition-all ${isCollapsed ? "" : "group-hover:translate-x-1"}`} />
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