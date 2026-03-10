"use client";

import { useState, useMemo } from 'react';
import {
  Search, MapPin, Loader2, Briefcase,
  ChevronRight, Building2, Sparkles, Clock,
  SearchX, Lock, Target, Binary, Filter
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import JobApplyModal from '@/components/JobApplyModal';

const VagasPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { jobs, metadata, loading } = useJobs(currentPage, 120, selectedCategory);
  const [openApply, setOpenApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleOpenApply = (job: any) => {
    setSelectedJob(job);
    setOpenApply(true);
  };

  const { displayData, isGrouped, totalFound } = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return { displayData: [], isGrouped: false, totalFound: 0 };

    const filtered = jobs.filter(job => {
      const term = search.toLowerCase();
      return (
        job.cargo_exibicao?.toLowerCase().includes(term) ||
        job.empresa_nome?.toLowerCase().includes(term)
      );
    });

    const shouldGroup = !search;

    if (shouldGroup) {
      const groups = filtered.reduce((acc: any, job) => {
        const key = job.role_details?.name || job.cargo_exibicao;
        if (!acc[key]) acc[key] = [];
        acc[key].push(job);
        return acc;
      }, {});
      return { displayData: Object.entries(groups), isGrouped: true, totalFound: filtered.length };
    }

    return { displayData: filtered, isGrouped: false, totalFound: filtered.length };
  }, [jobs, search]);

  return (
    <div className="min-h-screen bg-delos-surface pt-20 md:pt-32 pb-10 px-4 md:px-8 relative overflow-x-hidden">
      {/* Background Grid - Mais sutil em mobile */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] md:opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-8 md:mb-16 space-y-6 md:space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-delos-amber animate-pulse" />
                <span className="text-[9px] font-black text-delos-amber uppercase tracking-[0.3em]">Protocolo_RH</span>
              </div>
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-delos-black uppercase italic tracking-tighter leading-[0.9]">
                Oportunidades
              </h1>
              <p className="text-[10px] md:text-xs font-bold text-delos-grey uppercase tracking-widest mt-2">
                Sistemas ativos: <span className="text-delos-black">{totalFound} unidades detectadas</span>
              </p>
            </div>

            {/* Search Bar - Compacta em Mobile */}
            <div className="relative group w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-delos-grey w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="FILTRAR_CARGO..."
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-delos-black focus:ring-1 focus:ring-black transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Categorias - Scroll horizontal melhorado */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-100/50">
            <button
              onClick={() => { setSelectedCategory(null); setSearch(""); }}
              className={`whitespace-nowrap px-4 py-2 text-[9px] font-black  uppercase tracking-tighter transition-all rounded-md ${!selectedCategory && !search ? 'bg-black text-white' : 'text-delos-grey hover:bg-gray-100'}`}
            >
              Todos_Protocolos
            </button>
            {metadata.categorias.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 text-[9px] font-black uppercase tracking-tighter transition-all rounded-md border ${selectedCategory === cat ? 'border-delos-amber text-delos-amber' : 'border-transparent text-delos-grey hover:border-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-delos-black animate-spin mb-4" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Acessando Dataframe...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-white/50 border border-dashed border-gray-200 p-12 md:p-20 rounded-[32px] text-center flex flex-col items-center">
              <SearchX className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-widest">Nenhuma ocorrência encontrada</h3>
              <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="mt-4 text-delos-amber font-black text-[9px] uppercase tracking-widest hover:underline">Reiniciar busca</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {displayData.map((item: any) => {

                // --- MODO AGRUPADO (CARD COMPACTO) ---
                if (isGrouped) {
                  const [cargo, items] = item;
                  return (
                    <div
                      key={cargo}
                      onClick={() => setSearch(cargo)}
                      className="group bg-white p-6 rounded-[24px] border border-gray-100 hover:border-black transition-all cursor-pointer flex flex-col justify-between min-h-[220px] relative overflow-hidden shadow-sm hover:shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-delos-black group-hover:text-white transition-colors">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded text-[8px] font-black tracking-tighter">
                          {items.length} {items.length > 1 ? 'VAGAS' : 'VAGA'}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-lg font-black delos-black uppercase italic leading-tight group-hover:text-delos-amber transition-colors line-clamp-2">
                          {cargo}
                        </h3>
                        <p className="text-[8px] font-bold text-delos-grey uppercase tracking-widest mt-1 opacity-60">
                          ID: {items[0].role_details?.category || 'Geral'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                        <span className="text-[8px] font-black text-delos-grey uppercase tracking-widest">Ver_Cluster</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                }

                // --- CARD DE VAGA INDIVIDUAL (Otimizado) ---
                const job = item;
                return (
                  <div
                    key={job.uid}
                    className="bg-white p-5 rounded-[24px] border border-gray-100 hover:border-delos-amber transition-all shadow-sm flex flex-col justify-between min-h-[280px] group relative"
                  >
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[7px] font-black uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                          {job.tipo_vaga}
                        </span>
                        {job.salario && (
                          <span className="text-[7px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-widest">
                            R$ {job.salario}
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-lg md:text-xl delos-black uppercase italic tracking-tighter leading-tight group-hover:text-delos-amber transition-colors mb-4 line-clamp-2">
                        {job.cargo_exibicao}
                      </h3>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          {job.empresa_nome ? (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tight text-gray-600">
                              <Building2 className="w-3.5 h-3.5 text-delos-amber" />
                              <span className="truncate">{job.empresa_nome}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                              <Lock className="w-3 h-3" /> Confidencial
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] font-medium text-delos-grey uppercase tracking-tight italic">
                          <MapPin className="w-3.5 h-3.5" /> 
                          {job.endereco?.cidade || job.local || "Remoto"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenApply(job)}
                      className="mt-6 w-full py-3.5 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-delos-amber transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Sincronizar
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* PAGINAÇÃO COMPACTA */}
        {!loading && displayData.length > 0 && (
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6 md:gap-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                className="text-[9px] font-black uppercase text-delos-grey hover:text-black transition-all tracking-widest"
              >
                Prev
              </button>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black">{currentPage.toString().padStart(2, '0')}</span>
                <div className="h-[1px] w-12 md:w-24 bg-gray-200 relative">
                  <div
                    className="absolute h-full bg-black transition-all duration-500"
                    style={{ width: `${(currentPage / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-gray-300">05</span>
              </div>

              <button 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="text-[9px] font-black uppercase text-delos-grey hover:text-black transition-all tracking-widest"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <JobApplyModal
        open={openApply}
        onClose={() => setOpenApply(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default VagasPage;