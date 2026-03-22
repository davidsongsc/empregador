"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, X, Terminal, Cpu, Activity, Palette, 
  Sun, Moon, Monitor, Zap 
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CompanySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanySelectorModal({ isOpen, onClose }: CompanySelectorModalProps) {
  const { user, setActiveCompany, activeCompanyId } = useAuthStore();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const empresas = user?.profile?.empresas || [];

  // Evita erro de hidratação ao ler o tema do localStorage
  useEffect(() => setMounted(true), []);

  if (!isOpen) return null;

  const handleSelect = (id: string, empresaName: string) => {
    setActiveCompany(id);
    // Sincronização automática de tema baseada na empresa
    if (empresaName.toLowerCase().includes("freelacerto")) {
      setTheme("light"); // Modo Delos Original
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#141414] w-full max-w-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/10 border border-amber-600/20">
              <Terminal size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Sincronizar_Matriz</h2>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Definindo Narrativa e Domínio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors text-slate-600 hover:text-amber-600">
            <X size={18} />
          </button>
        </div>

        {/* LISTA DE EMPRESAS */}
        <div className="p-4 space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar bg-[#101010]">
          <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 ml-1">Domínios_Disponíveis</p>
          {empresas.map((emp) => {
            const isSelected = activeCompanyId === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => handleSelect(emp.id, emp.name)}
                className={`w-full group flex items-center justify-between p-4 transition-all relative border ${
                  isSelected 
                    ? "bg-amber-600/[0.03] border-amber-600/40" 
                    : "bg-[#141414] border-white/[0.03] hover:border-amber-600/30"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all ${isSelected ? "bg-amber-600" : "bg-transparent group-hover:bg-amber-600/50"}`} />
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 bg-black/20 border transition-all ${isSelected ? "text-amber-500 border-amber-600/40" : "text-slate-500 border-white/5 group-hover:text-amber-500"}`}>
                    {isSelected ? <Activity size={18} className="animate-pulse" /> : <Cpu size={18} />}
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-white" : "text-slate-300"}`}>{emp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[7px] font-black px-1 py-0.5 bg-white/5 text-slate-500 uppercase tracking-tighter">Auth: {emp.role}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={isSelected ? "text-amber-500" : "text-slate-800"} size={16} />
              </button>
            );
          })}
        </div>

        {/* SELETOR DE TEMA (MODO DE EXIBIÇÃO) */}
        <div className="p-6 border-t border-white/5 bg-[#141414] space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} className="text-amber-600" />
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ajuste_de_Interface (Visual_Mode)</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-3 py-3 border transition-all ${
                mounted && theme === "light" 
                ? "bg-amber-600 text-white border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]" 
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              <Sun size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Delos_White</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-3 py-3 border transition-all ${
                mounted && theme === "dark" 
                ? "bg-amber-600 text-white border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]" 
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              <Moon size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Delos_Dark</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-[#0D0D0D] border-t border-white/5 flex justify-between items-center">
          <div className="flex flex-col">
             <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.2em]">Security_Level: {user?.profile?.role || 'Guest'}</span>
             <span className="text-[6px] font-mono text-amber-600/40 uppercase tracking-[0.1em]">Current_Mode: {mounted ? theme?.toUpperCase() : 'INITIALIZING...'}</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-amber-600/30 rounded-full" />
            <div className="w-1 h-1 bg-amber-600/60 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-amber-600/90 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d9770640; }
      `}</style>
    </div>
  );
}