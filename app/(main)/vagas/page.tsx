"use client";

import { useState, useMemo } from 'react';
import {
  Search, MapPin, Loader2, Briefcase,
  ChevronRight, Building2, Sparkles, Clock,
  SearchX, Lock, Target, Binary
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import JobApplyModal from '@/components/JobApplyModal';

const VagasPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { jobs, loading, error } = useJobs(currentPage);
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
      const matchesSearch =
        job.cargo_exibicao?.toLowerCase().includes(term) ||
        job.empresa_nome?.toLowerCase().includes(term);
      const matchesCategory = !selectedCategory || job.role_details?.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const shouldGroup = !search && !selectedCategory;

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
  }, [jobs, search, selectedCategory]);

  const categories = Array.from(new Set(jobs?.map(j => j.role_details?.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-4 md:px-8 relative">
      {/* Calibration Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER INDUSTRIAL */}
        <header className="mb-16 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-600 animate-pulse" />
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Protocolo_Vagas_v2.6</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
                Oportunidades
              </h1>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Detecção de <span className="text-black">{totalFound} unidades</span> de trabalho disponíveis.
              </p>
            </div>

            <div className="relative group w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="PROCURAR_CARGO..."
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-5 pl-12 pr-6 shadow-sm focus:border-black outline-none transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-gray-100">
            <button
              onClick={() => { setSelectedCategory(null); setSearch(""); }}
              className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${!selectedCategory && !search ? 'bg-black text-white shadow-xl' : 'bg-transparent text-gray-400 hover:text-black'}`}
            >
              Todos_Protocolos
            </button>
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => { setSelectedCategory(cat as string); setSearch(""); }}
                className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-xl' : 'bg-transparent text-gray-400 hover:text-black'}`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 space-y-6">
              <Loader2 className="w-12 h-12 text-black animate-spin" strokeWidth={1} />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] animate-pulse">Sincronizando Matriz...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-white p-20 rounded-[48px] border border-gray-100 text-center flex flex-col items-center shadow-sm">
              <SearchX className="w-16 h-16 text-gray-100 mb-6" />
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Dados não encontrados</h3>
              <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="mt-6 text-amber-600 font-black text-[10px] uppercase tracking-widest hover:underline">Reiniciar busca</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayData.map((item: any) => {

                // --- MODO AGRUPADO (CARD DE DESCOBERTA) ---
                if (isGrouped) {
                  const [cargo, items] = item;
                  const displayJob = items[0];

                  return (
                    <div
                      key={cargo}
                      onClick={() => setSearch(cargo)}
                      className="group bg-white p-10 rounded-[40px] border border-gray-100 hover:border-black hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 cursor-pointer flex flex-col justify-between h-[420px] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6">
                        <div className="bg-gray-50 text-black px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest flex items-center gap-2 border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                          <Binary className="w-3 h-3" />
                          {items.length} {items.length > 1 ? 'UNIDADES' : 'UNIDADE'}
                        </div>
                      </div>

                      <div>
                        <div className="mb-10 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all duration-500">
                          <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                          {cargo}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-3 italic">
                          Cluster: {displayJob.role_details?.category || 'Geral'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-10">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Analisar_Matriz</span>
                        <div className="bg-black text-white p-3 rounded-xl group-hover:bg-indigo-600 group-hover:translate-x-2 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // --- MODO INDIVIDUAL (LISTA DETALHADA) ---
                const job = item;
                return (
                  <div
                    key={job.uid}
                    className="bg-white p-8 rounded-[40px] border border-transparent hover:border-indigo-600 transition-all shadow-sm flex flex-col justify-between h-[450px] animate-in fade-in slide-in-from-bottom-4 duration-700 group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="font-black text-black uppercase italic tracking-tighter text-2xl leading-none group-hover:text-indigo-600 transition-colors">{job.cargo_exibicao}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className='text-[9px] font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-md text-gray-500'>
                          {job.tipo_vaga}
                        </span>
                        <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest ${job.salario
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-amber-600 bg-amber-50'
                          }`}>
                          {job.salario ? `R$ ${job.salario}` : 'Compensação_A_Definir'}
                        </span>
                      </div>

                      <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-3">
                          {job.empresa_nome ? (
                            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black/80">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                              {job.empresa_nome}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600 border border-red-100 bg-red-50/50 px-3 py-1 rounded-lg">
                              <Lock className="w-3 h-3" />
                              <span className="uppercase tracking-[0.2em] text-[9px] font-black">Unidade_Confidencial</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                          <MapPin className="w-4 h-4" /> {job.endereco ? job.endereco.cidade : (job.local || "Remoto")}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenApply(job)}
                      className="w-full py-5 bg-black text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group active:scale-95"
                    >
                      Sincronizar_Protocolo
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* PAGINAÇÃO TÉCNICA */}
        {!loading && displayData.length > 0 && (
          <div className="mt-24 flex flex-col items-center gap-6">
            <div className="flex items-center gap-12">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-all tracking-[0.4em] italic">Anterior</button>
              
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-black">0{currentPage}</span>
                <div className="h-[2px] w-24 bg-gray-100 relative">
                  <div 
                    className="absolute h-full bg-black transition-all duration-500" 
                    style={{ width: `${(currentPage / 5) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-black text-gray-300">05</span>
              </div>

              <button onClick={() => setCurrentPage(p => p + 1)} className="text-[10px] font-black uppercase text-gray-400 hover:text-black transition-all tracking-[0.4em] italic">Próximo</button>
            </div>
            <span className="text-[8px] font-mono text-gray-300 uppercase tracking-widest">Diagnostic Page Index // Calibration Active</span>
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