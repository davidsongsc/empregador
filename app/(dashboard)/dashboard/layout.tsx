"use client";

import { useEffect, useState } from "react";
import { LogOut, Bell, Menu, X, Cpu, Radio, Shield } from "lucide-react";
import SidebarNav from "@/components/MiniComponents/SidebarNav";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, isHydrated, logout } = useAuthStore();


  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-slate-400 font-sans flex overflow-hidden">
      {/* OVERLAY MOBILE - Estilo Blur Delos */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Estilo Industrial/Terminal */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/5 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo Corporativa Westworld */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex flex-col">
              <span className="text-sm font-black text-white tracking-[0.3em] uppercase">
                Freela <span className="text-amber-600">Certo.</span>
              </span>
              <span className="text-[7px] text-slate-600 font-mono tracking-[0.4em] uppercase mt-1">
                Admin Terminal v4
              </span>
            </div>
            <button
              className="lg:hidden p-1 text-slate-500 hover:text-amber-600"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegação - O componente SidebarNav deve idealmente herdar o estilo escuro */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <SidebarNav />
          </div>

          {/* Rodapé da Sidebar - Sessão do Usuário */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-3 px-2 py-3 rounded-none border border-white/5 bg-white/[0.01]">
              <Shield size={14} className="text-amber-600/50" />
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Protocolo Seguro Ativo</span>
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:text-rose-500 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/20 transition-all group cursor-pointer"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-black">Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO À DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TOPBAR HUD */}
        <header className="h-16 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sm:px-10 shrink-0 z-30">
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-amber-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Status do Sistema (Esquerda da Topbar - Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Link: Estável</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio size={12} className="text-slate-700" />
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Sinc: 100%</span>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            {/* Notificações */}
            <button className="relative p-2 text-slate-600 hover:text-amber-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping"></span>
            </button>

            {loading ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="w-8 h-8 rounded-none bg-white/5 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] font-black text-white tracking-widest uppercase leading-none">
                    {user?.profile?.name || "Operador"}
                  </p>
                  <p className="text-[8px] text-amber-600/60 font-bold uppercase tracking-tighter mt-1">
                    Nível: {user?.profile?.role || "Acesso Básico"}
                  </p>
                </div>

                {/* Avatar Terminal Style */}
                <div className="relative group">
                  <div className="absolute inset-0 border border-amber-600/20 group-hover:border-amber-600/50 transition-colors -m-1" />
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-amber-600 text-[10px] font-black border border-white/10 relative overflow-hidden">
                    {user?.profile?.name?.substring(0, 2).toUpperCase() || "DX"}
                    {/* Efeito Scan Line no Avatar */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-full w-full animate-scan" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {children}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #080808;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1A1A1A;
          border-radius: 0px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2A2A2A;
        }
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
}