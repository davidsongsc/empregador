"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJobApplications } from "@/hooks/useJobApplications";
import {
  User, Phone, Calendar, ChevronLeft, Loader2, MessageSquare,
  ChevronDown, ChevronUp, MapPin, ExternalLink, Lock, Mail,
  Fingerprint, Activity, ShieldAlert, FileText, Award, History,
  Search, Filter, Users, CheckCircle,
  Briefcase
} from "lucide-react";
import Image from "next/image";

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
    applied: { label: "Nova", color: "bg-blue-50 text-blue-600" },
    reviewing: { label: "Análise", color: "bg-orange-50 text-orange-600" },
    interview: { label: "Entrevista", color: "bg-purple-50 text-purple-600" },
    hired: { label: "Contratado", color: "bg-emerald-50 text-emerald-600" },
    rejected: { label: "Recusado", color: "bg-red-50 text-red-600" },
  };
  const config = configs[status] || configs.applied;
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}>
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

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(app => {
      const nameMatch = app.candidate_details?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "all" || app.status === filterStatus;
      return nameMatch && statusMatch;
    });
  }, [candidates, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: candidates.length,
      new: candidates.filter(c => c.status === 'applied').length,
      hired: candidates.filter(c => c.status === 'hired').length
    };
  }, [candidates]);

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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <div className="bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100 flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-600" />
                <div className="leading-none">
                  <span className="block text-[10px] font-black text-blue-400 uppercase">Total</span>
                  <span className="text-sm font-black text-blue-700">{stats.total}</span>
                </div>
              </div>
              <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <div className="leading-none">
                  <span className="block text-[10px] font-black text-emerald-400 uppercase">Contratados</span>
                  <span className="text-sm font-black text-emerald-700">{stats.hired}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-3 border-t border-gray-50 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar por nome do candidato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="relative flex items-center gap-2 bg-gray-50 px-4 rounded-2xl border border-transparent focus-within:border-indigo-100 transition-all">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none py-3.5 text-sm font-bold text-gray-700 outline-none cursor-pointer pr-8"
            >
              <option value="all">Todos os Status</option>
              <option value="applied">Novas Candidaturas</option>
              <option value="reviewing">Em Análise</option>
              <option value="interview">Entrevistas</option>
              <option value="hired">Contratados</option>
              <option value="rejected">Recusados</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {filteredCandidates.map((app) => {
          const details = app.candidate_details;
          const isUnlocked = !details.is_locked;
          const isInterviewed = app.status === 'interview';
          const isAlreadyHired = app.status === 'hired';

          const steps = [
            { id: 'reviewing', label: 'Em Análise', activeColor: 'bg-orange-100 text-black border-orange-200' },
            { id: 'interview', label: 'Entrevista Marcada', activeColor: 'bg-purple-100 text-black border-purple-200' },
            { id: 'rejected', label: 'Não Selecionado', activeColor: 'bg-red-100 text-black border-red-200' },
          ];

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
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${isUnlocked ? 'bg-indigo-50 border-white shadow-sm' : 'bg-gray-100 border-dashed border-gray-300'}`}>
                    {isUnlocked && details?.foto ? (
                      <Image src={details.foto} alt="Avatar" width={64} height={64} className="w-full h-full object-cover rounded-xl" />
                    ) : <User className="text-gray-400 w-8 h-8" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black leading-tight text-gray-900 truncate capitalize">
                        {details?.name}
                      </h3>

                      {/* Exibição da Idade com Blur Condicional */}
                      {details?.data_nascimento && (
                        <span className={`text-lg font-bold text-gray-400 transition-all duration-500 ${details.is_locked ? "blur-[4px] select-none" : ""
                          }`}>
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

                <div className="flex items-center gap-4 shrink-0">
                  {!isUnlocked && (
                    <div className="bg-orange-50 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-orange-100 animate-pulse self-center">
                      <ShieldAlert className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px] font-black text-orange-700 uppercase tracking-tight">Desbloqueie para ver dados</span>
                    </div>
                  )}

                  <div className={`p-2.5 rounded-full transition-all self-center ${expandedId === app.id ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-300'}`}>
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
                            {details?.bio || "O candidato não preencheu o resumo profissional."}
                          </p>
                        </div>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4" /> Experiência
                          </h4>

                          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Última Ocupação</p>
                            <p className="text-sm font-bold text-gray-900">{details?.ocupation || "Não informado"}</p>
                          </div>


                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Localização
                          </h4>
                          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Cidade / Estado</p>
                            <p className="text-sm font-bold text-gray-900">{details?.localizacao || "Não informada"}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Trajetória Profissional
                          </h4>
                          {details.experiences?.map((exp: any) => (
                            <div key={exp.id} className="p-4 bg-white border border-gray-100 rounded-2xl">
                              <p className="font-black text-gray-900">{exp.cargo}</p>
                              <p className="text-xs text-indigo-600 font-bold">{exp.empresa}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {exp.data_entrada} - {exp.atualmente_trabalhando ? 'Atual' : exp.data_saida}
                              </p>
                              <p className="text-xs text-gray-600 mt-2">{exp.descricao}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {app.cover_letter && (
                        <section className="space-y-4 pt-4">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Mensagem do Candidato
                          </h4>
                          <div className="p-6 bg-indigo-50/40 rounded-[2rem] border border-indigo-100/30 italic text-sm text-indigo-900 leading-relaxed font-medium">
                            "{app.cover_letter}"
                          </div>
                        </section>
                      )}
                    </div>

                    <div className="space-y-8 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações de Contato</h4>
                        {isUnlocked ? (
                          <div className="grid gap-3">
                            <a href={`https://wa.me/${details.whatsapp}`} target="_blank" className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                              <div className="flex items-center gap-3 font-bold text-sm uppercase tracking-tighter">
                                <Phone className="w-4 h-4" /> Enviar WhatsApp
                              </div>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a href={`mailto:${details.email}`} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:border-indigo-600 transition-all group font-bold text-sm">
                              <Mail className="w-4 h-4 text-indigo-600" />
                              <span className="truncate">{details.email}</span>
                            </a>
                          </div>
                        ) : (
                          <div className="p-6 bg-white border border-dashed border-gray-200 rounded-2xl text-center space-y-3">
                            <Lock className="w-6 h-6 text-gray-300 mx-auto" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-tight px-4">
                              Dados de contato bloqueados até a análise
                            </p>
                          </div>
                        )}
                      </section>

                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações do Funil</h4>
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => changeStatus(app.id, 'reviewing')}
                            disabled={isAlreadyHired}
                            className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${app.status === 'reviewing'
                              ? 'bg-orange-100 text-black border-orange-200 shadow-inner'
                              : app.status === 'applied'
                                ? 'bg-indigo-600 text-white border-transparent shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 animate-pulse'
                                : 'bg-gray-100 text-gray-400 border-gray-100 opacity-50'
                              }`}
                          >
                            {app.status === 'reviewing' ? '● Em Análise' : 'Desbloquear & Analisar'}
                          </button>

                          {steps.filter(s => s.id !== 'reviewing').map((step) => {
                            const isActive = app.status === step.id;
                            const isLocked = !isUnlocked && step.id !== 'reviewing';

                            return (
                              <button
                                key={step.id}
                                onClick={() => changeStatus(app.id, step.id)}
                                disabled={isLocked || isAlreadyHired || isActive}
                                className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${isActive
                                  ? `${step.activeColor} shadow-inner`
                                  : isLocked
                                    ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-white border-gray-200 hover:border-gray-900 text-gray-600 active:scale-95'
                                  }`}
                              >
                                {isActive ? `● ${step.label}` : step.label}
                              </button>
                            );
                          })}

                          <div className="pt-4 border-t border-gray-200">
                            <button
                              onClick={() => changeStatus(app.id, 'hired')}
                              disabled={!isInterviewed || isAlreadyHired}
                              className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${isAlreadyHired
                                ? 'bg-emerald-100 text-black border-emerald-200 shadow-inner'
                                : isInterviewed
                                  ? 'bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95'
                                  : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
                                }`}
                            >
                              {!isInterviewed && !isAlreadyHired && <Lock className="w-4 h-4 opacity-50" />}
                              {isAlreadyHired ? '🏆 Candidato Contratado' : 'Efetivar Contratação'}
                            </button>
                          </div>
                        </div>
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
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest">Nenhum resultado</h3>
            <p className="text-gray-400 text-sm mt-2 font-medium">Tente ajustar seus filtros ou termos de pesquisa.</p>
          </div>
        )}
      </main>
    </div>
  );
}