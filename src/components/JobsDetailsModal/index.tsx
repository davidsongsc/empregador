"use client"
import { CheckCircle2, MapPin, Building2, Clock, Wallet, ArrowLeft, Share2, Bookmark } from "lucide-react"
import React from "react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
  onApply: () => void
}

const JobDetailsModal = ({ open, onClose, job, onApply }: Props) => {
  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md lg:hidden animate-in fade-in duration-300">
      <div className="bg-[#F8F9FC] w-full h-full overflow-y-auto animate-in slide-in-from-bottom duration-500">
        
        {/* BARRA SUPERIOR PREMIUM */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 p-2 -ml-2 text-gray-400 hover:text-indigo-600 transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Fechar</span>
          </button>
          
          <div className="flex gap-2">
             <button className="p-2 text-gray-400 border border-gray-100 rounded-full bg-white shadow-sm">
                <Share2 className="w-4 h-4" />
             </button>
             <button className="p-2 text-gray-400 border border-gray-100 rounded-full bg-white shadow-sm">
                <Bookmark className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="p-6 space-y-10 pb-40">
          {/* HEADER DE IMPACTO */}
          <header className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-4">
              {job.role_details?.category || "Oportunidade de Carreira"}
            </div>
            <h2 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
              {job.cargo_exibicao}
            </h2>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">{job.empresa_nome}</span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">
                    {job.endereco ? `${job.endereco.cidade}, ${job.endereco.estado}` : (job.local || "Remoto")}
                </span>
              </div>
            </div>
          </header>

          {/* GRID DE ATRIBUTOS RÁPIDOS */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-3xl p-5 shadow-sm">
              <Wallet className="w-5 h-5 text-emerald-500 mb-3" />
              <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Remuneração</p>
              <p className="font-black text-lg text-gray-900">
                {job.salario ? `R$ ${job.salario}` : "A combinar"}
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-3xl p-5 shadow-sm">
              <Clock className="w-5 h-5 text-indigo-500 mb-3" />
              <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Jornada</p>
              <p className="font-black text-lg text-gray-900">
                {job.turno || "Flexível"}
              </p>
            </div>
          </div>

          {/* CORPO DA DESCRIÇÃO (FOCO EM LEITURA) */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  Sobre a Posição
                </h4>
                <div className="h-[1px] flex-1 bg-gray-100 ml-4"></div>
            </div>
            <div className="prose prose-indigo">
              <p className="text-gray-600 leading-[1.8] text-base font-medium whitespace-pre-line">
                {job.descricao}
              </p>
            </div>
          </section>

          {/* SEÇÃO DE REQUISITOS (ESTILO CHECKLIST) */}
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-[0.3em]">
              O que buscamos
            </h4>
            <div className="grid gap-3">
              {job.requisitos?.map((req: any, i: number) => (
                <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-4 transition-all active:bg-indigo-50">
                  <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-sm text-gray-700 font-bold leading-relaxed">
                    {typeof req === 'object' ? req.description : req}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* SEÇÃO DE BENEFÍCIOS (PÍLULAS) */}
          {job.beneficios?.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-[0.3em]">
                Vantagens e Benefícios
              </h4>
              <div className="flex flex-wrap gap-3">
                {job.beneficios.map((b: any, i: number) => (
                  <div key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    {typeof b === 'object' ? b.description : b}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RODAPÉ FLUTUANTE (BLUR E FOCO NO CTA) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/60 backdrop-blur-xl border-t border-gray-100/50">
          <div className="max-w-2xl mx-auto flex gap-4">
              <button
                onClick={onApply}
                className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-gray-400 active:scale-95 transition-all hover:bg-black"
              >
                Candidatar-se à Vaga
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsModal