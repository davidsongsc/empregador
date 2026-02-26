"use client"
import { CheckCircle2, X, MapPin, Building2, Clock, Wallet, ArrowLeft } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
  onApply: () => void
}

const JobDetailsModal = ({ open, onClose, job, onApply }: Props) => {
  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300">
      <div className="bg-[#F8F9FC] w-full h-full overflow-y-auto animate-in slide-in-from-bottom duration-500">
        
        {/* HEADER FIXO MOBILE */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
            {job.role_details?.category || "Oportunidade"}
          </div>
        </div>

        <div className="p-6 space-y-8 pb-32">
          {/* TÍTULO E EMPRESA */}
          <header>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              {job.cargo_exibicao}
            </h2>
            <div className="mt-3 space-y-2">
              <p className="flex items-center gap-2 text-indigo-600 font-bold">
                <Building2 className="w-4 h-4 opacity-50" />
                {job.empresa_nome}
              </p>
              <p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <MapPin className="w-4 h-4 opacity-50" />
                {job.endereco ? `${job.endereco.cidade}, ${job.endereco.estado}` : (job.local || "Remoto")}
              </p>
            </div>
          </header>

          {/* CARDS DE INFORMAÇÕES RÁPIDAS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-3.5 h-3.5 text-green-500" />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Salário</p>
              </div>
              <p className="font-black text-gray-800">
                {job.salario ? `R$ ${job.salario}` : "A combinar"}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Jornada</p>
              </div>
              <p className="font-black text-gray-800">
                {job.turno || "Indefinido"}
              </p>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">
              Descrição da Vaga
            </h4>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm font-medium">
                {job.descricao}
              </p>
            </div>
          </div>

          {/* REQUISITOS */}
          <div>
            <h4 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">
              Requisitos
            </h4>
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              {job.requisitos?.map((req: any, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{typeof req === 'object' ? req.description : req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BENEFÍCIOS */}
          {job.beneficios?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">
                Benefícios
              </h4>
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                {job.beneficios.map((b: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span>{typeof b === 'object' ? b.description : b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA FIXO NO RODAPÉ MOBILE */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100">
          <button
            onClick={onApply}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 transition-all"
          >
            Candidatar-se Agora
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobDetailsModal