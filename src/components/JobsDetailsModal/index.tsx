"use client"
import { CheckCircle2, MapPin, Building2, Clock, Wallet, ArrowLeft, Share2, Bookmark, Zap, ShieldCheck, Binary, Target } from "lucide-react"
import React, { useEffect } from "react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
  onApply: () => void
}

const JobDetailsModal = ({ open, onClose, job, onApply }: Props) => {
  if (!open || !job) return null
  useEffect(() => {
    if (open) {
      // 1. Salva a posição do scroll atual (opcional, mas evita pulos)
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      // 2. Trava o scroll e esconde a barra
      document.body.style.overflow = 'hidden';

      // 3. Compensar a largura da barra de scroll para evitar que o layout "pule"
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      // 4. Libera o scroll quando fecha
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup: garante que se o componente for destruído, o scroll volta
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [open]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md lg:hidden animate-in fade-in duration-300">
      <div
        style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
        className="w-full h-full overflow-y-auto flex flex-col relative"
      >
        {/* GRID DE CALIBRAÇÃO DE FUNDO */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:30px_30px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />

        {/* HEADER TÉCNICO FIXO */}
        <div className="sticky top-0 z-20 bg-[var(--delos-surface)]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-3 p-2 text-[var(--delos-black)] opacity-50 hover:opacity-100 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Return_Archive</span>
          </button>

          <div className="flex gap-2">
            <button className="p-2 border border-black/10 dark:border-white/10 rounded-sm hover:bg-black/5">
              <Share2 className="w-4 h-4 opacity-40" />
            </button>
            <button className="p-2 border border-black/10 dark:border-white/10 rounded-sm hover:bg-black/5">
              <Bookmark className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-12 pb-40 relative z-10">

          {/* HEADER DE IMPACTO CORPORATIVO */}
          <header className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[var(--delos-amber)] rounded-full animate-pulse" />
              <div className="bg-[var(--delos-black)] text-[var(--delos-surface)] px-3 py-1 rounded-sm text-[8px] font-mono font-black uppercase tracking-[0.3em]">
                {job.role_details?.category || "Core_Unit_Opportunity"}
              </div>
            </div>

            <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter mb-6">
              {job.cargo_exibicao}
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 opacity-60">
                <Building2 className="w-4 h-4 text-[var(--delos-indigo)]" />
                <span className="text-xs font-black uppercase tracking-widest">{job.empresa_nome}</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <MapPin className="w-4 h-4 text-[var(--delos-amber)]" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {job.endereco ? `${job.endereco.cidade}, ${job.endereco.estado}` : (job.local || "Global_Network")}
                </span>
              </div>
            </div>
          </header>

          {/* ATRIBUTOS OPERACIONAIS */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-5">
              <Binary className="w-4 h-4 text-[var(--delos-amber)] mb-4" />
              <p className="text-[7px] font-mono uppercase font-black opacity-40 tracking-[0.2em] mb-1">Value_Transfer</p>
              <p className="font-black text-lg tracking-tighter">
                {job.salario ? `R$ ${job.salario}` : "Market_Comp"}
              </p>
            </div>

            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm p-5">
              <Clock className="w-4 h-4 text-[var(--delos-indigo)] mb-4" />
              <p className="text-[7px] font-mono uppercase font-black opacity-40 tracking-[0.2em] mb-1">Temporal_Cycle</p>
              <p className="font-black text-lg tracking-tighter">
                {job.turno || "Full_Sequence"}
              </p>
            </div>
          </div>

          {/* DESCRIÇÃO DA NARRATIVA */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-6 opacity-30">
              <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.4em] whitespace-nowrap">
                Narrative_Buffer
              </h4>
              <div className="h-[1px] flex-1 bg-current"></div>
            </div>
            <p className="text-sm md:text-base leading-relaxed italic border-l-2 border-[var(--delos-indigo)] pl-6 opacity-70">
              {job.descricao}
            </p>
          </section>

          {/* REQUISITOS TÉCNICOS */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <h4 className="text-[9px] font-mono font-black opacity-30 uppercase mb-8 tracking-[0.4em]">
              Unit_Requirements::Checklist
            </h4>
            <div className="grid gap-4">
              {job.requisitos?.map((req: any, i: number) => (
                <div key={i} className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-sm p-4 flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4 text-[var(--delos-indigo)]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight opacity-80 leading-tight">
                    {typeof req === 'object' ? req.description : req}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFÍCIOS / UPGRADES */}
          {job.beneficios?.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              <h4 className="text-[9px] font-mono font-black opacity-30 uppercase mb-8 tracking-[0.4em]">
                System_Upgrades
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.beneficios.map((b: any, i: number) => (
                  <div key={i} className="bg-black text-[var(--delos-surface)] dark:bg-white dark:text-black px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest flex items-center gap-2 italic">
                    <Zap size={10} className="text-[var(--delos-amber)]" />
                    {typeof b === 'object' ? b.description : b}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RODAPÉ OPERACIONAL FIXO */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[var(--delos-surface)]/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 z-30">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onApply}
              style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
              className="w-full py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-[0.98] transition-all hover:bg-[var(--delos-indigo)]"
            >
              Execute_Sync_Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsModal