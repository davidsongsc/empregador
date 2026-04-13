"use client"
import {
  CheckCircle2, ChevronLeft, X, Briefcase, Info, FileText,
  HelpCircle, Sparkles, Loader2, ChevronRight, Binary,
  Plus, Trash2, Calendar, Zap, Fingerprint, Database
} from "lucide-react"
import { sendGAEvent } from '@next/third-parties/google';
import React, { useState, useMemo, useEffect } from "react"
import { applicationService } from "@/services/applicationService"
import { toast } from "@/components/Notification"
import { motion, AnimatePresence } from "framer-motion"
import { useJobQuestionStore } from "@/store/useJobQuestionStore"
import { useExperienceStore } from "@/store/useExperienceStore"
import { useBenefitStore } from "@/store/useBenefitStore";
import { useJobStore } from "@/store/useJobStore"
import { useApplicationStore } from "@/store/useApplicationStore"
type Props = {
  user: any;
  open: boolean
  onClose: () => void
  job: any
}

const JobApplyModal = ({ user, open, onClose, job }: Props) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const validateUser = !!user?.profile?.id;
  const [shouldEditExperience, setShouldEditExperience] = useState(false);
  const { removeJobFromCache } = useJobStore(); // Importe a ação
  const { benefitsByJob, fetchBenefits, loading: loadingBenefits } = useBenefitStore();
  const { experiences: remoteExperiences, fetchExperiences, loading: loadingExp } = useExperienceStore()
  const { questions, loadingQuestions, fetchQuestions } = useJobQuestionStore()
  console.log('experiencias', remoteExperiences)
  // ESTADOS LOCAIS
  const [experiences, setExperiences] = useState<any[]>(remoteExperiences)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const { fetchApplications } = useApplicationStore();
  // 1. SINCRONIZAÇÃO DE DADOS (PERGUNTAS E EXPERIÊNCIAS)
  useEffect(() => {
    if (open && job?.id) {
      setAnswers({});
      setStepIndex(0);

      fetchQuestions(job.id);
      fetchBenefits(job.id);

      const profileId = user?.profile?.id;
      if (profileId) fetchExperiences(profileId, true);
    }
  }, [open, job?.id, user?.profile?.id, fetchQuestions, fetchExperiences, fetchBenefits]);

  // 2. POPULAR ESTADO LOCAL COM DADOS DO STORE
  useEffect(() => {
    if (open && !loadingExp) {
      // 1. Extração robusta do array (suporta .items ou array direto)
      const dataToMap = Array.isArray(remoteExperiences)
        ? remoteExperiences
        : (remoteExperiences as any)?.items || [];

      const hasData = dataToMap.length > 0;

      // 2. Lógica de Decisão do Checkbox:
      // Se o usuário não tem NENHUMA experiência, forçamos 'true' para ele cadastrar.
      // Se ele já tem, deixamos 'false' por padrão para agilizar o fluxo (UX otimizada).
      setShouldEditExperience(!hasData);

      // 3. Mapeamento para o Estado de UX (Editable List)
      if (hasData) {
        setExperiences(dataToMap.map((exp: any) => ({
          id: exp.id,
          empresa: exp.empresa || "",
          cargo: exp.cargo || "",
          data_entrada: exp.data_entrada || "",
          data_saida: exp.data_saida || "",
          atualmente_trabalhando: exp.atualmente_trabalhando || false,
          descricao: exp.descricao || ""
        })));
      } else {
        // Slot vazio para novo cadastro caso a base esteja limpa
        setExperiences([{
          empresa: '',
          cargo: '',
          data_entrada: '',
          data_saida: '',
          atualmente_trabalhando: false,
          descricao: ''
        }]);
      }
    }
  }, [remoteExperiences, open, loadingExp]);


  // 68 | Adicionamos o ?. no job e uma verificação curta no início
  const currentBenefits = useMemo(() => {
    if (!job?.id) return [];
    return benefitsByJob[job.id] || [];
  }, [benefitsByJob, job?.id]); // Use job?.id como dependência específica  // 3. LOGICA DE STEPS E PERGUNTAS (INALTERADA)
  const questionGroups = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    const groups = [];
    for (let i = 0; i < questions.length; i += 4) {
      groups.push(questions.slice(i, i + 4));
    }
    return groups;
  }, [questions]);

  const steps = useMemo(() => {
    const list = [];
    list.push({ id: "vaga", label: "Informações da Vaga", icon: <Binary size={14} /> });

    // Só insere o step de experiências se o checkbox estiver ativo
    if (shouldEditExperience) {
      list.push({ id: "experiencias", label: "Suas Experiências", icon: <Database size={14} /> });
    }

    questionGroups.forEach((group, index) => {
      list.push({ id: `perguntas-${index}`, label: `Análise_${index + 1}`, data: group, icon: <Fingerprint size={14} /> });
    });

    list.push({ id: "impulsionar", label: "Impulsionamento", icon: <Zap size={14} /> });
    return list;
  }, [questionGroups, shouldEditExperience]); // Adicione a dependência aqui!

  useEffect(() => {
    if (open && steps[stepIndex]) {
      sendGAEvent('event', 'screen_view', {
        app_name: 'FreelaCerto',
        screen_name: `Apply_Step: ${steps[stepIndex].id}`,
        job_title: job?.cargo_nome
      });
    }
  }, [stepIndex, open, steps, job?.cargo_nome]);

  if (!open || !job) return null;
  const currentStep = steps[stepIndex] || steps[0] || { id: 'loading' };
  // HANDLERS
  const handleAddExperience = () => {
    setExperiences([{
      // id: undefined -> Isso sinaliza para o handleSubmit que deve ser um POST
      empresa: '',
      cargo: '',
      data_entrada: '',
      atualmente_trabalhando: false,
      descricao: ''
    }, ...experiences]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExp = experiences.filter((_, i) => i !== index);
    setExperiences(newExp.length > 0 ? newExp : [{ empresa: '', cargo: '', data_entrada: '', data_saida: '', atualmente_trabalhando: false }]);
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experiences]
    newExp[index][field] = value
    setExperiences(newExp)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (shouldEditExperience) {
        const experienceTasks = experiences.map(exp => {
          if (!exp.empresa || !exp.cargo) return null;


          const sanitizedExp = {
            ...exp,
            data_entrada: exp.data_entrada || null,
            data_saida: exp.atualmente_trabalhando ? null : (exp.data_saida || null)
          };

          if (exp.id) {
            return useExperienceStore.getState().updateExperience(exp.id, sanitizedExp);
          } else {
            return useExperienceStore.getState().addExperience({
              ...sanitizedExp,
              profile_id: user.profile.id
            });
          }
        }).filter(task => task !== null);

        if (experienceTasks.length > 0) {
          await Promise.all(experienceTasks);
        }
      }

      const formattedAnswers = Object.entries(answers).map(([id, text]) => ({
        question_uid: id,
        answer: text,
      }));

      const targetJobId = job.id;
      await applicationService.applyToJob(targetJobId, formattedAnswers);
      sendGAEvent('event', 'conversion', {
        event_category: 'job_application_complete',
        event_label: job.cargo_nome,
        job_id: targetJobId,
        boost_active: false,
        value: 1
      });

      removeJobFromCache(targetJobId);
      await fetchApplications({}, true, true);

      toast.success("Sincronização completa: Perfil e Candidatura.");
      onClose();
    } catch (err: any) {
      // Rastrear falha também é importante para entender erros no funil
      toast.error(err.message);
      sendGAEvent('event', 'exception', {
        description: `Application Error: ${err.message}`,
        fatal: false
      });

      const errorMsg = err.response?.data?.detail || "ERRO_NA_OPERACAO";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-sm py-3 px-4 font-bold outline-none transition-all text-sm text-[var(--delos-black)]";
  const labelClassName = "text-[8px] font-mono font-black uppercase tracking-[0.3em] opacity-40 mb-1.5 block text-left";

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4">
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
        className="w-full h-[95vh] md:h-auto md:max-w-4xl md:rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border-t md:border border-white/10 relative"
      >
        {/* ... (Grades e Header inalterados) ... */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:40px_40px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />

        <div className="px-6 md:px-10 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 relative z-10">
          <div className="flex items-center gap-5">
            <div style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }} className="w-12 h-12 rounded-sm flex items-center justify-center shadow-xl">
              <Binary className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none mb-1">
                {job.cargo_nome || job.cargo_nome || "JOB_UNIT"}
              </h3>
              <div className="flex items-center gap-2 text-[8px] font-mono font-black uppercase tracking-widest text-[var(--delos-indigo)]">
                <span>{job.empresa_nome}</span>
                <div className="w-1 h-1 bg-[var(--delos-grey)] opacity-30 rounded-full" />
                <span className="opacity-40 italic">Etapa::{currentStep?.label}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500 hover:text-white transition-all rounded-sm opacity-50 hover:opacity-100"><X className="w-6 h-6" /></button>
        </div>

        {/* Steps Timeline */}
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

        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar min-h-[400px] max-h-[60vh] relative z-10">
          <AnimatePresence mode="wait">
            {currentStep.id === "vaga" && (
              <motion.div key="vaga" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-left">

                {/* Descrição da Vaga */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-[var(--delos-indigo)]" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Sobre a Vaga</span>
                  </div>
                  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 rounded-sm italic leading-relaxed text-lg tracking-tighter opacity-80 border-l-4 border-l-[var(--delos-indigo)]">
                    "{job.descricao}"
                  </div>
                </div>

                {/* Listagem de Benefícios (Protocolo de Vantagens) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-[var(--delos-amber)]" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Benefícios</span>
                    {loadingBenefits && <Loader2 size={10} className="animate-spin opacity-40" />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentBenefits.length > 0 ? (
                      currentBenefits.map((benefit: any) => (
                        <div
                          key={benefit.id}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-black/5 dark:border-white/5 rounded-sm group hover:border-[var(--delos-amber)]/30 transition-all"
                        >
                          <div className="w-8 h-8 rounded-sm bg-[var(--delos-amber)]/10 text-[var(--delos-amber)] flex items-center justify-center flex-shrink-0">
                            {/* Aqui você pode mapear ícones dinâmicos se tiver o campo 'icon' no banco */}
                            <Zap size={14} className="group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                              {benefit.description}
                            </span>
                            <span className="text-[7px] font-mono opacity-30 uppercase mt-1">Verified_Benefit</span>
                          </div>
                        </div>
                      ))
                    ) : !loadingBenefits && (
                      <div className="col-span-full py-4 px-6 border border-dashed border-black/10 dark:border-white/10 rounded-sm opacity-40 text-[9px] font-mono uppercase tracking-widest text-center">
                        No_Incentives_Declared_For_This_Unit
                      </div>
                    )}
                  </div>

                  {/* Controle de Fluxo: Editar Experiências */}

                </div>

              </motion.div>
            )}

            {currentStep.id === "experiencias" && (
              <motion.div key="exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">

                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <div className="text-left">
                    <h2 className="text-sm xl:text-2xl font-black uppercase italic tracking-widest">Experiências</h2>
                    {loadingExp ? (
                      <span className="text-[8px] xl:text-[14px] font-mono text-[var(--delos-amber)] animate-pulse uppercase">Carregando...</span>
                    ) : (
                      <p className="text-[8px] xl:text-[14px] font-mono opacity-40 uppercase tracking-[0.2em]">Registros Profissionais do Candidato</p>
                    )}
                  </div>
                  <button onClick={handleAddExperience} className="px-4 py-2 border border-[var(--delos-black)] hover:bg-[var(--delos-black)] hover:text-[var(--delos-surface)] transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 rounded-sm">
                    <Plus size={12} /> Nova Experiência
                  </button>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp, idx) => {
                    const isExisting = !!exp.id; // Verifica se o registro já existe no banco

                    return (
                      <div
                        key={idx}
                        className={`p-6 border rounded-sm relative transition-all duration-500 ${isExisting
                          ? "bg-black/5 border-black/10 opacity-80" // Estilo para existentes
                          : "bg-[var(--delos-amber)]/5 border-[var(--delos-amber)]/30 shadow-[0_0_15px_rgba(255,191,0,0.1)]" // Estilo para novos
                          }`}
                      >
                        {/* Indicador de Novo Registro */}
                        {!isExisting && (
                          <div className="absolute -top-2 -left-2 bg-[var(--delos-amber)] text-black text-[7px] font-mono font-bold px-2 py-0.5 uppercase tracking-tighter">
                            Adicionar nova data
                          </div>
                        )}

                        <button onClick={() => handleRemoveExperience(idx)} className="absolute top-2 right-2 p-2 text-red-500/40 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="text-left">
                            <label className={labelClassName}>Empresa</label>
                            <input
                              type="text"
                              value={exp.empresa}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateExperience(idx, 'empresa', val);

                                // Rastreia o início da digitação (Interação com o Formulário)
                                if (val.length === 1) {
                                  sendGAEvent('event', 'form_start_typing', {
                                    field_name: 'experience_company',
                                    job_id: job?.id
                                  });
                                }
                              }}
                              className={inputClassName}
                              placeholder="Ex: Delos_Corp"
                            />
                          </div>

                          <div className="text-left">
                            <label className={labelClassName}>Função/Cargo</label>
                            <input
                              type="text"
                              value={exp.cargo}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateExperience(idx, 'cargo', val);

                                // Rastreia a interação com o campo de cargo
                                sendGAEvent('event', 'form_interaction', {
                                  field_name: 'experience_role',
                                  job_context: job?.cargo_nome
                                });
                              }}
                              className={inputClassName}
                              placeholder="Ex: Garçom_Líder"
                            />
                          </div>

                          {/* Datas de Entrada e Saída */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-left">
                              <label className={labelClassName}>Entrou em</label>
                              <input
                                type="date"
                                value={exp.data_entrada}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateExperience(idx, 'data_entrada', val);

                                  // Rastreia a interação com datas (UX Insight)
                                  sendGAEvent('event', 'form_interaction', {
                                    field: 'date_entry',
                                    job_context: job?.cargo_nome
                                  });
                                }}
                                className={inputClassName}
                              />
                            </div>

                            <div className="text-left">
                              <label className={labelClassName}>Saida em</label>
                              <input
                                type="date"
                                disabled={exp.atualmente_trabalhando}
                                // Protocolo de Segurança: Se for 'Active_Role', o valor é forçado para vazio
                                value={exp.atualmente_trabalhando ? "" : (exp.data_saida ?? "")}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateExperience(idx, 'data_saida', val);

                                  // Validação Analítica: Se a saída for antes da entrada, logamos como atrito de UX
                                  if (exp.data_entrada && val < exp.data_entrada) {
                                    sendGAEvent('event', 'form_error_user', {
                                      error_type: 'invalid_date_range',
                                      field: 'date_exit'
                                    });
                                  }
                                }}
                                // Estilização Dinâmica: Opacidade reduzida via Protocolo Delos quando bloqueado
                                className={`${inputClassName} ${exp.atualmente_trabalhando
                                  ? "opacity-20 cursor-not-allowed grayscale"
                                  : "hover:border-[var(--delos-amber)]/50"
                                  }`}
                              />
                            </div>
                          </div>

                          <div className="flex items-end pb-2">
                            <label className="flex items-center gap-3 cursor-pointer group/check">
                              <input
                                type="checkbox"
                                checked={exp.atualmente_trabalhando}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;

                                  // 1. Rastreamento GA4: Entender o perfil do candidato
                                  sendGAEvent('event', 'profile_update_interaction', {
                                    event_category: 'experience_form',
                                    event_label: 'toggle_currently_working',
                                    is_active_worker: isChecked,
                                    job_context: job?.cargo_exibicao || "unknown"
                                  });

                                  // 2. Lógica Funcional Original
                                  updateExperience(idx, 'atualmente_trabalhando', isChecked);

                                  // Se estiver trabalhando, o sistema limpa a data de saída (Protocolo de Integridade)
                                  if (isChecked) {
                                    updateExperience(idx, 'data_saida', null);
                                  }
                                }}
                                className="w-4 h-4 rounded-none border-[var(--delos-grey)] text-[var(--delos-indigo)] focus:ring-0 bg-transparent"
                              />
                              <span className={`text-[9px] font-mono font-black uppercase tracking-widest ${exp.atualmente_trabalhando ? "text-[var(--delos-indigo)]" : "opacity-60"}`}>
                                Status::Active_Role
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ETAPA: PERGUNTAS DINÂMICAS */}
            {currentStep.id.startsWith("perguntas") && (
              <motion.div key={currentStep.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
                  <Fingerprint className="text-[var(--delos-indigo)]" size={18} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Cognitive_Diagnostics</span>
                  {loadingQuestions && <Loader2 size={14} className="animate-spin opacity-40" />}
                </div>
                <div className="grid gap-8 text-left">
                  {/* IMPORTANTE: Usamos q.id aqui porque seu JSON traz 'id' 
      */}
                  {(currentStep as any).data.map((q: any, index: number) => (
                    <div key={q.id} className="space-y-3">
                      <label className="text-[10px] font-black opacity-60 uppercase tracking-widest block italic">
                        {index + 1}. {q.question}
                      </label>
                      <textarea
                        rows={3}
                        // Ligamos o valor ao ID único da pergunta no estado 'answers'
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers(prev => ({
                          ...prev,
                          [q.id]: e.target.value
                        }))}
                        className={`${inputClassName} resize-none py-4`}
                        placeholder="Aguardando entrada de dados..."
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep.id === "impulsionar" && (
              <motion.div key="turbo" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex items-center">
                <div className="bg-[var(--delos-black)] rounded-sm p-8 md:p-12 text-[var(--delos-surface)] shadow-2xl relative overflow-hidden w-full group border border-white/10">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                  <Sparkles className="absolute -right-6 -top-6 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000 text-[var(--delos-amber)]" />
                  <div className="relative z-10 text-center max-w-md mx-auto space-y-6">
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter">Quer receber propostas?</h4>
                    <p className="text-xs opacity-50 uppercase tracking-widest leading-relaxed">
                      Unidades com prioridade de triagem têm <span className="text-[var(--delos-amber)]">300% mais detecção</span> pelas redes neurais corporativas.
                    </p>
                    <label className="flex items-center justify-center gap-5 bg-white/5 p-6 rounded-sm cursor-pointer hover:bg-white/10 transition-all border border-white/10 group/check">
                      <input type="checkbox" className="w-5 h-5 rounded-none border-white/20 bg-transparent text-[var(--delos-amber)] focus:ring-0" />
                      <div className="text-left">
                        <span className="block text-[14px] font-black uppercase tracking-[0.2em]">Ative o Turbo</span>
                        <span className="text-[10px] font-mono text-[var(--delos-amber)] uppercase opacity-70">Valor::R$ 2,99</span>
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

          {/* Botão de Voltar (REVERSE_PHASE) */}
          <button
            type="button"
            onClick={() => setStepIndex(i => i - 1)}
            // Desabilita se for o primeiro passo ou se estiver em processo de submissão
            disabled={stepIndex === 0 || isSubmitting}
            className="flex-1 md:flex-none px-8 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-0 disabled:pointer-events-none border border-black/10 dark:border-white/10 text-[var(--delos-black)]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          {validateUser && (
            <div className=" border-t border-black/5 dark:border-white/5">
              <label className="flex items-start gap-4 p-6 bg-delos-indigo/5 border border-delos-indigo/20 rounded-sm cursor-pointer group hover:bg-delos-indigo/10 transition-all">
                <input
                  type="checkbox"
                  checked={shouldEditExperience}
                  onChange={(e) => {
                    const hasExp = remoteExperiences?.length > 0 || (remoteExperiences as any)?.items?.length > 0;
                    // Se não tiver experiência, não deixa desmarcar
                    if (!hasExp) {
                      toast.info("DNA_CAREER_EMPTY: Você precisa cadastrar ao menos uma experiência.");
                      return;
                    }
                    setShouldEditExperience(e.target.checked);
                  }}
                  className="w-5 h-5 mt-1 rounded-none border-delos-indigo/30 bg-transparent text-delos-indigo focus:ring-0"
                />
                <div className="space-y-1">
                  <span className="block text-[12px] font-black uppercase tracking-widest text-delos-indigo">
                    Experiências
                  </span>
                  <p className="text-[9px] font-mono opacity-50 uppercase leading-tight">
                    Para adicionar ou editar experiências.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Botão de Avançar/Sync (EXECUTE_SYNC) */}
          <button
            type="button"
            // BLOQUEIO CRÍTICO: Se validateUser for false, o botão não clica
            disabled={isSubmitting || !validateUser || (currentStep.id.startsWith("perguntas") && loadingQuestions)}
            onClick={() => {
              if (stepIndex < steps.length - 1) setStepIndex(i => i + 1)
              else handleSubmit()
            }}
            style={{
              backgroundColor: validateUser ? 'var(--delos-black)' : 'var(--delos-grey)',
              color: 'var(--delos-surface)'
            }}
            className="flex-1 md:flex-none px-12 py-5 rounded-sm font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {!validateUser ? (
                  "Candidato Desconhecido" // Feedback visual do porquê está bloqueado
                ) : (
                  <>
                    {stepIndex === steps.length - 1 ? "Candidatar-se" : "Proximo"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default JobApplyModal