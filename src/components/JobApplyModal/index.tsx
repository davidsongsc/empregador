"use client"
import { CheckCircle2, ChevronLeft, X, UploadCloud, Info, FileText, HelpCircle, Sparkles, Loader2 } from "lucide-react"
import React, { useState, useMemo, useRef } from "react"
import { applicationService } from "@/services/applicationService"
import { toast } from "@/components/Notification"

type Props = {
  open: boolean
  onClose: () => void
  job: any
}

const JobApplyModal = ({ open, onClose, job }: Props) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para os dados da candidatura
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Dividir as perguntas em grupos de 4
  const questionGroups = useMemo(() => {
    if (!job?.perguntas) return []
    const groups = []
    for (let i = 0; i < job.perguntas.length; i += 4) {
      groups.push(job.perguntas.slice(i, i + 4))
    }
    return groups
  }, [job])

  // 2. Definir os passos dinamicamente
  const steps = useMemo(() => {
    const list = []
    list.push({ id: "vaga", label: "Vaga" })
    list.push({ id: "curriculo", label: "Currículo" })
    questionGroups.forEach((group, index) => {
      list.push({ id: `perguntas-${index}`, label: `Perguntas ${index + 1}`, data: group })
    })
    list.push({ id: "impulsionar", label: "Impulsionar" })
    return list
  }, [questionGroups])

  if (!open || !job) return null
  const currentStep = steps[stepIndex]

  // Handler para submissão final
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Formata as respostas conforme o Serializer espera: [{ question_uid, answer }]
      const formattedAnswers = Object.entries(answers).map(([uid, text]) => ({
        question_uid: uid,
        answer: text
      }))

      await applicationService.applyToJob(job.uid, formattedAnswers, resumeFile || undefined)

      toast.success("Candidatura enviada com sucesso!")
      onClose()
      // Reset de estado opcional aqui
    } catch (err: any) {
      const errorMsg = err.errors?.job?.[0] || err.message || "Erro ao enviar candidatura"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Por favor, envie apenas arquivos PDF")
        return
      }
      setResumeFile(file)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-0 md:p-4">
      <div className="bg-white w-full h-full md:h-auto md:max-w-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-all border border-white/20">

        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-tight">{job.cargo_exibicao}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                {job.empresa_nome} • {job.tipo_vaga_display}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-300" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex w-full bg-slate-100 h-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-full transition-all duration-500 ${i <= stepIndex ? "bg-indigo-600" : "bg-transparent"}`}
              style={{ width: `${100 / steps.length}%` }} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-[400px]">
          {/* ETAPA: VAGA */}
          {currentStep.id === "vaga" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <Info className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Resumo da vaga</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-3xl border border-slate-100 italic">
                "{job.descricao}"
              </p>
            </div>
          )}

          {/* ETAPA: CURRÍCULO */}
          {currentStep.id === "curriculo" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`text-center py-12 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group ${resumeFile ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200"
                  }`}
              >
                {resumeFile ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <p className="text-sm font-black text-emerald-900 uppercase tracking-tighter">{resumeFile.name}</p>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">Clique para trocar o arquivo</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-16 h-16 text-slate-300 mx-auto mb-4 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Anexar Currículo PDF</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Obrigatório para prosseguir</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ETAPAS DINÂMICAS DE PERGUNTAS */}
          {/* ETAPAS DINÂMICAS DE PERGUNTAS */}
          {currentStep.id.startsWith("perguntas") && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <HelpCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Perguntas Adicionais</span>
              </div>

              {/* JobApplyModal.tsx */}
              {(currentStep as any).data.map((q: any, index: number) => {
                // Pegamos o UID real que o Django enviou
                const questionKey = q.uid;

                return (
                  <div key={q.uid || index} className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 leading-snug">
                      {q.question}
                    </label>
                    <textarea
                      rows={3}
                      // Usamos o UID como chave do estado para o Django reconhecer no POST
                      value={answers[questionKey] || ""}
                      onChange={(e) => setAnswers(prev => ({
                        ...prev,
                        [questionKey]: e.target.value
                      }))}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
                      placeholder="Escreva sua resposta aqui..."
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ETAPA: IMPULSIONAR */}
          {currentStep.id === "impulsionar" && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Candidatura Turbo</span>
                  </div>
                  <h4 className="text-2xl font-black mb-4 leading-tight">Quer dobrar suas chances?</h4>
                  <p className="text-indigo-100 text-sm mb-8 leading-relaxed font-medium">
                    Por apenas <span className="text-white font-black text-lg underline">R$ 5,99</span> priorizamos seu perfil.
                  </p>
                  <label className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl cursor-pointer hover:bg-white/20 transition-all border border-white/10">
                    <input type="checkbox" className="w-6 h-6 rounded-lg border-none text-indigo-500 focus:ring-0 cursor-pointer" />
                    <span className="text-sm font-black uppercase tracking-tighter">Sim, quero impulsionar!</span>
                  </label>
                </div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t bg-slate-50/50 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => setStepIndex(i => i - 1)}
            disabled={stepIndex === 0 || isSubmitting}
            className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-0"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar
          </button>

          <button
            type="button"
            disabled={isSubmitting || (currentStep.id === "curriculo" && !resumeFile)}
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
              else handleSubmit()
            }}
            className="flex-1 md:flex-none px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : stepIndex === steps.length - 1 ? "Finalizar" : "Próxima Etapa"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobApplyModal