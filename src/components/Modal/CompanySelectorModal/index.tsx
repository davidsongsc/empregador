"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ChevronRight, X, Terminal, Cpu, Activity } from "lucide-react";

interface CompanySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanySelectorModal({ isOpen, onClose }: CompanySelectorModalProps) {
  // 1. Capturamos o activeCompanyId para o destaque
  const { user, setActiveCompany, activeCompanyId } = useAuthStore();
  
  const router = useRouter();
  const empresas = user?.profile?.empresas || [];

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setActiveCompany(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="bg-[#141414] w-full max-w-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />

        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600/10 border border-amber-600/20">
              <Terminal size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Mudar_Equipe</h2>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Selecione o domínio de operação</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 transition-colors text-slate-600 hover:text-amber-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#101010]">
          {empresas.map((emp) => {
            // 2. Lógica de Identificação da Empresa Ativa
            const isSelected = activeCompanyId === emp.id;

            return (
              <button
                key={emp.id}
                onClick={() => handleSelect(emp.id)}
                className={`
                  w-full group flex items-center justify-between p-4 transition-all relative overflow-hidden border
                  ${isSelected 
                    ? "bg-amber-600/[0.03] border-amber-600/40 shadow-[inset_0_0_20px_rgba(217,119,6,0.05)]" 
                    : "bg-[#141414] border-white/[0.03] hover:bg-[#1A1A1A] hover:border-amber-600/30"}
                `}
              >
                {/* Indicador Lateral: Fica fixo e brilhante se selecionado */}
                <div className={`
                  absolute left-0 top-0 bottom-0 w-[2px] transition-all
                  ${isSelected ? "bg-amber-600 shadow-[0_0_10px_#d97706]" : "bg-transparent group-hover:bg-amber-600/50"}
                `} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`
                    p-3 bg-black/20 border transition-all
                    ${isSelected 
                      ? "text-amber-500 border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.1)]" 
                      : "text-slate-500 border-white/5 group-hover:text-amber-500 group-hover:border-amber-600/20"}
                  `}>
                    {/* 3. Ícone muda para Activity (pulso) se for a ativa */}
                    {isSelected ? <Activity size={18} className="animate-pulse" /> : <Cpu size={18} />}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                        {emp.name}
                      </p>
                      {/* Pequeno LED indicador de ACTIVE */}
                      {isSelected && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-amber-600 shadow-[0_0_5px_#d97706]" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[7px] font-black px-1 py-0.5 uppercase tracking-tighter ${isSelected ? "bg-amber-600/20 text-amber-500" : "bg-white/5 text-slate-500"}`}>
                        Auth: {emp.role}
                      </span>
                      <span className={`text-[7px] font-mono uppercase ${isSelected ? "text-amber-600" : "text-amber-600/40"}`}>
                        Sector_{emp.id.substring(0, 4).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className={`transition-all ${isSelected ? "text-amber-500 translate-x-1" : "text-slate-800 group-hover:text-amber-600 translate-x-0 group-hover:translate-x-1"}`} size={16} />
              </button>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-[#0D0D0D] border-t border-white/5 flex justify-between items-center">
          <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.2em]">Delos_Security_Protocol: Active</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-amber-600/30 rounded-full" />
            <div className={`w-1 h-1 rounded-full ${activeCompanyId ? "bg-amber-600/60 animate-pulse" : "bg-amber-600/30"}`} />
            <div className="w-1 h-1 bg-amber-600/90 rounded-full animate-pulse" />
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