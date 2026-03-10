"use client"
import { 
  CheckCircle2, ChevronLeft, X, Briefcase, Info, FileText, 
  HelpCircle, Sparkles, Loader2, ChevronRight, Binary, 
  Plus, Trash2, Calendar, Zap, Fingerprint, Database 
} from "lucide-react"
import React, { useState, useMemo } from "react"
import { applicationService } from "@/services/applicationService"
import { toast } from "@/components/Notification"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  open: boolean
  onClose: () => void
  job: any
}

const JobApplyModal = ({ open, onClose, job }: Props) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
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
    list.push({ id: "vaga", label: "Protocolo", icon: <Binary size={14}/> })
    list.push({ id: "experiencias", label: "DNA_Trajectory", icon: <Database size={14}/> })
    questionGroups.forEach((group, index) => {
      list.push({ id: `perguntas-${index}`, label: `Análise_${index + 1}`, data: group, icon: <Fingerprint size={14}/> })
    })
    list.push({ id: "impulsionar", label: "Optimization", icon: <Zap size={14}/> })
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
      await applicationService.applyToJob(job.uid, formattedAnswers, experiences as any)
      toast.success("Sincronização de perfil concluída.");
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Falha na transmissão de dados");
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-sm py-3 px-4 font-bold outline-none transition-all text-sm";
  const labelClassName = "text-[8px] font-mono font-black uppercase tracking-[0.3em] opacity-40 mb-1.5 block text-left";

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
        className="w-full h-[95vh] md:h-auto md:max-w-4xl md:rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t md:border border-white/10 relative"
      >
        
        {/* Delos Calibration Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:40px_40px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />

        {/* Header */}
        <div className="px-6 md:px-10 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 relative z-10">
          <div className="flex items-center gap-5">
            <div style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }} className="w-12 h-12 rounded-sm flex items-center justify-center shadow-xl group">
              <Binary className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none mb-1">
                {job.cargo_exibicao}
              </h3>
              <div className="flex items-center gap-2 text-[8px] font-mono font-black uppercase tracking-widest text-[var(--delos-indigo)]">
                <span>{job.empresa_nome}</span>
                <div className="w-1 h-1 bg-[var(--delos-grey)] opacity-30 rounded-full" />
                <span className="opacity-40 italic">Phase::{currentStep.label}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500 hover:text-white transition-all rounded-sm opacity-50 hover:opacity-100"><X className="w-6 h-6" /></button>
        </div>

        {/* Multi-Step Timeline */}
        <div className="flex w-full bg-black/5 dark:bg-white/5 h-12 border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 transition-all duration-500 border-r border-black/5 dark:border-white/5 ${i === stepIndex ? "bg-[var(--delos-amber)]/10 text-[var(--delos-amber)]" : "opacity-30"}`}
            >
              {s.icon}
              <span className="text-[9px] font-mono font-black uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar min-h-[400px] max-h-[60vh] relative z-10">
          
          <AnimatePresence mode="wait">
            {/* ETAPA: VAGA */}
            {currentStep.id === "vaga" && (
              <motion.div key="vaga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-[var(--delos-indigo)]" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Operational_Requirements</span>
                </div>
                <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-sm italic leading-relaxed text-lg tracking-tighter opacity-80 border-l-4 border-l-[var(--delos-indigo)]">
                  "{job.descricao}"
                </div>
              </motion.div>
            )}

            {/* ETAPA: EXPERIÊNCIAS */}
            {currentStep.id === "experiencias" && (
              <motion.div key="exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <div className="text-left">
                    <h4 className="text-sm font-black uppercase italic tracking-widest">DNA_Career_History</h4>
                    <p className="text-[8px] font-mono opacity-40 uppercase tracking-[0.2em]">Sincronizando registros de experiências anteriores</p>
                  </div>
                  <button onClick={handleAddExperience} className="px-4 py-2 border border-[var(--delos-black)] hover:bg-[var(--delos-black)] hover:text-[var(--delos-surface)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 rounded-sm">
                    <Plus size={12} /> ADD_REGISTRY
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="p-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-sm relative group/card">
                      <button onClick={() => handleRemoveExperience(idx)} className="absolute top-2 right-2 p-2 text-red-500/40 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="text-left">
                          <label className={labelClassName}>Empresa_Unit</label>
                          <input type="text" value={exp.empresa} onChange={(e) => updateExperience(idx, 'empresa', e.target.value)} className={inputClassName} placeholder="Ex: Delos_Corp" />
                        </div>
                        <div className="text-left">
                          <label className={labelClassName}>Functional_Role</label>
                          <input type="text" value={exp.cargo} onChange={(e) => updateExperience(idx, 'cargo', e.target.value)} className={inputClassName} />
                        </div>
                        <div className="text-left">
                          <label className={labelClassName}>Sync_Date</label>
                          <input type="date" value={exp.data_entrada} onChange={(e) => updateExperience(idx, 'data_entrada', e.target.value)} className={inputClassName} />
                        </div>
                        <div className="flex items-end pb-2">
                          <label className="flex items-center gap-3 cursor-pointer group/check">
                            <input type="checkbox" checked={exp.atualmente_trabalhando} onChange={(e) => updateExperience(idx, 'atualmente_trabalhando', e.target.checked)} className="w-4 h-4 rounded-none border-[var(--delos-grey)] text-[var(--delos-indigo)] focus:ring-0 bg-transparent" />
                            <span className="text-[9px] font-mono font-black uppercase tracking-widest opacity-60">Status::Active_Role</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PERGUNTAS */}
            {currentStep.id.startsWith("perguntas") && (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
                  <Fingerprint className="text-[var(--delos-indigo)]" size={18} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Cognitive_Diagnostics</span>
                </div>
                <div className="grid gap-8 text-left">
                  {(currentStep as any).data.map((q: any, index: number) => (
                    <div key={q.uid || index} className="space-y-3">
                      <label className="text-[10px] font-black opacity-60 uppercase tracking-widest block italic">
                        {index + 1}. {q.question}
                      </label>
                      <textarea
                        rows={3}
                        value={answers[q.uid] || ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.uid]: e.target.value }))}
                        className={`${inputClassName} resize-none py-4`}
                        placeholder="Waiting for neural input..."
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* OTIMIZAÇÃO */}
            {currentStep.id === "impulsionar" && (
              <motion.div key="turbo" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex items-center">
                <div className="bg-[var(--delos-black)] rounded-sm p-8 md:p-12 text-[var(--delos-surface)] shadow-2xl relative overflow-hidden w-full group border border-white/10">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  <Sparkles className="absolute -right-6 -top-6 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000 text-[var(--delos-amber)]" />
                  <div className="relative z-10 text-center max-w-md mx-auto space-y-6">
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter">Optimize_Sync?</h4>
                    <p className="text-xs opacity-50 uppercase tracking-widest leading-relaxed">
                      Unidades com prioridade de triagem têm <span className="text-[var(--delos-amber)]">300% mais detecção</span> pelas redes neurais corporativas.
                    </p>
                    <label className="flex items-center justify-center gap-5 bg-white/5 p-6 rounded-sm cursor-pointer hover:bg-white/10 transition-all border border-white/10 group/check">
                      <input type="checkbox" className="w-5 h-5 rounded-none border-white/20 bg-transparent text-[var(--delos-amber)] focus:ring-0" />
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Enable_Turbo_Protocol</span>
                        <span className="text-[8px] font-mono text-[var(--delos-amber)] uppercase opacity-70">Priority_Fee::R$ 5,99</span>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-10 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-6 relative z-10">
          <button
            type="button"
            onClick={() => setStepIndex(i => i - 1)}
            disabled={stepIndex === 0 || isSubmitting}
            className="flex items-center gap-2 text-[9px] font-mono font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all disabled:invisible"
          >
            <ChevronLeft className="w-4 h-4" /> REVERSE_PHASE
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
              else handleSubmit()
            }}
            style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
            className="flex-1 md:flex-none px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-30"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {stepIndex === steps.length - 1 ? "EXECUTE_FINAL_SYNC" : "NEXT_UPGRADE_PHASE"}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default JobApplyModal