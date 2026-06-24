"use client"
import React, { useState, useEffect, useMemo } from "react"
import {
  Plus, MapPin, Edit3, Trash2, Search,
  Loader2, ChevronLeft, ChevronRight, LayoutGrid, Zap,
  Database, Activity, Terminal, Crosshair, BarChart2, MoreHorizontal,
  X
} from "lucide-react"
import { useMyJobsStore } from "@/store/useMyJobsStore"
import PostNewJobModal from "@/components/Modal/PostNewJobModal"
import { useManageJob } from "@/hooks/useManageJob"
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal"
import checkModuleAccess from "@/utils/checkModuleAccess"
import { getActiveMembership } from "@/utils/userHelpers"
import { Module } from "@/enum/moduleEnum"
import { checkLevel } from "@/utils/checkLevel"
import { useRouter } from "next/navigation"
import ContainerMain from "@/components/Layout/ContainerMain"
import SaasHeader from "@/components/MiniComponents/SaasHeader"

const MinhasVagas = () => {
  const user = getActiveMembership();
  const { data, loading, fetchJobs } = useMyJobsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobEditing, setJobEditing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const canAccessSupervision = checkModuleAccess(getActiveMembership()?.role ?? "GUEST", Module.SUPERVISION);
  const activeCompanyId = getActiveMembership()?.company_id
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const listTopRef = React.useRef<HTMLDivElement>(null);
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const {
    openDeleteConfirmation,
    confirmRemoval,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    loading: deleting
  } = useManageJob();

  const currentFilter = useMemo(() => ({
    page: page,
    page_size: pageSize,
    search: debouncedSearch
  }), [activeCompanyId, page, pageSize, debouncedSearch]);

  useEffect(() => {
    if (activeCompanyId && typeof activeCompanyId === 'string' && activeCompanyId !== "[object Object]") {
      fetchJobs(activeCompanyId, currentFilter);
    }
  }, [currentFilter, fetchJobs, activeCompanyId]);

  const handleEdit = (job: any) => {
    setJobEditing(job.id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    // Se o seu useJobStore tiver uma função de limpar, chame-a aqui:
    // useJobStore.getState().clearVaga(); 

    setJobEditing(null); // Garante que jobUid no modal seja null
    setIsModalOpen(true);
  };
  useEffect(() => {
    const scrollContainer = listTopRef.current?.closest('.overflow-y-auto');

    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const handler = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setPage(1);
      }, 780);

      return () => clearTimeout(handler);
    }

    if (searchTerm.length === 0) {
      setDebouncedSearch("");
      setPage(1);
    }
  }, [searchTerm]);



  const hasLowAccess = checkLevel("low")
  const hasMidAccess = checkLevel("mid")
  const hasHighAccess = checkLevel("high")

  return (
    <ContainerMain className="">

      {/* HEADER ADAPTÁVEL */}
      <SaasHeader
        page={page}
        count={data?.total_count || 0}
        canAccess={hasHighAccess}
        onCreate={handleCreate}
      />


      <main className="flex-1 flex flex-col min-h-0 p-4 sm:p-1 overflow-hidden bg-delos-item">

        {/* BARRA DE FERRAMENTAS RESPONSIVA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 shrink-0">
          <div className="relative flex-1 bg-delos-black border border-delos-grey group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-delos-grey" size={14} />

            <input
              type="text"
              placeholder="PESQUISAR VAGAS..."
              value={searchTerm}
              className="w-full pl-10 pr-12 py-2.5 bg-delos-surface/90 outline-none font-bold text-[9px]
               tracking-widest uppercase text-delos-black placeholder:text-delos-black transition-all 
               focus:bg-delos-surface/60"
              onChange={(e) => setSearchTerm(e.target.value)}
              // ADIÇÃO: LEITURA DE TECLADO
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchTerm("");
                  setDebouncedSearch("");
                  setPage(1);
                }
              }}
            />

            {/* BOTÃO DE LIMPAR (X) */}
            {searchTerm.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-all text-delos-grey hover:text-delos-amber group-active:scale-90"
                title="Limpar busca (ESC)"
              >
                <X size={14} strokeWidth={3} />
              </button>
            )}
          </div>

          <div className="flex bg-delos-surface border border-delos-grey p-1 justify-center">
            {[10, 25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => { setPageSize(size); setPage(1); }}
                className={`px-4 sm:px-3 py-1.5 text-[13px] font-black transition-all ${pageSize === size ? 'bg-delos-amber text-delos-surface shadow-md' : 'text-delos-grey hover:text-delos-black'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* TABELA / GRID LIST */}
        <div className="flex-1 flex flex-col border border-amber bg-delos-container overflow-hidden shadow-2xl shadow-delos-amber/20">
          {/* Header Visível apenas em Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2 bg-delos-surface/90 border-b border-delos-amber text-[13px] font-black text-delos-black/90 uppercase tracking-[0.2em] shrink-0">
            <div className="col-span-1">Ficha</div>
            <div className="col-span-4">Cargo / Identificador</div>
            <div className="col-span-2 text-left">Tipo</div>
            <div className="col-span-2 text-right">Inscritos</div>

            <div className="col-span-3 text-center">
              <div className="flex items-center justify-between ">
                <span>Candidatos</span>
                <span>Status</span>
                <span>editar</span>
              </div>
            </div>
          </div>

          {/* Lista Adaptável */}
          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar divide-y
                        divide-delos-amber/30 bg-delos-surface/80">
            {loading ? (
              <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin opacity-40" />
              </div>
            ) : (
              data?.results.map((vaga) => (
                <div
                  key={vaga.id}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-4 px-4 
                  sm:px-6 py-4 lg:py-2 items-start lg:items-center hover:bg-delos-surface
                   transition-colors group relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent 
                  group-hover:bg-delos-amber transition-all shadow-[0_0_8px_#d97706]" />

                  {/* Top Mobile: ID e Badge */}
                  <div className="flex w-full justify-between items-center lg:col-span-1 mb-2 lg:mb-0">
                    <span className="font-mono text-[18px] text-delos-amber group-hover:text-amber-600">
                      #{vaga.id.substring(16, 23).toUpperCase()}
                    </span>
                    <div className="lg:hidden">
                      <span className="px-2 py-0.5 border border-delos-surface text-[12px] font-black 
                                    text-amber-600 uppercase tracking-widest bg-delos-amber/5">
                        {vaga.tipo_vaga_display}
                      </span>
                    </div>
                  </div>

                  {/* Informação Principal */}
                  <div className="w-full lg:col-span-4 flex flex-col min-w-0">
                    <span className="text-[13px] lg:text-[16px] font-bold text-delos-black
                     uppercase tracking-tight truncate group-hover:text-delos-grey transition-colors ">
                      {vaga.cargo_nome}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] lg:text-[10px] font-mono text-delos-grey uppercase
                       tracking-tighter truncate group-hover:text-delos-black ">
                        {vaga.categoria_nome} // {vaga.turno}
                      </span>
                    </div>
                  </div>

                  {/* Badge Desktop */}
                  <div className="hidden lg:flex lg:col-span-2 justify-start">
                    <span className="px-2 py-0.5 border border-delos-surface/5 text-[13px] font-bold
                     text-delos-surface uppercase tracking-widest group-hover:border-delos-amber 
                     group-hover:text-delos-amber bg-delos-black/20 rounded-md shadow-md
                     group-hover:shadow-delos-black transition-all duration-300 cursor-pointer">
                      {vaga.tipo_vaga}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 lg:col-span-2 lg:justify-end my-3 lg:my-0 w-full lg:w-auto">
                    <div className="flex items-center gap-1.5 leading-none bg-white/5 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-sm">
                      <BarChart2 size={18} className="text-delos-amber opacity-50" />
                      <span className="text-[20px] font-mono text-delos-black font-bold group-hover:text-delos-amber transition-colors">
                        {String(vaga.applications_count || 0).padStart(2, '0')}
                      </span>
                      <span className="lg:hidden text-[12px] text-delos-black uppercase font-black ml-1">Inscrições</span>
                    </div>
                  </div>

                  {/* Ações Adaptáveis */}
                  {/* A lógica garante que se for undefined, o valor tratado será 0 */}
                  {(vaga.applications_count ?? 0) > 0 ? (

                    <button
                      disabled={!hasLowAccess}
                      onClick={() => {
                        router.push(`/dashboard/painel/vagas/${vaga.id}/candidatos`);
                      }}
                      className={`w-full  flex items-center justify-center gap-2 text-[11px] font-black
                       uppercase tracking-widest text-delos-black px-4 py-3 lg:bg-delos-surface lg:py-1.5  
                       shadow-md rounded-md group-hover:bg-amber-600 group-hover:text-white group-hover:border-delos-amber
                     group-hover:shadow-delos-black transition-all duration-300 cursor-pointer
                       ${!hasLowAccess ? ' hover:text-delos-black transition-colors  group-hover:bg-delos-red group-hover:text-delos-black opacity-40 cursor-not-allowed'
                          :
                          'hover:text-delos-black transition-colors bg-delos-grey group-hover:bg-amber-600 group-hover:text-delos-black cursor-not-allowed'} border border-delos-black lg:border-transparent`}>
                      <Crosshair size={12} /> Candidatos
                    </button>
                  ) : (
                    <div className="flex-1 lg:flex-none cursor-not-allowed opacity-30 grayscale pointer-events-none">
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-tropical-surface bg-white/5 px-4 py-3 lg:py-1.5 border border-white/5"
                      >
                        <Crosshair size={12} /> Indisponivel
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="hidden lg:grid lg:col-span-2 justify-center">
                      <span className={`
    px-2 py-0.5 border text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500
    ${vaga.is_active
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : 'bg-red-500/10 border-red-500/20 text-red-500/70'
                        }
    group-hover:border-amber-600/40 group-hover:text-delos-amber group-hover:bg-amber-600/10 group-hover:shadow-[0_0_15px_rgba(217,119,6,0.2)]
  `}>
                        {/* Ícone de pulso apenas se estiver ativo */}
                        <span className="flex items-center gap-1.5">
                          {vaga.is_active && (
                            <span className="w-1 h-1 bg-delos-green rounded-full animate-ping" />
                          )}
                          {vaga.is_active ? 'Online' : 'Offline'}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(vaga)}
                      disabled={!hasMidAccess}
                      className={`p-4 text-slate-600  transition-colors ${!hasMidAccess ? 'opacity-40 cursor-not-allowed hover:text-rose-500' : 'hover:text-amber-500'}`}
                      title="Editar Item"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      disabled={!hasHighAccess}
                      title="Deletar Item"

                      onClick={() => openDeleteConfirmation(vaga.id)} 
                      className={`p-4 text-slate-600 transition-colors ${!hasHighAccess ? 'opacity-40 cursor-not-allowed hover:text-rose-500' : 'hover:text-rose-500'}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* PAGINAÇÃO FOOTER */}
        <div className="bg-delos-surface flex flex-col sm:flex-row items-center justify-between gap-4 px-2 shrink-0 py-2">
          <div className="text-[14px] font-mono text-delos-grey uppercase tracking-widest">
            Mostrando {data?.results.length || 0} de {data?.total_count || 0} registros
          </div>

          <div className="flex gap-1 w-full sm:w-auto">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="flex-1 h-10 sm:flex-none px-4 border border-delos-surface/5 bg-delos-surface hover:bg-delos-item text-slate-500 disabled:opacity-20 transition-all active:scale-95 flex justify-center items-center"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center px-4 bg-delos-surface border border-delos-surface/5 text-delos-amber font-mono text-xs">
              {page} / {data?.total_pages || 1}
            </div>

            <button
              onClick={() => setPage(p => Math.min(data?.total_pages || 1, p + 1))}
              disabled={page === data?.total_pages || loading}
              className="flex-1 h-10 sm:flex-none px-4 border border-white/5 bg-delos-surface hover:bg-delos-item text-slate-500 disabled:opacity-20 transition-all active:scale-95 flex justify-center items-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </main>

      <PostNewJobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobEditing(null);
          if (activeCompanyId) {
            fetchJobs(activeCompanyId, currentFilter, true); 
          }
        }}
        jobUid={jobEditing}
        activeCompanyId={activeCompanyId}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          const success = await confirmRemoval(activeCompanyId); 
          if (success && activeCompanyId) {
            fetchJobs(activeCompanyId, currentFilter, true);
          }
        }}
        title="TERMINAR_INSTÂNCIA"
        description="Você está prestes a remover permanentemente este registro da base de dados ativa."
        loading={deleting}
      />
    </ContainerMain>
  )
}

export default MinhasVagas