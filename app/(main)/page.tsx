"use client";

import { sendGAEvent } from '@next/third-parties/google';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Loader2, SearchX, ArrowLeft, Zap, Briefcase, Users, ChevronRight } from 'lucide-react';
import JobApplyModal from '@/components/JobApplyModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import JobCard from '@/components/MiniComponents/JobCard';
import JobCardSkeleton from '@/components/MiniComponents/JobCardSkeleton';
import { useApplicationStore } from '@/store/useApplicationStore';

const VagasPage = () => {
  const { user } = useAuthStore();

  // 1. ESTADOS DE CONTROLE
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string | null>(null); // Nome para a UI
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

  // 2. CONFIGURAÇÃO DE VIEW MODE
  const viewMode = useMemo(() => {
    if (!selectedCategory && !search) return 'categories';
    return 'jobs';
  }, [selectedCategory, search]);

  // 3. CACHE KEY (Usa o ID no background)
  const cacheKey = useMemo(() => {
    const fieldsHash = 'f-all';
    // Mude de -l para -s para bater com o Store
    return `jobs-p${currentPage}-s${pageSize}-c${selectedCategory || "all"}-u${user?.id || "guest"}-${fieldsHash}`;
  }, [currentPage, pageSize, selectedCategory, user]);

  const cachedEntry = cache[cacheKey];
  console.log('cachedEntry', cachedEntry);
  // 4. SINCRONIZAÇÃO DE DADOS
  useEffect(() => {
    fetchCategories(categoryPage);
  }, [fetchCategories, categoryPage]);

  useEffect(() => {
    if (viewMode === 'jobs') {
      fetchJobs({
        page: currentPage,
        page_size: pageSize,
        search: search.length > 2 ? search : undefined
      }, user, selectedCategory);
    }
  }, [selectedCategory, search, currentPage, pageSize, viewMode, user]);

  // 5. DATA SELECTOR
  const displayData = useMemo(() => {
    if (viewMode === 'categories') {
      return Array.isArray(categories) ? categories : [];
    }
    // Pega os resultados do cache baseados na categoria selecionada
    return cachedEntry?.results || [];
  }, [viewMode, categories, cachedEntry]);
  // 6. HANDLERS
  const handleAction = useCallback((item: any) => {
    // Se for uma CATEGORIA
    if (item?.name && !item?.descricao) {
      // Rastreia o clique na categoria
      sendGAEvent('event', 'select_content', {
        content_type: 'category',
        item_id: item.id,
        item_name: item.name
      });

      setSelectedCategory(item.id);
      setCategoryDisplayName(item.name);
      setCurrentPage(1);
    }
    // Se for uma VAGA (O JobCard interno já dispara o clique, 
    // mas aqui rastreamos a abertura do Modal de aplicação)
    else {
      sendGAEvent('event', 'view_item', {
        currency: 'BRL',
        value: item.salario ? Number(item.salario) : 0,
        items: [{
          item_id: item.uid,
          item_name: item.cargo_exibicao || item.cargo_nome,
          item_category: categoryDisplayName || 'Geral'
        }]
      });

      setSelectedJob(item);
      setOpenApply(true);
    }
  }, [categoryDisplayName]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    if (val.length > 3) {
      // Rastreia o que as pessoas estão procurando (Valioso para saber demanda)
      sendGAEvent('event', 'search', {
        search_term: val
      });
    }
    if (viewMode === 'categories') setCurrentPage(1);
  }, [viewMode]);

  const resetView = useCallback(() => {
    setSelectedCategory(null);
    setCategoryDisplayName(null); // Reseta o nome amigável
    setSearch("");
    setCurrentPage(1);
  }, []);
  const handleCloseModal = () => {
    setOpenApply(false);
    useApplicationStore.getState().refresh();
  };
  return (
    <div className="min-h-screen bg-delos-surface pt-20 md:pt-32 pb-10 px-4 md:px-8 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 space-y-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <StatCard icon={<Briefcase size={20} />} label="Total_Vagas" value={total_vagas} />
            <StatCard icon={<Zap size={20} />} label="Freelancers" value={total_vagas_freela} color="amber" />
            <StatCard icon={<Users size={20} />} label="Efetivos_CLT" value={total_vagas_efetivo} color="green" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-delos-amber animate-pulse" />
                <span className="text-[14px] font-black text-delos-amber uppercase tracking-[0.3em]">
                  {viewMode === 'categories' ? 'Categorias' : 'Vagas encontradas para'}
                </span>
              </div>
              {/* INTERFACE: Exibe o nome amigável */}
              <h1 className="text-4xl md:text-7xl font-black text-delos-black uppercase italic tracking-tighter leading-[0.85]">
                {categoryDisplayName || "Area de Trabalho"}
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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main>
          {/* Se está carregando e não temos nada no cache ainda, mostra Skeleton */}
          {((viewMode === 'categories' && categoriesLoading) || (viewMode === 'jobs' && loading && !cachedEntry)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : displayData.length === 0 ? (
            // Se terminou de carregar (loading=false) e displayData continua vazio, aí sim é EmptyState
            <EmptyState onReset={resetView} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayData.map((item: any) => (
                <JobCard
                  key={item.id || item.uid}
                  type={viewMode === 'categories' ? 'category' : 'job'}
                  data={item}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-20">
          <Pagination
            current={viewMode === 'categories' ? categoryPage : currentPage}
            onChange={viewMode === 'categories' ? setCategoryPage : setCurrentPage}
            total={viewMode === 'categories' ? null : globalTotal}
            pageSize={pageSize}
            hasMore={viewMode === 'categories' ? categories.length >= 10 : false}
            label={viewMode === 'categories' ? "Listando categorias" : "Listando vagas"}
          />
        </footer>
      </div>

      <JobApplyModal user={user} open={openApply} onClose={handleCloseModal} job={selectedJob} />
    </div>
  );
};

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
        <button onClick={() => onChange((p: number) => Math.max(1, p - 1))} disabled={current === 1} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all">
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Anterior
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded">{current.toString().padStart(2, '0')}</span>
          {totalPages && (
            <><div className="h-[1px] w-12 bg-gray-200" /><span className="text-[10px] font-black text-gray-300">{totalPages.toString().padStart(2, '0')}</span></>
          )}
        </div>
        <button onClick={() => onChange((p: number) => p + 1)} disabled={totalPages ? current >= totalPages : !hasMore} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 transition-all">
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

export default React.memo(VagasPage);
