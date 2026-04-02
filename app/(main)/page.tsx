"use client";

import { sendGAEvent } from '@next/third-parties/google';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Loader2, SearchX, ArrowLeft, Zap, Briefcase, Users, ChevronRight, Terminal, Filter } from 'lucide-react';
import JobApplyModal from '@/components/JobApplyModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useJobStore } from '@/store/useJobStore';
import JobCard from '@/components/MiniComponents/JobCard';
import JobCardSkeleton from '@/components/MiniComponents/JobCardSkeleton';
import { useApplicationStore } from '@/store/useApplicationStore';
import SelectCompanyModal from '@/components/Modal/SelectCompany';

const VagasPage = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [pageSize] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryDisplayName, setCategoryDisplayName] = useState<string | null>(null);
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

  const viewMode = useMemo(() => {
    if (!selectedCategory && !search) return 'categories';
    return 'jobs';
  }, [selectedCategory, search]);

  const cacheKey = useMemo(() => {
    return `jobs-p${currentPage}-s${pageSize}-c${selectedCategory || "all"}-u${user?.id || "guest"}-f-all`;
  }, [currentPage, pageSize, selectedCategory, user]);

  const cachedEntry = cache[cacheKey];

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
  }, [selectedCategory, search, currentPage, pageSize, viewMode, user, fetchJobs]);

  const displayData = useMemo(() => {
    if (viewMode === 'categories') return Array.isArray(categories) ? categories : [];
    return cachedEntry?.results || [];
  }, [viewMode, categories, cachedEntry]);

  const handleAction = useCallback((item: any) => {
    if (item?.name && !item?.descricao) {
      sendGAEvent('event', 'select_content', {
        content_type: 'category',
        item_id: item.id,
        item_name: item.name
      });
      setSelectedCategory(item.id);
      setCategoryDisplayName(item.name);
      setCurrentPage(1);
    } else {
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
      sendGAEvent('event', 'search', { search_term: val });
    }
    if (viewMode === 'categories') setCurrentPage(1);
  }, [viewMode]);

  const resetView = useCallback(() => {
    setSelectedCategory(null);
    setCategoryDisplayName(null);
    setSearch("");
    setCurrentPage(1);
  }, []);

  const handleCloseModal = () => {
    setOpenApply(false);
    useApplicationStore.getState().refresh();
  };

  return (
    <div className="min-h-screen bg-delos-surface pt-20 md:pt-32 pb-20 font-mono">
      {/* SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />

      <div className="md:max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* HEADER & STATS */}
        <header className="mb-12 space-y-10">
          {/* STATS - Scrollable on Mobile */}
          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <StatCard icon={<Briefcase size={16} />} label="Total_Vagas" value={total_vagas} />
            <StatCard icon={<Zap size={16} />} label="Freelancers" value={total_vagas_freela} color="amber" />
            <StatCard icon={<Users size={16} />} label="Efetivos_CLT" value={total_vagas_efetivo} color="indigo" />
          </div>

          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-delos-amber animate-pulse" />
                <span className="text-[10px] font-black text-delos-amber uppercase tracking-[0.4em]">
                  {viewMode === 'categories' ? 'Protocolo_Navegação' : 'Filtro_Ativo'}
                </span>
              </div>

              <h1 className="text-4xl md:text-8xl font-black text-delos-black uppercase italic tracking-tighter leading-none">
                {categoryDisplayName || "Matriz_Vagas"}
              </h1>

              {viewMode === 'jobs' && (
                <button onClick={resetView} className="flex items-center gap-2 text-[9px] font-black text-delos-black/40 hover:text-delos-amber uppercase tracking-widest mt-4 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Reset_Terminal
                </button>
              )}
            </div>

            {/* SEARCH BOX - Mobile First size */}
            <div className="relative group w-full md:max-w-md">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-delos-black/20 group-focus-within:text-delos-amber w-4 h-4 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="PROCURAR_CARGO_OU_ID..."
                className="w-full bg-white border border-black/5 md:border-black/10 py-5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-delos-amber focus:ring-1 focus:ring-delos-amber transition-all shadow-xl rounded-none"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <main className="min-h-[400px]">
          {((viewMode === 'categories' && categoriesLoading) || (viewMode === 'jobs' && loading && !cachedEntry)) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : displayData.length === 0 ? (
            <EmptyState onReset={resetView} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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

        {/* PAGINATION - Ergonomic for thumbs */}
        <footer className="mt-20 py-10 border-t border-black/5">
          <Pagination
            current={viewMode === 'categories' ? categoryPage : currentPage}
            onChange={viewMode === 'categories' ? setCategoryPage : setCurrentPage}
            total={viewMode === 'categories' ? null : globalTotal}
            pageSize={pageSize}
            hasMore={viewMode === 'categories' ? categories.length >= 10 : false}
            label={viewMode === 'categories' ? "DB_CATEGORIES" : "DB_JOBS_MATCH"}
          />
        </footer>
      </div>
 
      <JobApplyModal user={user} open={openApply} onClose={handleCloseModal} job={selectedJob} />
    </div>
  );
};

const StatCard = ({ icon, label, value, color = "black" }: any) => {
  const colors: any = {
    black: "bg-[var(--delos-black)] text-[var(--delos-surface)]",
    amber: "bg-[var(--delos-amber)] text-white",
    indigo: "bg-[var(--delos-indigo)] text-white",
  };

  return (
    <div className={`${colors[color]} min-w-[140px] px-5 py-4 shadow-2xl flex flex-col justify-between h-24 border border-white/5`}>
      <div className="opacity-40">{icon}</div>
      <div>
        <p className="text-[7px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black italic leading-none">{value || 0}</p>
      </div>
    </div>
  );
};

const Pagination = ({ current, onChange, total, pageSize, hasMore, label }: any) => {
  const totalPages = total ? Math.ceil(total / pageSize) : null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-4 md:gap-12 w-full justify-between md:justify-center">
        <button
          onClick={() => onChange((p: number) => Math.max(1, p - 1))}
          disabled={current === 1}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 py-4 md:py-2 border border-black/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-10 active:bg-black active:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex items-center gap-3 px-6">
          <span className="text-[12px] font-black text-delos-amber underline underline-offset-4">{current.toString().padStart(2, '0')}</span>
          {totalPages && (
            <span className="text-[12px] font-black text-black/20 tracking-tighter">/ {totalPages.toString().padStart(2, '0')}</span>
          )}
        </div>

        <button
          onClick={() => onChange((p: number) => p + 1)}
          disabled={totalPages ? current >= totalPages : !hasMore}
          className="flex-1 md:flex-none flex items-center justify-center gap-3 py-4 md:py-2 border border-black/10 text-[10px] font-black uppercase tracking-widest disabled:opacity-10 active:bg-black active:text-white transition-all"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
      <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.5em] italic">//{label}_TRANS_ID_{Math.floor(Math.random() * 1000)}</p>


    </div>
  );
};

const EmptyState = ({ onReset }: any) => (
  <div className="bg-black/5 border-2 border-dashed border-black/5 py-24 md:py-40 text-center flex flex-col items-center px-6">
    <SearchX className="w-16 h-16 text-black/10 mb-6" />
    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-black/40">Data_Not_Found_In_Matrix</h3>
    <button onClick={onReset} className="mt-8 px-8 py-4 bg-delos-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-delos-amber transition-colors">
      Re-initialize_System
    </button>
  </div>
);

export default React.memo(VagasPage);