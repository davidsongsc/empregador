"use client";

import { useState, useMemo } from 'react';
import { 
  Search, Filter, Laptop, Utensils, Car, Stethoscope, 
  ChevronRight, Building2, MapPin, Loader2, Briefcase, X 
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/services/jobs';

const VagasPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // --- NOVOS ESTADOS PARA FILTROS ---
  const [selectedLocais, setSelectedLocais] = useState<string[]>([]);
  const [selectedTurnos, setSelectedTurnos] = useState<string[]>([]);

  const { jobs, loading, error, count } = useJobs(currentPage);

  // Funções para manipular os arrays de filtros
  const toggleFilter = (value: string, currentFilters: string[], setFilters: (v: string[]) => void) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(item => item !== value));
    } else {
      setFilters([...currentFilters, value]);
    }
  };

  // --- LÓGICA DE FILTRAGEM E AGRUPAMENTO ATUALIZADA ---
  const groupedJobs = useMemo(() => {
    if (!jobs) return {};

    const filtered = jobs.filter(job => {
      // 1. Filtro de Pesquisa (Texto)
      const matchesSearch = job.cargo.toLowerCase().includes(search.toLowerCase()) ||
                            job.empresa?.toLowerCase().includes(search.toLowerCase());

      // 2. Filtro de Locais
      const matchesLocal = selectedLocais.length === 0 || selectedLocais.includes(job.local);

      // 3. Filtro de Turnos
      const matchesTurno = selectedTurnos.length === 0 || selectedTurnos.includes(job.turno);

      return matchesSearch && matchesLocal && matchesTurno;
    });

    // Agrupa por nome do cargo
    return filtered.reduce((acc: Record<string, Job[]>, job) => {
      const key = job.cargo;
      if (!acc[key]) acc[key] = [];
      acc[key].push(job);
      return acc;
    }, {});
  }, [jobs, search, selectedLocais, selectedTurnos]);

  const groupedKeys = Object.keys(groupedJobs);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DA PÁGINA */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Vagas Disponíveis</h1>
            <p className="text-gray-500 font-medium">
              {loading ? "Buscando oportunidades..." : `Exibindo ${Object.values(groupedJobs).flat().length} vagas com os filtros atuais.`}
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Ex: Garçom, Vendedor..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR DE FILTROS */}
          <aside className="hidden lg:col-span-3 lg:block space-y-8">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between font-bold text-gray-900 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-600" /> Refinar Busca
                </div>
                {(selectedLocais.length > 0 || selectedTurnos.length > 0) && (
                    <button 
                        onClick={() => { setSelectedLocais([]); setSelectedTurnos([]); }}
                        className="text-[10px] text-red-500 uppercase font-black hover:underline"
                    >
                        Limpar
                    </button>
                )}
              </div>

              {/* Filtro Dinâmico: Locais */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Locais Populares</label>
                <div className="space-y-2 text-sm font-medium text-gray-600">
                  {Array.from(new Set(jobs.map(j => j.local))).slice(0, 8).map(local => (
                    <label key={local} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition group">
                      <input 
                        type="checkbox" 
                        checked={selectedLocais.includes(local)}
                        onChange={() => toggleFilter(local, selectedLocais, setSelectedLocais)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" 
                      /> 
                      <span className={selectedLocais.includes(local) ? "text-indigo-600 font-bold" : ""}>
                        {local}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro de Turno */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Turno</label>
                <div className="space-y-2 text-sm font-medium text-gray-600">
                  {['Manhã', 'Tarde', 'Noite', '6x1', 'Flexível'].map(turno => (
                    <label key={turno} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition">
                      <input 
                        type="checkbox" 
                        checked={selectedTurnos.includes(turno)}
                        onChange={() => toggleFilter(turno, selectedTurnos, setSelectedTurnos)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" 
                      /> 
                      <span className={selectedTurnos.includes(turno) ? "text-indigo-600 font-bold" : ""}>
                        {turno}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200">
              <h4 className="font-bold mb-2 italic">Destaque sua vaga!</h4>
              <p className="text-sm text-indigo-100 mb-4 opacity-80">Empresas que anunciam com prioridade contratam 3x mais rápido.</p>
              <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg">Anunciar Vaga</button>
            </div>
          </aside>

          {/* GRID DE VAGAS AGRUPADAS */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-400 font-bold">Carregando oportunidades...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-8 rounded-[40px] text-center">
                <p className="text-red-600 font-bold">{error}</p>
              </div>
            ) : groupedKeys.length === 0 ? (
              <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-200 text-center animate-in fade-in duration-500">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Nenhuma vaga encontrada para estes filtros</h3>
                <p className="text-gray-500 mt-2">Tente desmarcar alguns filtros ou pesquisar outro cargo.</p>
                <button 
                  onClick={() => { setSearch(""); setSelectedLocais([]); setSelectedTurnos([]); }}
                  className="mt-6 text-indigo-600 font-black uppercase text-xs hover:underline"
                >
                  Limpar tudo
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {groupedKeys.map((cargoName) => {
                  const items = groupedJobs[cargoName];
                  const firstJob = items[0];

                  return (
                    <div 
                      key={cargoName} 
                      className="bg-white p-8 rounded-[40px] border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-[20px] text-xs font-black">
                        {items.length} {items.length > 1 ? 'VAGAS' : 'VAGA'}
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                            {cargoName}
                          </h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {firstJob.turno}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {items.slice(0, 3).map((job) => (
                          <div key={job.uid} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 font-medium flex items-center gap-2 truncate max-w-[150px]">
                              <Building2 className="w-3 h-3 opacity-40" /> {job.empresa || "Empresa Confidencial"}
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.local}
                            </span>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                            + {items.length - 3} outras empresas contratando
                          </p>
                        )}
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        Explorar Oportunidades <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VagasPage;