"use client"
import React from "react"
import { Plus, Activity } from "lucide-react"

interface JobHeaderProps {
  obj?: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
  page: number;
  count: number;
  canAccess: boolean;
  onCreate: () => void;
}

const SaasHeader = ({ obj, page, count, canAccess, onCreate }: JobHeaderProps) => {
  const subtitle = obj?.subtitle || "Cadastro de Vagas";
  const words = subtitle.split(" ");
  const lastWord = words.pop(); // Remove e guarda a última palavra
  const firstPart = words.join(" "); // Junta o resto
  return (
    <header className="border-b border-delos-black bg-delos-surface shrink-0">
      <div className="w-full px-4 sm:px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-[8px] sm:text-[14px] font-black tracking-[0.4em] text-delos-amber uppercase leading-none mb-1">
                {obj?.title || "Cadastro"}
              </span>
              <span className="text-delos-grey mx-1">_</span>
              <span className="text-[7px] sm:text-[14px] font-mono text-delos-grey uppercase tracking-widest italic leading-none">
                Página_{page}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-light text-delos-black tracking-tighter uppercase leading-none">
              {firstPart} <span className="font-black">{lastWord}</span>
            </h1>
          </div>

          <div className="h-8 w-[1px] bg-delos-black hidden md:block" />

          <div className="hidden md:flex items-center gap-2 ">
            <Activity size={35} className="text-emerald-500 animate-pulse opacity-70" />
            <span className="text-[16px] font-mono text-delos-grey uppercase tracking-widest">
              {count} Ativas
            </span>
          </div>
        </div>

        <button
          onClick={onCreate}
          type="button"
          disabled={!canAccess}
          className={`group bg-delos-black text-delos-white px-3 sm:px-5 py-2 transition-all flex items-center gap-2 shadow-lg active:scale-95 rounded-sm 
            ${!canAccess
              ? 'opacity-50 bg-slate-800 cursor-not-allowed text-slate-400'
              : 'hover:bg-amber-600 hover:text-white'
            }`}
        >
          <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          <span className="font-black text-[9px] uppercase tracking-[0.1em] hidden sm:inline">
            Nova Vaga
          </span>
        </button>
      </div>
    </header>
  );
};

export default SaasHeader;