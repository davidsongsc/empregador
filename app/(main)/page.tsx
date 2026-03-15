"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Loader2, SearchX, ArrowLeft, Zap, Briefcase, Users, ChevronRight } from 'lucide-react';
import JobApplyModal from '@/components/JobApplyModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import JobCard from '@/components/MiniComponents/JobCard';
import JobCardSkeleton from '@/components/MiniComponents/JobCardSkeleton';

const VagasPage = () => {
  const { user } = useAuthStore();

  // 1. ESTADOS DE CONTROLE
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1); // Página para categorias
  const [pageSize] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openApply, setOpenApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const {
    cache,
    fetchJobs,
    fetchCategories,
    categories,
    categoriesLoading,
    loading,
    globalTotal,
    total_vagas,
    total_vagas_freela,
    total_vagas_efetivo
  } = useJobStore();

  // 2. CONFIGURAÇÃO DE CACHE/FIELDS
  const cardFields = ['uid', 'cargo_exibicao', 'empresa_nome', 'tipo_vaga_display', 'salario', 'local', 'category'];
  const fieldsHash = `f-${cardFields.join('-')}`;
  const cacheKey = `jobs-p${currentPage}-s${pageSize}-c${selectedCategory || "all"}-u${user?.id || "guest"}-${fieldsHash}`;
  const cachedEntry = cache[cacheKey];

  // 3. SINCRONIZAÇÃO DE DADOS
  useEffect(() => {
    fetchCategories(categoryPage);
  }, [fetchCategories, categoryPage]);

  useEffect(() => {
    if (selectedCategory || search) {
      fetchJobs({
        page: currentPage,
        page_size: pageSize,
        selectedCategory,
        fields: cardFields
      }, user);
    }
  }, [cacheKey, selectedCategory, search, fetchJobs, user]);

  // 4. LÓGICA DE VIEW MODE (Crítico para não dar erro de .map)
  const viewMode = useMemo(() => {
    if (!selectedCategory && !search) return 'categories';
    return 'jobs';
  }, [selectedCategory, search]);

  const displayData = useMemo(() => {
    // IMPORTANTE: Garantir que sempre retorne um ARRAY
    if (viewMode === 'categories') {
      return Array.isArray(categories) ? categories : [];
    }
    return cachedEntry?.results || [];
  }, [viewMode, categories, cachedEntry]);

  // 5. HANDLERS
  const handleAction = useCallback((item: any) => {
    if (typeof item === 'string') {
      setSelectedCategory(item);
      setCurrentPage(1); // Reseta página de vagas ao trocar categoria
    } else {
      setSelectedJob(item);
      setOpenApply(true);
    }
  }, []);

  const resetView = useCallback(() => {
    setSelectedCategory(null);
    setSearch("");
    setCurrentPage(1);
    setCategoryPage(1); // Opcional: resetar página de categorias ao voltar
  }, []);

  return (
    <div className="min-h-screen bg-delos-surface pt-20 md:pt-32 pb-10 px-4 md:px-8 relative">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 space-y-8">
          {/* STATS BAR */}
          <div className="flex flex-wrap gap-4 mb-4">
            <StatCard icon={<Briefcase size={16} />} label="Total_Vagas" value={total_vagas} />
            <StatCard icon={<Zap size={16} />} label="Freelancers" value={total_vagas_freela} color="emerald" />
            <StatCard icon={<Users size={16} />} label="Efetivos_CLT" value={total_vagas_efetivo} color="blue" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-delos-amber animate-pulse" />
                <span className="text-[14px] font-black text-delos-amber uppercase tracking-[0.3em]">
                  {viewMode === 'categories' ? 'Categorias' : 'Vagas encontradas para'}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-delos-black uppercase italic tracking-tighter leading-[0.85]">
                {selectedCategory || "Area de Trabalho"}
              </h1>
              {viewMode === 'jobs' && (
                <button onClick={resetView} className="flex items-center gap-2 text-[11px] font-black text-delos-amber uppercase tracking-widest hover:underline mt-4">
                  <ArrowLeft className="w-3 h-3" /> Voltar para categorias
                </button>
              )}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-delos-grey w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="PESQUISAR_NA_MATRIZ..."
                className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-[11px] font-bold uppercase outline-none focus:border-delos-black transition-all shadow-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (viewMode === 'categories') setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </header>

        <main>
          {((viewMode === 'categories' && categoriesLoading) || (viewMode === 'jobs' && loading && !cachedEntry)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <JobCardSkeleton />
              ))}
            </div>
          ) : displayData.length === 0 ? (
            <EmptyState onReset={resetView} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayData.map((item: any) => (
                <JobCard
                  key={viewMode === 'categories' ? `cat-${item.name}` : `job-${item.uid}`}
                  type={viewMode === 'categories' ? 'category' : 'job'}
                  data={item}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </main>

        {/* PAGINAÇÃO DINÂMICA */}
        <footer className="mt-20">
          {viewMode === 'categories' ? (
            // Paginação de Categorias
            <Pagination
              current={categoryPage}
              onChange={setCategoryPage}
              hasMore={categories.length >= 10}
              label="Discovery_Matrix"
            />
          ) : (
            // Paginação de Vagas
            globalTotal > pageSize && (
              <Pagination
                current={currentPage}
                onChange={setCurrentPage}
                total={globalTotal}
                pageSize={pageSize}
                label="Job_Matrix"
              />
            )
          )}
        </footer>
      </div>

      <JobApplyModal open={openApply} onClose={() => setOpenApply(false)} job={selectedJob} />
    </div>
  );
};

// --- SUB-COMPONENTES AUXILIARES PARA LIMPEZA DO CÓDIGO ---

const StatCard = ({ icon, label, value, color = "gray" }: any) => (
  <div className={`bg-${color === 'gray' ? 'white/50' : color + '-50'} px-4 py-3 rounded-2xl border border-${color === 'gray' ? 'gray-100' : color + '-100'} flex items-center gap-3`}>
    <div className={`p-2 bg-${color === 'gray' ? 'gray-900' : color + '-500'} rounded-lg text-white`}>{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">{label}</p>
      <p className="text-sm font-black italic">{value || 0}</p>
    </div>
  </div>
);

const Pagination = ({ current, onChange, total, pageSize, hasMore, label }: any) => {
  const totalPages = total ? Math.ceil(total / pageSize) : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <button
          onClick={() => onChange((p: number) => Math.max(1, p - 1))}
          disabled={current === 1}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Anterior
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded">{current.toString().padStart(2, '0')}</span>
          {totalPages && (
            <>
              <div className="h-[1px] w-12 bg-gray-200" />
              <span className="text-[10px] font-black text-gray-300">{totalPages.toString().padStart(2, '0')}</span>
            </>
          )}
        </div>

        <button
          onClick={() => onChange((p: number) => p + 1)}
          disabled={totalPages ? current >= totalPages : !hasMore}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all"
        >
          Próximo <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">/{label}</p>
    </div>
  );
};


const EmptyState = ({ onReset }: any) => (
  <div className="bg-white/50 border border-dashed border-gray-200 p-20 rounded-[40px] text-center flex flex-col items-center">
    <SearchX className="w-12 h-12 text-gray-200 mb-4" />
    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Vazio_na_Matriz</h3>
    <button onClick={onReset} className="mt-4 text-delos-amber font-black text-[9px] uppercase tracking-widest hover:underline">Reiniciar Terminal</button>
  </div>
);

export default VagasPage;