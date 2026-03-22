"use client"
import React, { useState, useEffect, useMemo } from "react"
import {
  Plus, MapPin, Edit3, Trash2, Search,
  Loader2, ChevronLeft, ChevronRight, LayoutGrid, Zap,
  Database, Activity, Terminal, Crosshair, BarChart2, MoreHorizontal
} from "lucide-react"
import { useMyJobsStore } from "@/hooks/useMyJobsStore"
import PostNewJobModal from "@/components/Modal/PostNewJobModal"
import { useManageJob } from "@/hooks/useManageJob"
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal"
import checkModuleAccess from "@/utils/checkModuleAccess"
import { getActiveMembership } from "@/utils/userHelpers"
import { Module } from "@/enum/moduleEnum"
import { checkLevel } from "@/utils/checkLevel"
import { useRouter } from "next/navigation"
import ContainerMain from "@/components/Layout/ContainerMain"
import { Job } from "@/interfaces/iJob"

const MinhasVagas = () => {

  const { data, loading, fetchJobs } = useMyJobsStore()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobEditing, setJobEditing] = useState<string>();
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const canAccessSupervision = checkModuleAccess(getActiveMembership()?.role ?? "GUEST", Module.SUPERVISION);
  const activeCompanyId = getActiveMembership()?.id
  const router = useRouter();
  const {
    openDeleteConfirmation,
    confirmRemoval,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    loading: deleting
  } = useManageJob();

  const handleEdit = (job: any) => {
    setJobEditing(job.uid);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setJobEditing(""); // Limpa para modo criação
    setIsModalOpen(true);
  };
  const currentFilter = useMemo(() => ({
    // O backend usará isso para filtrar o QuerySet
    company: activeCompanyId,
    page: page,
    page_size: pageSize,
    search: searchTerm
  }), [activeCompanyId, page, pageSize, searchTerm])

  useEffect(() => {
    fetchJobs(currentFilter)
  }, [currentFilter, fetchJobs, activeCompanyId])

  const totalPages = Math.ceil((data?.count || 0) / pageSize)


  const hasLowAccess = checkLevel("low")
  const hasMidAccess = checkLevel("mid")
  const hasHighAccess = checkLevel("high")
  return (
    <ContainerMain className="">

      {/* HEADER ADAPTÁVEL */}
      <header className="border-b border-white/[0.03] bg-delos-surface shrink-0 " >
        <div className="w-full px-4 sm:px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col">
              <div >
                <span className="text-[7px] sm:text-[14px] font-black tracking-[0.4em] text-delos-amber uppercase leading-none mb-1">Cadastro</span>
                _
                <span className="text-[7px] sm:text-[14px] font-mono text-delos-grey uppercase tracking-widest italic flex-1">

                  Página_{page}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-light text-delos-black tracking-tighter uppercase leading-none">
                Gestão de <span className="font-black">Vagas</span>
              </h1>

            </div>

            <div className="h-8 w-[1px] bg-delos-black hidden md:block" />
            <div className="hidden md:flex items-center gap-2 ">
              <Activity size={18} className="text-emerald-500 animate-pulse opacity-70" />
              <span className="text-[16px] font-mono text-delos-grey uppercase tracking-widest flex-1">
                {data?.count || 0} Ativas
              </span>

            </div>
          </div>

          <button
            onClick={() => handleCreate()}
            type="button"

            className={`group bg-delos-black text-delos-white px-3 sm:px-5 py-2 transition-all hover:bg-amber-600 hover:text-white flex items-center gap-2 shadow-lg active:scale-95 rounded-sm ${!canAccessSupervision ? 'pointer-events-none opacity-50 bg-slate-800 cursor-not-allowed text-slate-400' : ''}`}
            disabled={!canAccessSupervision}
          >
            <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span className="font-black text-[9px] uppercase tracking-[0.1em] hidden sm:inline">Nova Vaga</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 overflow-hidden bg-delos-item">

        {/* BARRA DE FERRAMENTAS RESPONSIVA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 shrink-0">
          <div className="relative flex-1 bg-delos-black border border-white/[0.03]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-delos-grey" size={14} />
            <input
              type="text"
              placeholder="BUSCAR ID_UNIDADE..."
              className="w-full pl-10 pr-4 py-2.5 bg-delos-grey/80 outline-none font-bold text-[9px] tracking-widest uppercase text-delos-surface placeholder:text-delos-surface"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* PAGINAÇÃO FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 shrink-0">

            <div className="flex gap-1 w-full sm:w-auto">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
                className="flex-1 h-10 sm:flex-none p-3 lg:p-1.5 border border-delos-black/5 bg-delos-surface hover:bg-delos-item text-slate-500 disabled:opacity-0 transition-all active:scale-95 flex justify-center items-center"
              >
                <ChevronLeft size={25} />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === totalPages}
                className="flex-1 h-10 sm:flex-none p-3 lg:p-1.5 border border-delos-black/5 bg-delos-surface hover:bg-delos-item text-slate-500 disabled:opacity-0 transition-all active:scale-95 flex justify-center items-center"
              >
                <ChevronRight size={25} />
              </button>
            </div>
          </div>
          <div className="flex bg-delos-surface border border-delos-grey/[0.03] p-1 justify-center">
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
        <div className="flex-1 flex flex-col border border-white/[0.03] bg-delos-container/90 overflow-hidden shadow-2xl shadow-delos-amber/20">
          {/* Header Visível apenas em Desktop */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-2 bg-bg-delos-item border-b border-delos-amber text-[13px] font-black text-delos-item uppercase tracking-[0.2em] shrink-0">
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
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.03] bg-delos-item/20">
            {loading ? (
              <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-amber-600 animate-spin opacity-40" />
              </div>
            ) : (
              data?.results.map((vaga) => (
                <div
                  key={vaga.uid}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-4 px-4 sm:px-6 py-4 lg:py-2 items-start lg:items-center hover:bg-delos-container transition-colors group relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-600 transition-all shadow-[0_0_8px_#d97706]" />

                  {/* Top Mobile: ID e Badge */}
                  <div className="flex w-full justify-between items-center lg:col-span-1 mb-2 lg:mb-0">
                    <span className="font-mono text-[18px] text-delos-amber group-hover:text-amber-600">
                      #{vaga.uid.substring(16, 23).toUpperCase()}
                    </span>
                    <div className="lg:hidden">
                      <span className="px-2 py-0.5 border border-white/5 text-[12px] font-black text-amber-600 uppercase tracking-widest bg-amber-600/5">
                        {vaga.tipo_vaga_display}
                      </span>
                    </div>
                  </div>

                  {/* Informação Principal */}
                  <div className="w-full lg:col-span-4 flex flex-col min-w-0">
                    <span className="text-[13px] lg:text-[16px] font-bold text-slate-200 uppercase tracking-tight truncate group-hover:text-white transition-colors">
                      {vaga.cargo_nome}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] lg:text-[10px] font-mono text-slate-400 uppercase tracking-tighter truncate">
                        {vaga.categoria} // {vaga.turno}
                      </span>
                    </div>
                  </div>

                  {/* Badge Desktop */}
                  <div className="hidden lg:flex lg:col-span-2 justify-start">
                    <span className="px-2 py-0.5 border border-white/5 text-[13px] font-bold text-delos-surface uppercase tracking-widest group-hover:border-amber-600/20 group-hover:text-amber-500 bg-delos-container/20 rounded-md">
                      {vaga.tipo}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 lg:col-span-2 lg:justify-end my-3 lg:my-0 w-full lg:w-auto">
                    <div className="flex items-center gap-1.5 leading-none bg-white/5 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-sm">
                      <BarChart2 size={10} className="text-emerald-500 opacity-50" />
                      <span className="text-[20px] font-mono text-slate-400 font-bold group-hover:text-white">
                        {String(vaga.candidatos_count || 0).padStart(2, '0')}
                      </span>
                      <span className="lg:hidden text-[8px] text-slate-600 uppercase font-black ml-1">Inscrições</span>
                    </div>
                  </div>

                  {/* Ações Adaptáveis */}
                  {/* A lógica garante que se for undefined, o valor tratado será 0 */}
                  {(vaga.candidatos_count ?? 0) > 0 ? (

                    <button
                      disabled={!hasLowAccess}
                      onClick={() => {
                        router.push(`/dashboard/painel/vagas/${vaga.uid}/candidatos`);
                      }}
                      className={`w-full  flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-delos-surface px-4 py-3 lg:bg-white/5  lg:py-1.5  ${!hasLowAccess ? ' hover:text-slate-200 transition-colors  group-hover:bg-rose-600 group-hover:text-slate-400 opacity-40' : 'hover:text-white transition-colors bg-white/5 group-hover:bg-amber-600 group-hover:text-white'} border border-white/5 lg:border-transparent`}>
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
    group-hover:border-amber-600/40 group-hover:text-amber-500
  `}>
                        {/* Ícone de pulso apenas se estiver ativo */}
                        <span className="flex items-center gap-1.5">
                          {vaga.is_active && (
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
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

                      onClick={() => openDeleteConfirmation(vaga.uid)} // Passa o UID para o estado interno do hook
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


      </main>

      <PostNewJobModal
        isOpen={isModalOpen} // Use o estado unificado
        jobUid={jobEditing} // Passe o objeto da vaga ou null
        activeCompanyId={activeCompanyId}
        onClose={() => {
          setIsModalOpen(false);
          setJobEditing("");
          fetchJobs(currentFilter, true);
        }}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          // Esta função executa o deleteJob(uid) que está guardado no hook
          const success = await confirmRemoval();
          if (success) {
            fetchJobs(currentFilter, true); // Recarrega a matriz de vagas
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