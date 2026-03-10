"use client";

import { LogOut } from "lucide-react";
import SidebarNav from "@/components/MiniComponents/SidebarNav";

interface AdminSidebarProps {
  isOpen: boolean;
  isActive: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminSidebar = ({ isOpen, isActive, onClose, onLogout }: AdminSidebarProps) => {
  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-white/[0.03] 
        transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col">
          {/* LOGO AREA */}
          <div className="p-8 pb-12">
            <div className="flex flex-col group cursor-default">
              <div className="flex items-center text-[13px] font-black tracking-[0.4em] uppercase">
                <span className={`px-3 py-1 transition-all duration-1000 ${isActive ? 'bg-amber-600 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'bg-white/10 text-white'}`}>
                  Freela
                </span>
                <span className="border border-white/10 px-3 py-1 ml-1 text-white hover:bg-white hover:text-black transition-colors">
                  Certo
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 opacity-50">
                <div className={`h-[1px] bg-amber-600 transition-all duration-1000 ${isActive ? 'w-full' : 'w-0'}`} />
                <span className="text-[8px] font-mono tracking-[0.5em] uppercase whitespace-nowrap">É Isso</span>
              </div>
            </div>
          </div>

          {/* NAV DIRECTORIES */}
          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            <div className="mb-4 px-4">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4">Main Directories</p>
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
    </>
  );
};