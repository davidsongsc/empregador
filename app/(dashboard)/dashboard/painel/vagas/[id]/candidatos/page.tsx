"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCorporateApplications } from "@/hooks/useCorporateApplications";
import { updateApplicationStatus } from "@/services/jobService";
import {
  User, Phone, ChevronLeft, Loader2, MapPin, Lock, Mail,
  FileText, History, Search, ArrowRight, Zap, X,
  CheckCircle2, Ban, MoreHorizontal, Calendar, Info,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/Notification";
import { GROUPED_STATUS, STATUS_CONFIG } from "@/data/statusLabels";

const FLOW_SEQUENCE = [
  'applied', 'screening', 'reviewing', 'shortlisted',
  'interview_scheduled', 'interviewing', 'technical_test',
  'test_submitted', 'test_review', 'offer_sent', 'hired'
];

export default function CandidatosPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { activeCompanyId, } = useAuthStore();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  // Estados de Filtro e UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // Adicione este estado no topo do componente
  // Hook Corporativo Original
  const { candidatos, total, loading, updateStatus } = useCorporateApplications({
    jobId: jobId,
    status: filterStatus === "all" ? undefined : filterStatus,
    page: page,
    pageSize: 10
  });

  // Filtro de busca local (nome)
  const filteredCandidatos = useMemo(() => {
    return candidatos.filter(app =>
      app.candidate_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidatos, searchTerm]);

  // Lógica de Avanço de Etapa Original
  const handleNextStep = async (app: any) => {
    // 1. Bloqueio imediato se já estiver carregando
    if (isUpdating) return;

    const currentIndex = FLOW_SEQUENCE.indexOf(app.status);

    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];

      setIsUpdating(true); // 2. Inicia o estado de bloqueio

      try {
        await updateApplicationStatus(app.id, nextStatus);
        updateStatus(app.id, nextStatus);

        toast.success(`Protocolo Atualizado: ${STATUS_CONFIG[nextStatus].label}`);

        if (selectedApp?.id === app.id) {
          setSelectedApp({ ...app, status: nextStatus });
        }
      } catch (err) {
        toast.error("Falha na atualização de protocolo");
      } finally {
        setIsUpdating(false); // 3. Libera o botão independente do resultado
      }
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    if (isUpdating) return; // Bloqueio preventivo

    setIsUpdating(true); // Ativa o lock
    try {
      await updateApplicationStatus(appId, newStatus);
      updateStatus(appId, newStatus);

      // Feedback de sistema
      toast.success(`Protocolo reescrito para: ${STATUS_CONFIG[newStatus].label}`);

      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      setIsChangingStatus(false); // Fecha o menu após sucesso
    } catch (err) {
      toast.error("Erro na reescrita de dados do Host");
    } finally {
      setIsUpdating(false); // Libera o lock
    }
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-400 font-sans overflow-x-hidden pb-20 selection:bg-amber-500/30">

      {/* HEADER DINÂMICO DELOS */}
      <header className="border-b border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 group transition-all">
              <ChevronLeft size={20} className="text-amber-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-sm font-black tracking-[0.3em] uppercase text-white">Gestão de <span className="text-amber-600">Staff</span></h1>
              <p className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase italic">
                {loading ? "Sincronizando..." : `${total} Candidatos Identificados`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="text"
                placeholder="BUSCAR NOME..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-none py-2.5 pl-9 pr-4 text-[10px] tracking-widest focus:border-amber-600/50 outline-none transition-all w-48 lg:w-64 uppercase text-white"
              />
            </div>
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest px-4 py-2.5 outline-none uppercase focus:border-amber-600 text-slate-300 rounded-none cursor-pointer appearance-none"
            >
              <option value="all">STATUS: TODOS</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key} className="bg-[#0A0A0A]">{val.label.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-2">
        {loading && candidatos.length === 0 ? (
          <div className="py-40 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">Scanning Bio-Network...</p>
          </div>
        ) : (
          filteredCandidatos.map((app) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const isUnlocked = app.status !== 'applied';
            const details = app.candidate_details;

            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="group flex items-center justify-between p-5 bg-[#0D0D0D] border border-white/5 hover:border-amber-900/40 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${config.glow}`} />

                <div className="flex items-center gap-6 z-10">
                  <div className="w-14 h-14 bg-slate-900 border border-white/10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                    {isUnlocked && details?.foto ? (
                      <Image src={details.foto} alt="Avatar" width={56} height={56} className="object-cover" />
                    ) : <User className="text-slate-800" size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2">
                      {isUnlocked ? details.name : "Unidade Protegida"}
                      {isUnlocked && details?.data_nascimento && (
                        <span className="text-[10px] text-slate-600 font-bold tracking-normal italic opacity-60">
                          • {calculateAge(details.data_nascimento)} anos
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-tighter ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-[8px] text-slate-700 font-bold uppercase">{app.data_aplicacao}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{details?.ocupation || "HOST"}</span>
                    <span className="text-[7px] text-slate-800 uppercase font-mono tracking-tighter mt-1">Status: Operational</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-800 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })
        )}

        {/* Paginação Operacional */}
        {!loading && total > 10 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/5 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= total}
              className="px-4 py-2 border border-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/5 transition-all"
            >
              Próximo
            </button>
          </div>
        )}
      </main>

      {/* DRAWER LATERAL: PAINEL DE CONTROLE DE HOST */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${selectedApp ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${selectedApp ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSelectedApp(null)}
        />

        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[#0A0A0A] border-l border-amber-900/30 shadow-2xl transition-transform duration-500 ease-out transform ${selectedApp ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedApp && (
            <div className="h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[120px] -mr-40 -mt-40" />

              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-900 border border-amber-900/50 p-1 relative">
                    {selectedApp.status !== 'applied' && selectedApp.candidate_details?.foto ? (
                      <Image src={selectedApp.candidate_details.foto} alt="Avatar" width={80} height={80} className="object-cover" />
                    ) : <User size={40} className="text-slate-700 m-auto mt-4" />}
                    <div className="absolute -bottom-2 -right-2 bg-[#0A0A0A] p-1 border border-white/10 text-amber-600">
                      <Info size={12} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">
                      {selectedApp.status !== 'applied' ? selectedApp.candidate_details.name : "Candidato Oculto"}
                    </h2>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[9px] text-amber-600 font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-amber-900/30">
                        {STATUS_CONFIG[selectedApp.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors border border-white/5 group">
                  <X size={20} className="text-slate-500 group-hover:text-amber-600 transition-colors" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 relative z-10">
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-8 bg-amber-600/40" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Perfil Profissional</h4>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm">
                    <p className="text-sm text-slate-400 leading-relaxed font-light italic tracking-wide">
                      "{selectedApp.candidate_details?.bio || "Nenhuma biografia registrada para esta unidade."}"
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                  <div className="p-6 bg-[#080808] group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <History size={12} className="text-amber-900/50" />
                      <span className="text-[8px] text-slate-600 uppercase tracking-widest block">Ocupação Atual</span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 uppercase">{selectedApp.candidate_details?.ocupation || "Não Informado"}</span>
                  </div>
                  <div className="p-6 bg-[#080808] group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={12} className="text-amber-900/50" />
                      <span className="text-[8px] text-slate-600 uppercase tracking-widest block">Localização</span>
                    </div>
                    <span className="text-xs font-bold text-slate-200 uppercase">
                      {selectedApp.status !== 'applied' ? selectedApp.candidate_details?.localizacao : "Cidade Protegida"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-white/5">
                  <h4 className="text-[9px] font-black text-center text-slate-600 uppercase tracking-[0.4em] mb-6">Protocolo de Recrutamento</h4>

                  <button
                    onClick={() => handleNextStep(selectedApp)}
                    // O botão desativa se: carregando global, atualizando local, ou status final
                    disabled={loading || isUpdating || selectedApp.status === 'hired' || selectedApp.status === 'rejected'}
                    className={`
    w-full py-4.5 font-black text-xs uppercase tracking-[0.3em] transition-all 
    flex items-center justify-center gap-3 active:scale-[0.98]
    ${isUpdating
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-amber-600 hover:bg-amber-500 text-black shadow-[0_10px_30px_rgba(217,119,6,0.15)]'
                      }
    disabled:opacity-40 disabled:pointer-events-none
  `}
                  >
                    {isUpdating ? (
                      <>
                        Sincronizando Protocolo <Loader2 size={14} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Avançar Etapa <Zap size={14} fill="black" />
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                      className="py-3.5 border border-rose-900/30 text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Ban size={12} /> Reprovar
                    </button>

                    <div className="relative group/manual">
                      {/* Botão de Override Principal */}
                      <button
                        disabled={isUpdating}
                        onClick={() => setIsChangingStatus(!isChangingStatus)}
                        className={`w-full py-3.5 border text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 ${isChangingStatus
                            ? "bg-amber-600 text-black border-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                            : "border-white/10 text-slate-500 hover:bg-white/5 hover:border-white/20"
                          } disabled:opacity-30 disabled:cursor-wait active:scale-95`}
                      >
                        {isUpdating ? (
                          <Loader2 size={12} className="animate-spin text-inherit" />
                        ) : (
                          <MoreHorizontal size={12} />
                        )}
                        {isUpdating ? "Sincronizando..." : isChangingStatus ? "Fechar_Protocolo" : "Override_Status"}
                      </button>

                      {/* Dropdown de Status (Menu Flutuante) */}
                      {isChangingStatus && (
                        <div className="absolute bottom-full mb-3 left-0 right-0 bg-[#0D0D0D] border border-white/10 p-4 z-50 max-h-[70vh] overflow-y-auto shadow-[0_-20px_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-2 custom-scrollbar rounded-xl">

                          {Object.entries(GROUPED_STATUS).map(([groupName, keys]) => (
                            <div key={groupName} className="mb-5 last:mb-0">

                              {/* Header do Grupo: Estética Terminal */}
                              <div className="flex items-center gap-2 mb-3 px-1">
                                <div className="w-1 h-1 bg-amber-600 animate-pulse" />
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                                  {groupName}
                                </span>
                                <div className="flex-1 h-[1px] bg-white/[0.03]" />
                              </div>

                              <div className="grid grid-cols-1 gap-1">
                                {keys.map((key) => {
                                  const val = STATUS_CONFIG[key];
                                  if (!val) return null;

                                  return (
                                    <button
                                      key={key}
                                      disabled={isUpdating}
                                      onClick={() => handleStatusChange(selectedApp.id, key)}
                                      className="group/item flex items-center justify-between text-[9px] text-left px-4 py-3 bg-white/[0.02] hover:bg-amber-600 hover:text-black uppercase tracking-widest text-slate-400 transition-all border border-white/[0.03] hover:border-amber-600 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed"
                                    >
                                      <span className="flex items-center gap-3">
                                        {/* Indicador de Status Dinâmico */}
                                        <div className={`w-1.5 h-1.5 rounded-full ${val.color.replace('text', 'bg')} opacity-30 group-hover/item:opacity-100 group-hover/item:bg-black transition-all`} />
                                        {val.label}
                                      </span>

                                      {/* Iconografia de Ação */}
                                      <div className="flex items-center gap-2">
                                        {isUpdating ? (
                                          <Loader2 size={10} className="animate-spin opacity-40" />
                                        ) : (
                                          <ChevronRight size={10} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* Identificador Westworld no Rodapé do Menu */}
                          <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center opacity-20">
                            <span className="text-[7px] font-mono uppercase tracking-widest">Host ID: {selectedApp.id.slice(0, 8)}</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-white rounded-full" />
                              <div className="w-1 h-1 bg-white rounded-full opacity-50" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 mt-4 border-t border-white/5 space-y-3">
                    {selectedApp.status !== 'applied' ? (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <button onClick={() => window.open(`https://wa.me/${selectedApp.candidate_details.whatsapp}`, '_blank')} className="w-full py-3.5 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                          <Phone size={14} /> Uplink Direto WhatsApp
                        </button>
                        <button onClick={() => window.location.href = `mailto:${selectedApp.candidate_details.email}`} className="w-full py-3.5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-slate-300 transition-all flex items-center justify-center gap-2 mt-2">
                          <Mail size={14} /> Transmissão via E-mail
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-[#080808] border border-dashed border-white/10 group">
                        <Lock size={20} className="mx-auto text-slate-800 mb-3 group-hover:text-amber-900 transition-colors" />
                        <p className="text-[8px] text-slate-700 uppercase font-black tracking-widest leading-none">Criptografia LGPD Ativa: Protocolo de Contato Bloqueado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER STATUS HUD */}
      <footer className="fixed bottom-0 left-0 right-0 py-2.5 px-6 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center z-30">
        <div className="flex items-center gap-4 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-amber-900/50">
            <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse rounded-full shadow-[0_0_5px_rgba(217,119,6,0.8)]" />
            SISTEMA OPERACIONAL ATIVO
          </span>
          <span className="hidden md:block opacity-30">| DELOS_SECURE_LAYER_V.4</span>
        </div>
        <div className="text-[8px] font-mono text-slate-600 italic opacity-40 hover:opacity-100 transition-opacity">
          "A maioria das pessoas vive num mundo que é um simulacro do real."
        </div>
      </footer>
    </div>
  );
}