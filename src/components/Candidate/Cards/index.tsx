import { ChevronLeft, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation"; // Importação correta para o App Router
import React from "react";

interface StatusConfig {
  [key: string]: {
    label: string;
  };
}

interface CandidateFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  total: number;
  loading: boolean;
  STATUS_CONFIG: StatusConfig;
}

export const CandidateFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  total,
  loading,
  STATUS_CONFIG,
}: CandidateFiltersProps) => {
  const router = useRouter(); // Instanciado internamente para facilitar o uso na página

  return (
    <header className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Lado Esquerdo: Navegação e Info */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()} 
            className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 group transition-all"
            type="button"
          >
            <ChevronLeft size={20} className="text-amber-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-[0.3em] uppercase text-white leading-none">
              Gestão de <span className="text-amber-600">Staff</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase italic mt-1">
              {loading ? "Sincronizando..." : `${total} Candidatos Identificados`}
            </p>
          </div>
        </div>

        {/* Lado Direito: Filtros */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              placeholder="BUSCAR NOME..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-none py-2.5 pl-9 pr-4 text-[10px] tracking-widest focus:border-amber-600/50 outline-none transition-all w-48 lg:w-64 uppercase text-white placeholder:text-slate-700"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest px-4 pr-10 py-2.5 outline-none uppercase focus:border-amber-600 text-slate-300 rounded-none cursor-pointer appearance-none min-w-[160px]"
            >
              <option value="all">STATUS: TODOS</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key} className="bg-[#0A0A0A] text-white">
                  {val.label.toUpperCase()}
                </option>
              ))}
            </select>
            {/* Ícone de seta customizado para compensar o appearance-none */}
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};