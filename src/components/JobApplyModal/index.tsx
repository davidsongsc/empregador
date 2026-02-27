"use client"
import { CheckCircle2, ChevronLeft, X, UploadCloud, Info } from "lucide-react"
import React from "react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
}

const JobApplyModal = ({ open, onClose, job }: Props) => {
  const [stepIndex, setStepIndex] = React.useState(0)
  
  if (!open || !job) return null

  const steps = [
    "Vaga",
    "Currículo",
    "Dados Pessoais",
    job.perguntas?.length ? "Perguntas" : null,
    "Impulsionar",
  ].filter(Boolean)

  const currentStep = steps[stepIndex]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-0 md:p-4">
      {/* Container Principal: Full Page no Mobile */}
      <div className="bg-white w-full h-full md:h-auto md:max-w-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all">
        
        {/* Header Fixo */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {job.cargo}
            </h3>
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-wider">
              {job.empresa || "Confidencial"} • {job.localizacao || "Remoto"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="flex w-full bg-gray-100 h-1.5">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`h-full transition-all duration-500 ${
                i <= stepIndex ? "bg-indigo-600" : "bg-transparent"
              }`}
              style={{ width: `${100 / steps.length}%` }}
            />
          ))}
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          <form className="space-y-8">
            
            {/* ETAPA 0: DESCRIÇÃO DA VAGA */}
            {currentStep === "Vaga" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2 mb-4 text-indigo-700">
                  <Info className="w-5 h-5" />
                  <span className="font-semibold">Detalhes da Oportunidade</span>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {/* Simulando texto formatado */}
                  <p className="whitespace-pre-line leading-relaxed">
                    {job.descricao || "Esta vaga busca profissionais capacitados para atuar em um ambiente dinâmico..."}
                  </p>
                </div>
              </div>
            )}

            {/* ETAPA 1: CURRÍCULO */}
            {currentStep === "Currículo" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                  <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                  <UploadCloud className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700">Clique para fazer upload do seu currículo</p>
                  <p className="text-xs text-gray-400 mt-1">Apenas arquivos em PDF (Máx. 5MB)</p>
                </div>
              </div>
            )}

            {/* ETAPA 2: DADOS */}
            {currentStep === "Dados Pessoais" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">CPF</label>
                  <input className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
                  <input className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="(00) 00000-0000" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Endereço Completo</label>
                  <input className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Rua, número, bairro, cidade" />
                </div>
              </div>
            )}

            {/* ETAPA 3: PERGUNTAS */}
            {currentStep === "Perguntas" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                {job.perguntas.map((q: string, i: number) => (
                  <div key={i} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{q}</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Sua resposta..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ETAPA 4: UPSELL */}
            {currentStep === "Impulsionar" && (
              <div className="animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                      <span className="text-xs font-bold uppercase tracking-widest">Upgrade de Candidatura</span>
                    </div>
                    <p className="text-xl font-bold mb-2">Destaque seu perfil!</p>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                      Por apenas <span className="text-white font-bold">R$ 5,99</span>, enviamos seu currículo automaticamente para outras 10 vagas similares.
                    </p>
                    <label className="flex items-center gap-3 bg-white/10 p-3 rounded-xl cursor-pointer hover:bg-white/20 transition-all border border-white/20">
                      <input type="checkbox" className="w-5 h-5 rounded border-none text-indigo-600 focus:ring-0" />
                      <span className="text-sm font-semibold">Sim, quero ser impulsionado</span>
                    </label>
                  </div>
                  {/* Círculo decorativo */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => stepIndex > 0 && setStepIndex(i => i - 1)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 transition-all ${
              stepIndex === 0 ? "opacity-0 invisible" : "opacity-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            type="button"
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
              else onClose()
            }}
            className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            {stepIndex === steps.length - 1 ? "Finalizar Candidatura" : "Próxima Etapa"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobApplyModal