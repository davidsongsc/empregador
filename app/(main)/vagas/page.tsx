"use client";

import { useState, useMemo } from 'react';
import {
  Search, MapPin, Loader2, Briefcase,
  ChevronRight, Building2, Sparkles, Clock,
  ArrowLeft, SearchX,
  Lock
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';

const VagasPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { jobs, loading, error } = useJobs(currentPage);

  // --- LÓGICA DE EXIBIÇÃO ADAPTATIVA ---
  const { displayData, isGrouped, totalFound } = useMemo(() => {
    if (!jobs || !Array.isArray(jobs)) return { displayData: [], isGrouped: false, totalFound: 0 };

    // 1. Filtragem Base (Respeita busca e categoria)
    const filtered = jobs.filter(job => {
      const term = search.toLowerCase();
      const matchesSearch =
        job.cargo_exibicao?.toLowerCase().includes(term) ||
        job.empresa_nome?.toLowerCase().includes(term);

      const matchesCategory = !selectedCategory || job.role_details?.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // 2. Decisão: Agrupar se não houver filtro ativo
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
    <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER MINIMALISTA */}
        <header className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                Oportunidades
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Explore <span className="text-indigo-600 font-bold">{totalFound} vagas</span> disponíveis agora.
              </p>
            </div>

            <div className="relative group w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Cargo ou empresa..."
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => { setSelectedCategory(null); setSearch(""); }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${!selectedCategory && !search ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-100'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => { setSelectedCategory(cat as string); setSearch(""); }}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </header>

        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sincronizando mercado...</p>
            </div>
          ) : displayData.length === 0 ? (
            <div className="bg-white p-16 rounded-[40px] border border-gray-100 text-center flex flex-col items-center shadow-sm">
              <SearchX className="w-12 h-12 text-gray-200 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Nenhum resultado encontrado</h3>
              <button onClick={() => { setSearch(""); setSelectedCategory(null); }} className="mt-4 text-indigo-600 font-black text-xs uppercase hover:underline">Limpar busca</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayData.map((item: any) => {

                // --- MODO AGRUPADO (CARD DE DESCOBERTA) ---
                if (isGrouped) {
                  const [cargo, items] = item;
                  const displayJob = items[0];

                  return (
                    <div
                      key={cargo}
                      onClick={() => setSearch(cargo)} // ATIVA O FILTRO AO CLICAR
                      className="group bg-white p-6 rounded-[32px] border border-gray-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Sparkles className="w-3 h-3" />
                          {items.length} {items.length > 1 ? 'VAGAS' : 'VAGA'}
                        </div>
                      </div>

                      <div>
                        <div className="mb-6 text-gray-400 group-hover:text-indigo-600 transition-colors">
                          <Briefcase className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {cargo}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          {displayJob.role_details?.category || 'Geral'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-8">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver Oportunidades</span>
                        <div className="bg-gray-900 text-white p-2.5 rounded-xl group-hover:bg-indigo-600 transition-all">
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
                    className="bg-white p-4 rounded-[32px] border-2 border-transparent hover:border-indigo-600 transition-all shadow-sm flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-black text-gray-900 leading-tight text-lg">{job.cargo_exibicao}</h3>
                      </div>
                      <div className="flex justify-between items-start mb-4">
                        <span className='font-bold text-black'>
                          {job.tipo_vaga}
                        </span>
                        <span className={`text-[11px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${job.salario
                          ? 'text-green-600 bg-green-50'
                          : 'text-red-600 bg-red-50'
                          }`}>
                          {job.salario ? `R$ ${job.salario}` : 'A combinar'}
                        </span>
                      </div>
                      <div className="space-y-3 mb-8">

                        <div className="flex items-center gap-2 text-sm font-bold">
                          {job.empresa_nome ? (
                            // Caso exista o nome da empresa
                            <div className="flex items-center gap-2 text-indigo-600">
                              <Building2 className="w-4 h-4 opacity-40" />
                              {job.empresa_nome}
                            </div>
                          ) : (
                            // Caso não exista (Confidencial)
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                              <Lock className="w-3.5 h-3.5 opacity-70" />
                              <span className="uppercase tracking-wider text-[10px]">Confidencial</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <MapPin className="w-4 h-4 opacity-40" /> {job.endereco ? job.endereco.cidade : (job.local || "Remoto")}
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200/50">
                      Candidatar-se agora
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* PAGINAÇÃO */}
        {!loading && displayData.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors tracking-widest">Anterior</button>
            <div className="h-1 w-20 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(currentPage / 5) * 100}%` }}></div>
            </div>
            <button onClick={() => setCurrentPage(p => p + 1)} className="text-[10px] font-black uppercase text-gray-400 hover:text-indigo-600 transition-colors tracking-widest">Próxima</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VagasPage;