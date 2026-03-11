"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Terminal, Activity, Sun, Moon, 
  Zap, Cpu, HardDrive, ShieldCheck 
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemePanel() {
  const { user } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <div className="hidden lg:block w-full max-w-md font-mono">
      {/* Trocamos o bg-[#141414] fixo pelo bg-delos-surface 
          e as bordas fixas por border-delos-black/10 ou similar 
      */}
      <div className="bg-delos-surface w-full border border-delos-grey/20 shadow-2xl overflow-hidden relative transition-colors duration-500">
        
        {/* SCANLINES & VIGNETTE - Opacidade reduzida para o modo Light */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-20 dark:opacity-40" />

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-delos-grey/10 bg-delos-black/[0.03] dark:bg-delos-black/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/30 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-delos-amber/10 border border-delos-amber/20">
              <Terminal size={16} className="text-delos-amber" />
            </div>
            <div>
              <h2 className="text-xs font-black text-delos-black uppercase tracking-[0.3em]">System_Override</h2>
              <p className="text-[8px] text-delos-grey font-mono uppercase tracking-widest mt-0.5">Console de Calibração</p>
            </div>
          </div>
        </div>

        {/* TELEMETRIA DO SISTEMA */}
        <div className="p-5 bg-delos-black/[0.02] dark:bg-black/20 border-b border-delos-grey/10 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 opacity-60">
              <Cpu size={10} className="text-delos-amber" />
              <span className="text-[7px] text-delos-black uppercase tracking-widest">Proc_Load</span>
            </div>
            <div className="h-1 w-full bg-delos-grey/10 overflow-hidden">
              <div className="h-full bg-delos-amber/40 w-[65%] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 border-l border-delos-grey/10 pl-4">
            <div className="flex items-center gap-2 opacity-60">
              <HardDrive size={10} className="text-delos-amber" />
              <span className="text-[7px] text-delos-black uppercase tracking-widest">Mem_Sync</span>
            </div>
            <div className="h-1 w-full bg-delos-grey/10 overflow-hidden">
              <div className="h-full bg-delos-amber/40 w-[42%] animate-pulse delay-700" />
            </div>
          </div>
        </div>

        {/* SELETOR DE TEMA */}
        <div className="p-6 space-y-4 relative bg-delos-surface">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={10} className="text-delos-amber animate-bounce" />
            <p className="text-[8px] font-black text-delos-grey uppercase tracking-[0.2em]">Visual_Domain_Selection</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center justify-center gap-3 py-6 border transition-all duration-300 relative group ${
                mounted && theme === "light" 
                ? "bg-delos-amber text-white border-delos-amber shadow-[0_0_20px_rgba(217,119,6,0.2)]" 
                : "bg-delos-black/[0.03] border-delos-grey/20 text-delos-grey hover:border-delos-amber/50"
              }`}
            >
              <Sun size={20} className={mounted && theme === "light" ? "text-white" : "group-hover:text-delos-amber"} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Delos_White</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center justify-center gap-3 py-6 border transition-all duration-300 relative group ${
                mounted && theme === "dark" 
                ? "bg-delos-amber text-white border-delos-amber shadow-[0_0_20px_rgba(217,119,6,0.2)]" 
                : "bg-delos-black/[0.03] border-delos-grey/20 text-delos-grey hover:border-delos-amber/50"
              }`}
            >
              <Moon size={20} className={mounted && theme === "dark" ? "text-white" : "group-hover:text-delos-amber"} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Delos_Dark</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 bg-delos-black/[0.05] dark:bg-black/40 border-t border-delos-grey/10 flex justify-between items-center">
          <div className="flex flex-col">
             <div className="flex items-center gap-1.5">
                <ShieldCheck size={8} className="text-emerald-500" />
                <span className="text-[6px] font-mono text-delos-grey uppercase tracking-widest">Lvl: {user?.profile?.role || 'Guest'}</span>
             </div>
             <div className="flex items-center gap-1.5 mt-0.5">
                <Activity size={8} className="text-delos-amber animate-pulse" />
                <span className="text-[6px] font-mono text-delos-amber/40 uppercase tracking-widest">Link: Established</span>
             </div>
          </div>
          <div className="text-[7px] text-delos-grey font-black uppercase tracking-tighter opacity-50">
             V.3.0_DLS
          </div>
        </div>
      </div>
    </div>
  );
}