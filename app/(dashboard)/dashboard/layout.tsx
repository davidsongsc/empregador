"use client";

import { useEffect, useState } from "react";
import { LogOut, Bell, Menu, X, Radio, Shield, Terminal, Activity } from "lucide-react";
import SidebarNav from "@/components/MiniComponents/SidebarNav";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, isHydrated, logout } = useAuthStore();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsActive(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-sans flex  overflow-hidden selection:bg-amber-600/30">
      
      {/* VESTÍGIO ANALÓGICO */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - DELOS INFRASTRUCTURE */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-white/[0.03] transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
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
                <span className="text-[8px] font-mono tracking-[0.5em] uppercase whitespace-nowrap">Admin System</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
             <div className="mb-4 px-4">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4">Main Directories</p>
                <SidebarNav />
             </div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border-t border-white/[0.03]">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 hover:border-amber-600/30 transition-all group"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] font-black">De-authorize</span>
              <LogOut className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOPBAR HUD */}
        <header className="h-20 bg-[#050505] border-b border-white/[0.03] flex items-center justify-between px-6 sm:px-10 shrink-0 z-30">
          <div className="flex items-center gap-8">
            <button className="lg:hidden p-2 border border-white/10 hover:border-amber-600 transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-4 h-4 text-amber-600" />
            </button>

            <div className="hidden md:flex items-center gap-10">
              <div className="flex flex-col text-[7px] uppercase tracking-[0.3em] text-slate-600 font-black">
                Grid Status
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
                  <span className="text-[10px] font-mono text-slate-300 italic tracking-normal">Stable.042</span>
                </div>
              </div>
              <div className="flex flex-col text-[7px] uppercase tracking-[0.3em] text-slate-600 font-black">
                Sat-Link
                <div className="flex items-center gap-2 mt-1">
                  <Activity size={10} className="text-amber-600" />
                  <span className="text-[10px] font-mono text-slate-300 italic tracking-normal">Active_Sync</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:block pr-6 border-r border-white/5">
               <span className="text-[9px] font-mono text-slate-700">COORD: 34.42 / 118.07</span>
            </div>

            <button className="p-2 text-slate-500 hover:text-amber-500 transition-colors relative">
              <Terminal className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1 h-1 bg-amber-600 rounded-full"></span>
            </button>

            <div className="flex items-center gap-4 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white tracking-[0.15em] uppercase leading-none">{user?.profile?.name || "Access_Denied"}</p>
                <p className="text-[8px] text-amber-600 font-mono uppercase tracking-tighter mt-1">Auth_Level: {user?.profile?.role || "L1_GUEST"}</p>
              </div>
              <div className="relative group p-1">
                <div className="absolute inset-0 border border-amber-600/10 group-hover:border-amber-600/40 transition-all rounded-full" />
                <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center overflow-hidden relative font-black text-amber-600 text-[10px]">
                  {user?.profile?.name?.substring(0, 2).toUpperCase() || "DX"}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent animate-scan" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO - OCUPA TUDO AGORA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
            <div className="w-full h-full p-4 sm:p-8 lg:p-0">
              {/* O children agora respira em toda a largura disponível */}
              {children}
            </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d97706; }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-scan { animation: scan 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}