import React from "react";
import { ChevronLeft, Search } from "lucide-react";
import { STATUS_CONFIG } from "@/data/statusLabels";
import { useRouter } from "next/navigation";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  total: number;
  loading: boolean;
}

export const CandidateFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  total,
  loading,
}: FiltersProps) => {
  const router = useRouter();

  return (
    <header className="border-b border-delos-grey bg-delos-surface backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-8xl mx-auto px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* LADO ESQUERDO: NAVEGAÇÃO E STATUS DO SISTEMA */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 hover:bg-delos-surface  rounded-xl border border-delos-surface/5 group transition-all"
          >
            <ChevronLeft size={20} className="text-delos-amber group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-md md:text-lg font-black tracking-[0.3em] uppercase text-delos-black">
              Gestão de <span className="text-delos-amber">Staff</span>
            </h1>
            <p className="text-[11px] font-bold text-delos-grey tracking-[0.2em] uppercase italic">
              {loading ? "Sincronizando..." : `${total} Candidatos Identificados`}
            </p>
          </div>
        </div>

        {/* LADO DIREITO: INPUTS DE FILTRO */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-delos-amber transition-colors" />
            <input
              type="text"
              value={searchTerm}
              placeholder="BUSCAR NOME..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-delos-surface/5 border border-delos-surface/10 rounded-none py-2.5 pl-9 pr-4 text-[10px] tracking-widest focus:border-delos-amber/50 outline-none transition-all w-48 lg:w-64 uppercase text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-delos-surface/5 border border-delos-surface/10 text-[10px] font-bold tracking-widest px-4 py-2.5 outline-none uppercase focus:border-delos-amber text-slate-300 rounded-none cursor-pointer appearance-none"
          >
            <option value="all">STATUS: TODOS</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key} className="bg-[#0A0A0A]">
                {val.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};