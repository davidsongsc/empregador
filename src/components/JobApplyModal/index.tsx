"use client"
import { CheckCircle2, ChevronLeft, X, Briefcase, Info, FileText, HelpCircle, Sparkles, Loader2, ChevronRight, Binary, Plus, Trash2, Calendar } from "lucide-react"
import React, { useState, useMemo } from "react"
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
  
  // Estado para Experiências (Substituindo o Upload)
  const [experiences, setExperiences] = useState<any[]>([
    { empresa: '', cargo: '', data_entrada: '', atualmente_trabalhando: false }
  ])
  
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const questionGroups = useMemo(() => {
    if (!job?.perguntas) return []
    const groups = []
    for (let i = 0; i < job.perguntas.length; i += 4) {
      groups.push(job.perguntas.slice(i, i + 4))
    }
    return groups
  }, [job])

  const steps = useMemo(() => {
    const list = []
    list.push({ id: "vaga", label: "Protocolo" })
    list.push({ id: "experiencias", label: "DNA / Trajetória" }) // Nova Etapa
    questionGroups.forEach((group, index) => {
      list.push({ id: `perguntas-${index}`, label: `Análise ${index + 1}`, data: group })
    })
    list.push({ id: "impulsionar", label: "Otimização" })
    return list
  }, [questionGroups])

  if (!open || !job) return null
  const currentStep = steps[stepIndex]

  const handleAddExperience = () => {
    setExperiences([...experiences, { empresa: '', cargo: '', data_entrada: '', atualmente_trabalhando: false }])
  }

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experiences]
    newExp[index][field] = value
    setExperiences(newExp)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([uid, text]) => ({
        question_uid: uid,
        answer: text
      }))
      
      // Enviamos as experiências junto ou em uma chamada separada dependendo do seu serviço
      await applicationService.applyToJob(job.uid, formattedAnswers, experiences)
      
      toast.success("Sincronização de perfil concluída.");
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Falha na transmissão de dados");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4">
      <div className="bg-[#FDFDFD] w-full h-full md:h-auto md:max-w-3xl md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20 relative">
        
        {/* Delos Calibration Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg group">
              <Binary className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black uppercase italic tracking-tighter leading-none mb-1">
                {job.cargo_exibicao}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                <span>{job.empresa_nome}</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-gray-400 italic">{currentStep.label}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90"><X className="w-6 h-6 text-black" /></button>
        </div>

        {/* Progress bar */}
        <div className="flex w-full bg-gray-100 h-1 px-10">
          {steps.map((_, i) => (
            <div key={i} className={`h-full transition-all duration-700 relative ${i <= stepIndex ? "bg-black" : "bg-transparent"}`}
              style={{ width: `${100 / steps.length}%` }} />
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar min-h-[500px] max-h-[70vh] relative z-10">
          
          {/* ETAPA: VAGA */}
          {currentStep.id === "vaga" && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Requisitos do Host</span>
              </div>
              <p className="text-gray-600 font-bold leading-relaxed text-lg italic bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm">
                "{job.descricao}"
              </p>
            </div>
          )}

          {/* ETAPA: EXPERIÊNCIAS (DNA PROFISSIONAL) */}
          {currentStep.id === "experiencias" && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">Trajetória Profissional</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Mapeamento de experiências anteriores</p>
                </div>
                <button 
                  onClick={handleAddExperience}
                  className="px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm relative group/card">
                    <button 
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Empresa / Unidade</label>
                        <input 
                          type="text" 
                          value={exp.empresa}
                          onChange={(e) => updateExperience(idx, 'empresa', e.target.value)}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-3 px-5 font-bold text-sm outline-none transition-all"
                          placeholder="Ex: Imperio Sapolio"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Cargo Desempenhado</label>
                        <input 
                          type="text" 
                          value={exp.cargo}
                          onChange={(e) => updateExperience(idx, 'cargo', e.target.value)}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-3 px-5 font-bold text-sm outline-none transition-all"
                          placeholder="Ex: Gestor de Tráfego"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Data de Entrada</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            value={exp.data_entrada}
                            onChange={(e) => updateExperience(idx, 'data_entrada', e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-xl py-3 px-5 font-bold text-sm outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer group/check">
                          <input 
                            type="checkbox" 
                            checked={exp.atualmente_trabalhando}
                            onChange={(e) => updateExperience(idx, 'atualmente_trabalhando', e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-gray-200 text-black focus:ring-0 transition-all"
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/check:text-black">Atualmente aqui</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERGUNTAS */}
          {currentStep.id.startsWith("perguntas") && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-8">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black italic">Diagnóstico Técnico</span>
              </div>
              <div className="grid gap-8">
                {(currentStep as any).data.map((q: any, index: number) => (
                  <div key={q.uid || index} className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block pl-1 italic">
                      {index + 1}. {q.question}
                    </label>
                    <textarea
                      rows={3}
                      value={answers[q.uid] || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.uid]: e.target.value }))}
                      className="w-full rounded-[24px] border-2 border-gray-100 bg-gray-50 px-6 py-5 text-sm font-bold focus:border-black focus:bg-white transition-all outline-none resize-none"
                      placeholder="Aguardando input de dados..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTIMIZAÇÃO (IMPULSIONAR) */}
          {currentStep.id === "impulsionar" && (
            <div className="animate-in zoom-in-95 duration-500 h-full flex items-center">
              <div className="bg-black rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden w-full group">
                <Sparkles className="absolute -right-6 -top-6 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                <div className="relative z-10 text-center max-w-md mx-auto">
                  <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Otimizar Processamento?</h4>
                  <p className="text-gray-400 text-sm mb-10 leading-relaxed font-bold">
                    Hosts com prioridade de triagem têm <span className="text-white">3x mais matches</span> confirmados pelo sistema Delos.
                  </p>
                  <label className="flex items-center justify-center gap-5 bg-white/5 p-6 rounded-3xl cursor-pointer hover:bg-white/10 transition-all border border-white/10 group/check">
                    <input type="checkbox" className="w-6 h-6 rounded border-2 border-white/20 bg-transparent text-indigo-500 focus:ring-0" />
                    <div className="text-left">
                      <span className="block text-[11px] font-black uppercase tracking-[0.2em]">Ativar Turbo Protocol</span>
                      <span className="text-[9px] text-indigo-400 font-bold uppercase italic">Taxa de prioridade: R$ 5,99</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 border-t bg-white flex items-center justify-between gap-6 relative z-10">
          <button
            type="button"
            onClick={() => setStepIndex(i => i - 1)}
            disabled={stepIndex === 0 || isSubmitting}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all disabled:opacity-0"
          >
            <ChevronLeft className="w-4 h-4" /> Fase Anterior
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
              else handleSubmit()
            }}
            className="flex-1 md:flex-none px-12 py-5 bg-black hover:bg-indigo-600 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {stepIndex === steps.length - 1 ? "Sincronizar Protocolo" : "Próxima Fase"}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JobApplyModal