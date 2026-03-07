"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobApplications } from "@/hooks/useJobApplications";
import {
  User, Phone, Calendar, ChevronLeft, Loader2, MessageSquare,
  ChevronDown, ChevronUp, MapPin, ExternalLink, Lock, Mail,
  ShieldAlert, FileText, History, Search, Filter, Users, CheckCircle,
  Briefcase, ArrowRight, CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/Notification";

const FLOW_SEQUENCE = [
  'applied',
  'reviewing',
  'shortlisted',
  'interview_scheduled',
  'test_submitted',
  'offer_sent',
  'hired'
];

const STATUS_CONFIGS: Record<string, { label: string; color: string }> = {
  applied: { label: "Candidatado", color: "bg-blue-50 text-blue-600 border-blue-100" },
  withdrawn: { label: "Desistência", color: "bg-gray-100 text-gray-600 border-gray-200" },
  screening: { label: "Triagem", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  reviewing: { label: "Em Análise", color: "bg-orange-50 text-orange-600 border-orange-100" },
  shortlisted: { label: "Pré-selecionado", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  interview_scheduled: { label: "Entrevista Agendada", color: "bg-purple-50 text-purple-600 border-purple-100" },
  interviewing: { label: "Entrevistando", color: "bg-purple-100 text-purple-700 border-purple-200" },
  interview_completed: { label: "Entrevista Realizada", color: "bg-violet-50 text-violet-600 border-violet-100" },
  technical_test: { label: "Teste Enviado", color: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" },
  test_submitted: { label: "Teste Recebido", color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
  test_review: { label: "Avaliando Teste", color: "bg-pink-50 text-pink-600 border-pink-100" },
  offer_sent: { label: "Proposta Enviada", color: "bg-amber-50 text-amber-600 border-amber-100" },
  offer_negotiation: { label: "Negociação", color: "bg-amber-100 text-amber-700 border-amber-200" },
  offer_accepted: { label: "Proposta Aceita", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  offer_declined: { label: "Proposta Recusada", color: "bg-rose-50 text-rose-600 border-rose-100" },
  hired: { label: "Ocupando Vaga", color: "bg-emerald-500 text-white font-medium" },
  rejected: { label: "Não Selecionado", color: "bg-red-50 text-red-600 border-red-100" },
  on_hold: { label: "Pausado", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.applied;
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function CandidatosPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { candidates, loading, changeStatus } = useJobApplications(jobId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  const getNextStatusLabel = (currentStatus: string) => {
    const currentIndex = FLOW_SEQUENCE.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= FLOW_SEQUENCE.length - 1) return "Finalizar Processo";
    const nextStatusKey = FLOW_SEQUENCE[currentIndex + 1];
    return STATUS_CONFIGS[nextStatusKey]?.label || "Avançar";
  };

  const handleNextStep = (appId: string, currentStatus: string) => {
    const currentIndex = FLOW_SEQUENCE.indexOf(currentStatus);
    if (currentIndex !== -1 && currentIndex < FLOW_SEQUENCE.length - 1) {
      const nextStatus = FLOW_SEQUENCE[currentIndex + 1];
      changeStatus(appId, nextStatus);
    } else {
      toast.info("Este candidato já atingiu a etapa final.");
    }
  };

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(app => {
      const nameMatch = app.candidate_details?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "all" ? app.status !== "rejected" : app.status === filterStatus;
      return nameMatch && statusMatch;
    });
  }, [candidates, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: candidates.length,
    hired: candidates.filter(c => c.status === 'hired').length
  }), [candidates]);

  if (loading && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Carregando Talentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-20 font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Candidatos</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 tracking-tighter">Gerencie o funil de contratação da sua vaga</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100 flex items-center gap-3 text-blue-700">
              <Users className="w-4 h-4" />
              <div className="leading-none">
                <span className="block text-[10px] font-black text-blue-400 uppercase">Total</span>
                <span className="text-sm font-black">{stats.total}</span>
              </div>
            </div>
            <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 flex items-center gap-3 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              <div className="leading-none">
                <span className="block text-[10px] font-black text-emerald-400 uppercase">Vinculados</span>
                <span className="text-sm font-black">{stats.hired}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-3 border-t border-gray-50 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar candidato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="relative flex items-center gap-2 bg-gray-50 px-4 rounded-2xl border border-transparent">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none py-3.5 text-sm font-bold text-gray-700 outline-none cursor-pointer pr-8"
            >
              <option value="all">Todos os Status</option>
              {Object.entries(STATUS_CONFIGS).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {filteredCandidates.map((app) => {
          const details = app.candidate_details;
          const isUnlocked = app.status !== 'applied';
          const isAlreadyHired = app.status === 'hired';

          return (
            <div
              key={app.id}
              className={`bg-white border transition-all duration-500 overflow-hidden ${expandedId === app.id
                  ? "rounded-[2.5rem] border-indigo-200 shadow-2xl ring-4 ring-indigo-50/50 scale-[1.01]"
                  : "rounded-[2rem] border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                }`}
            >
              <div onClick={() => toggleExpand(app.id)} className="p-6 cursor-pointer flex flex-col md:flex-row justify-between gap-6 items-center">
                <div className="flex items-center gap-5 w-full md:w-auto flex-1">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 ${isUnlocked ? 'bg-indigo-50 border-white shadow-sm' : 'bg-gray-100 border-dashed border-gray-300'}`}>
                    {isUnlocked && details?.foto ? (
                      <Image src={details.foto} alt="Avatar" width={64} height={64} className="w-full h-full object-cover rounded-xl" />
                    ) : <User className="text-gray-400 w-8 h-8" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-gray-900 truncate capitalize">{details?.name}</h3>
                      {details?.data_nascimento && (
                        <span className={`text-lg font-bold text-gray-400 ${!isUnlocked ? "blur-[4px]" : ""}`}>
                          • {calculateAge(details.data_nascimento)} anos
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <StatusBadge status={app.status} />
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                        <Calendar className="w-3.5 h-3.5" /> {app.data_aplicacao}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!isUnlocked && (
                    <div className="bg-orange-50 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-orange-100 animate-pulse">
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px] font-black text-orange-700 uppercase">Analise para liberar</span>
                    </div>
                  )}
                  <div className={`p-2.5 rounded-full ${expandedId === app.id ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-300'}`}>
                    {expandedId === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {expandedId === app.id && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="h-px bg-gray-100 w-full mb-8" />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resumo do Perfil</h4>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {details?.bio || "Sem resumo profissional."}
                          </p>
                        </div>
                      </section>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><History className="w-4 h-4" /> Experiência</h4>
                          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-gray-900">{details?.ocupation || "Não informado"}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4" /> Localização</h4>
                          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <p className="text-sm font-bold text-gray-900">{details?.localizacao || "Não informada"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 relative">
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestão</h4>
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">{app.status}</span>
                        </div>
                        <div className="space-y-3">


                          {(app.status === 'offer_accepted' || app.status === 'offer_negotiation') && !isAlreadyHired && (
                            <button
                              onClick={() => changeStatus(app.id, 'hired')}
                              className="w-full py-5 rounded-2xl text-[11px] font-black bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 uppercase"
                            >
                              Finalizar & Contratar
                            </button>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            {!isAlreadyHired && app.status !== 'rejected' && (
                              <button
                                onClick={() => changeStatus(app.id, 'rejected')}
                                className="py-3 rounded-xl text-[10px] font-bold text-red-500 border-2 border-red-50 hover:bg-red-50 uppercase"
                              >
                                Reprovar
                              </button>
                            )}
                            <button
                              onClick={() => setIsStatusModalOpen(isStatusModalOpen === app.id ? null : app.id)}
                              className="py-3 rounded-xl text-[10px] font-bold text-gray-500 border-2 border-gray-100 hover:bg-gray-50 uppercase border-dated border-orange-500"
                            >
                              ETAPAS
                            </button>
                          </div>
                          {!isAlreadyHired && app.status !== 'rejected' && (
                            <button
                              onClick={() => handleNextStep(app.id, app.status)}
                              className="w-full py-6 rounded-2xl text-[12px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 flex flex-col items-center gap-1 group"
                            >
                              <span className="text-[9px] opacity-70">Avançar para:</span>
                              <div className="flex items-center gap-2">
                                {getNextStatusLabel(app.status)}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          )}
                          {isStatusModalOpen === app.id && (
                            <div className="absolute z-50 left-6 right-6 bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
                              {Object.entries(STATUS_CONFIGS).map(([key, cfg]) => (
                                <button
                                  key={key}
                                  onClick={() => {
                                    changeStatus(app.id, key);
                                    setIsStatusModalOpen(null);
                                  }}
                                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                  <span className="text-[11px] font-bold text-gray-700">{cfg.label}</span>
                                  <div className={`w-2 h-2 rounded-full ${cfg.color.split(' ')[0]}`} />
                                </button>
                              ))}
                            </div>
                          )}

                          {isAlreadyHired && (
                            <div className="w-full py-5 rounded-2xl bg-emerald-50 border-2 border-emerald-100 text-emerald-700 text-center flex flex-col items-center gap-1">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-[11px] font-black uppercase">Vinculado</span>
                            </div>
                          )}
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contato</h4>
                        {isUnlocked ? (
                          <div className="grid gap-3">
                            <button
                              onClick={() => window.open(`https://wa.me/${details.whatsapp}`, "_blank")}
                              className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-2xl shadow-lg hover:bg-emerald-700 transition-all w-full"
                            >
                              <div className="flex items-center gap-3 font-bold text-sm uppercase"><Phone className="w-4 h-4" /> WhatsApp</div>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => (window.location.href = `mailto:${details.email}`)}
                              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:border-indigo-600 transition-all font-bold text-sm w-full"
                            >
                              <Mail className="w-4 h-4 text-indigo-600" />
                              <span className="truncate">{details.email}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-6 bg-white border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                            <Lock className="w-6 h-6 text-gray-300 mx-auto" />
                            <p className="text-[9px] font-black text-gray-400 uppercase leading-tight px-4">Analise o candidato para liberar contatos</p>
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
            <Search className="w-10 h-10 text-gray-200 mb-6" />
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest">Nenhum resultado</h3>
          </div>
        )}
      </main>
    </div>
  );
}