"use client"
import React, { useState, useEffect, useMemo } from "react"
import { 
  Plus, Users, MapPin, Edit3, Trash2, Search, 
  Loader2, ChevronLeft, ChevronRight, LayoutGrid, Zap, 
  Database, Activity
} from "lucide-react"
import { useMyJobsStore } from "@/hooks/useMyJobsStore"
import { useAuthStore } from "@/store/useAuthStore"
import Link from "next/link"
import PostJobModal from "@/components/Modal/PostJobModal"

const MinhasVagas = () => {
  const { user } = useAuthStore()
  const { data, loading, fetchJobs } = useMyJobsStore()
  
  const [isPostJobOpen, setIsPostJobOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const empresaId = user?.profile?.empresas?.[0]?.id

  const currentFilter = useMemo(() => ({
    company: empresaId || user?.id,
    page: page,
    page_size: pageSize,
    search: searchTerm
  }), [empresaId, user?.id, page, pageSize, searchTerm])

  useEffect(() => {
    fetchJobs(currentFilter)
  }, [currentFilter, fetchJobs])

  const totalPages = Math.ceil((data?.count || 0) / pageSize)

  return (
    <div className="min-h-screen bg-[#080808] text-slate-400 font-sans pb-10 selection:bg-amber-500/30">
      
      {/* HEADER DE COMANDO */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-sm font-black text-white tracking-[0.3em] uppercase">
              Catálogo de <span className="text-amber-600">Vagas</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase italic">
                  {data?.count || 0} Unidades Ativas
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsPostJobOpen(true)}
            className="group relative bg-amber-600 hover:bg-amber-500 text-black px-6 py-3 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.15)] active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Criar Nova Instância
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* BARRA DE FERRAMENTAS TERMINAL */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-amber-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="FILTRAR POR CARGO OU CATEGORIA..."
              className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-none focus:border-amber-600/50 outline-none font-bold text-[10px] tracking-widest transition-all uppercase text-white placeholder:text-slate-800"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-px bg-white/5 border border-white/5 p-1">
            <span className="px-4 text-[8px] font-black uppercase text-slate-600 tracking-widest">Exibir</span>
            {[10, 25, 50].map((size) => (
              <button
                key={size}
                onClick={() => { setPageSize(size); setPage(1); }}
                className={`px-4 py-2 text-[10px] font-black transition-all ${pageSize === size ? 'bg-amber-600 text-black' : 'text-slate-500 hover:bg-white/5'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE VAGAS */}
        <div className="grid gap-3">
          {loading ? (
            <div className="py-32 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 animate-pulse">Sincronizando Catálogo ...</p>
            </div>
          ) : (
            data?.results.map((vaga) => (
              <div 
                key={vaga.uid} 
                className="group relative bg-[#0D0D0D] border border-white/5 p-6 hover:border-amber-900/40 transition-all overflow-hidden"
              >
                {/* Linha Decorativa Lateral */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-600 transition-all" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-8">
                    {/* Ícone Estilo Host-Matrix */}
                    <div className="w-16 h-16 bg-slate-900 border border-white/5 flex items-center justify-center text-slate-800 group-hover:text-amber-600 group-hover:border-amber-900/30 transition-all duration-500">
                      <LayoutGrid size={28} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 border border-amber-900/30 text-amber-600 text-[8px] font-black uppercase tracking-widest">
                          {vaga.tipo_vaga_display}
                        </span>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                          {vaga.role_details.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-white group-hover:text-white transition-colors uppercase tracking-wider">
                        {vaga.cargo_exibicao}
                      </h2>
                      <div className="flex gap-6 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                         <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-800"/> {vaga.turno}</span>
                         <span className="flex items-center gap-1.5 text-amber-600/60 font-black italic">
                           <Activity size={12}/> {vaga.candidatos_count || 0} Hosts Inscritos
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* AÇÕES DE COMANDO */}
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/painel/vagas/${vaga.uid}/candidatos`} className="flex-1 lg:flex-none">
                      <button className="w-full bg-white/5 border border-white/10 text-white px-8 py-3 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-black hover:border-amber-600 transition-all flex items-center justify-center gap-2">
                        Gerenciar Staff <Zap size={12} fill="currentColor"/>
                      </button>
                    </Link>
                    
                    <div className="flex border border-white/5">
                      <button className="p-3 text-slate-700 hover:text-white hover:bg-white/5 transition-all border-r border-white/5">
                        <Edit3 size={16}/>
                      </button>
                      <button className="p-3 text-slate-700 hover:text-rose-600 hover:bg-rose-600/5 transition-all">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINAÇÃO TERMINAL STYLE */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex items-center justify-between bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center gap-3">
              <Database size={14} className="text-slate-800" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                Página {page} <span className="text-slate-800">/</span> {totalPages}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-3 border border-white/10 text-slate-500 hover:bg-white/5 hover:text-white disabled:opacity-10 transition-all active:scale-90"
              >
                <ChevronLeft size={18}/>
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-3 border border-white/10 text-slate-500 hover:bg-white/5 hover:text-white disabled:opacity-10 transition-all active:scale-90"
              >
                <ChevronRight size={18}/>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* O Modal precisa de sua própria adaptação visual interna, 
          mas mantemos a chamada original para funcionamento */}
      <PostJobModal 
        isOpen={isPostJobOpen} 
        onClose={() => { setIsPostJobOpen(false); fetchJobs(currentFilter, true); }} 
      />

      {/* FOOTER HUD OBRIGATÓRIO */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-8 bg-[#050505] border-t border-white/5 flex justify-between items-center z-30">
        <div className="flex items-center gap-4 text-[8px] font-mono text-slate-700 uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 bg-amber-600 rounded-full" /> 
            DATA_REPOSITORY_ACTIVE
          </span>
        </div>
        <div className="text-[8px] font-mono text-slate-800 italic">
          "Analysis: No significant errors found in the current sequence."
        </div>
      </footer>
    </div>
  )
}

export default MinhasVagas