import React, { useState } from 'react';
import Image from 'next/image';
import {
  Loader2, Zap, Ban, MoreHorizontal, ChevronRight,
  Phone, Mail, Lock, X, User, Info, History, MapPin, Briefcase
} from "lucide-react";
import { Application } from '@/interfaces/aplications';



interface StatusConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface CandidateDrawerProps {
  selectedApp: Application | null;
  setSelectedApp: (app: Application | null) => void;
  isUpdating: boolean;
  loading: boolean;
  handleNextStep: (app: any) => Promise<void> | void;
  handleStatusChange: (id: string, newStatus: string) => void;
  STATUS_CONFIG: StatusConfig;
  GROUPED_STATUS: Record<string, string[]>;
}

export const CandidateDrawer = ({
  selectedApp,
  setSelectedApp,
  isUpdating,
  loading,
  handleNextStep,
  handleStatusChange,
  STATUS_CONFIG,
  GROUPED_STATUS
}: CandidateDrawerProps) => {
  // Estado para controlar o Modal secundário de Override Status
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-500 flex items-center justify-center ${selectedApp ? 'visible' : 'invisible'}`}>
      
      {/* Backdrop principal com desfoque */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${selectedApp ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => {
          setSelectedApp(null);
          setIsChangingStatus(false);
        }}
      />

      {/* Painel Adaptável (Drawer Mobile / Modal Desktop) */}
      <div className={`
        absolute bg-[#0A0A0A] border-amber-900/30 shadow-2xl transition-all duration-500 ease-out transform flex flex-col overflow-hidden
        /* Estilos Mobile */
        right-0 bottom-0 top-0 w-full h-full border-l
        /* Estilos Desktop (md) */
        md:relative md:right-auto md:top-auto md:bottom-auto md:w-[750px] md:h-auto md:max-h-[85vh] md:rounded-2xl md:border
        ${selectedApp ? 'translate-x-0 opacity-100 md:scale-100' : 'translate-x-full opacity-0 md:scale-95'}
      `}>

        {selectedApp && (
          <>
            {/* Efeito de iluminação interna (Glow) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

            {/* Cabeçalho do Drawer/Modal */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 border border-amber-900/50 p-1 relative">
                  {selectedApp.status !== 'applied' && selectedApp.candidate_details?.foto ? (
                    <Image
                      src={selectedApp.candidate_details.foto}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <User size={30} className="text-slate-700 m-auto mt-3 md:mt-4" />
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-[#0A0A0A] p-1 border border-white/10 text-amber-600">
                    <Info size={12} />
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-widest leading-none">
                    {selectedApp.status !== 'applied' ? selectedApp.candidate_details.name : "Candidato Oculto"}
                  </h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[9px] text-amber-600 font-black tracking-[0.2em] uppercase px-2 py-0.5 border border-amber-900/30">
                      {STATUS_CONFIG[selectedApp.status]?.label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setIsChangingStatus(false);
                }}
                className="p-3 hover:bg-white/5 rounded-full transition-colors border border-white/5 group"
              >
                <X size={20} className="text-slate-500 group-hover:text-amber-600 transition-colors" />
              </button>
            </div>

            {/* Conteúdo Principal com Scroll Interno */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 md:space-y-12 relative z-10 custom-scrollbar">
              
              {/* Bio Section */}
              <section className="text-left">
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

              {/* Grid de Informações Rápidas */}
              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                <div className="p-6 bg-[#080808] group hover:bg-white/[0.02] transition-colors text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <History size={12} className="text-amber-900/50" />
                    <span className="text-[8px] text-slate-600 uppercase tracking-widest block">Ocupação Atual</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 uppercase leading-tight">
                    {selectedApp.candidate_details?.ocupation || "Não Informado"}
                  </span>
                </div>
                <div className="p-6 bg-[#080808] group hover:bg-white/[0.02] transition-colors text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={12} className="text-amber-900/50" />
                    <span className="text-[8px] text-slate-600 uppercase tracking-widest block">Localização</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 uppercase leading-tight">
                    {selectedApp.status !== 'applied' ? selectedApp.candidate_details?.localizacao : "Cidade Protegida"}
                  </span>
                </div>
              </div>

              {/* Seção de Experiências Profissionais */}
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-amber-600/40" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Histórico de Atuação</h4>
                </div>

                <div className="space-y-4 text-left">
                  {selectedApp.candidate_details.experiences && selectedApp.candidate_details.experiences.length > 0 ? (
                    selectedApp.candidate_details.experiences.map((exp: any) => (
                      <div key={exp.id} className="p-5 bg-white/[0.02] border border-white/5 relative group/exp hover:bg-white/[0.03] transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="mt-1 text-amber-900/40 group-hover/exp:text-amber-600 transition-colors">
                              <Briefcase size={14} />
                            </div>
                            <div>
                              <h5 className="text-[11px] font-black text-white uppercase tracking-wider">{exp.cargo}</h5>
                              <p className="text-[10px] text-amber-600/80 font-bold uppercase mt-0.5">{exp.empresa}</p>
                              {exp.descricao && (
                                <p className="text-[9px] text-slate-500 mt-2 leading-relaxed italic line-clamp-3">{exp.descricao}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter whitespace-nowrap">
                              {exp.data_entrada} — {exp.atualmente_trabalhando ? "PRESENTE" : exp.data_saida}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border border-dashed border-white/5 text-center">
                      <p className="text-[9px] text-slate-700 uppercase font-black tracking-widest leading-none">Nenhum registro identificado no Host</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Ações de Protocolo e Recrutamento */}
              <div className="space-y-4 pt-10 border-t border-white/5">
                <h4 className="text-[9px] font-black text-center text-slate-600 uppercase tracking-[0.4em] mb-6">Protocolo de Recrutamento</h4>

                {/* Botão Avançar Etapa Principal */}
                <button
                  onClick={() => handleNextStep(selectedApp)}
                  disabled={loading || isUpdating || selectedApp.status === 'hired' || selectedApp.status === 'rejected'}
                  className={`w-full py-4.5 font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${isUpdating
                      ? 'bg-gray-100 text-gray-400 cursor-wait'
                      : 'bg-amber-600 hover:bg-amber-500 text-black shadow-[0_10px_30px_rgba(217,119,6,0.15)]'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                >
                  {isUpdating ? (
                    <>Sincronizando Protocolo <Loader2 size={14} className="animate-spin" /></>
                  ) : (
                    <>Avançar Etapa <Zap size={14} fill="black" /></>
                  )}
                </button>

                {/* Grid de Ações Secundárias */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    className="py-3.5 border border-rose-900/30 text-rose-500 text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Ban size={12} /> Reprovar
                  </button>

                  <div className="relative">
                    {/* Botão para abrir Modal de Override */}
                    <button
                      disabled={isUpdating}
                      onClick={() => setIsChangingStatus(true)}
                      className={`w-full py-3.5 border text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 border-white/10 text-slate-500 hover:bg-white/5 hover:border-white/20 disabled:opacity-30 disabled:cursor-wait active:scale-95`}
                    >
                      {isUpdating ? (
                        <Loader2 size={12} className="animate-spin text-inherit" />
                      ) : (
                        <MoreHorizontal size={12} />
                      )}
                      {isUpdating ? "Sincronizando..." : "Etapa Manual"}
                    </button>

                    {/* MODAL DE OVERRIDE (APARECE POR CIMA DE TUDO) */}
                    {isChangingStatus && (
                      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div
                          className="absolute inset-0 bg-black/80 backdrop-blur-md"
                          onClick={() => setIsChangingStatus(false)}
                        />

                        <div className="relative w-full max-w-2xl bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">
                          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                            <div className="text-left">
                              <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Protocolo_Override</h3>
                              <p className="text-[8px] text-slate-500 uppercase mt-1">Selecione o novo status operacional para o Host</p>
                            </div>
                            <button
                              onClick={() => setIsChangingStatus(false)}
                              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
                            {Object.entries(GROUPED_STATUS).map(([groupName, keys]) => (
                              <div key={groupName} className="text-left">
                                <div className="flex items-center gap-2 mb-4 px-1">
                                  <div className="w-1 h-1 bg-amber-600 animate-pulse" />
                                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{groupName}</span>
                                  <div className="flex-1 h-[1px] bg-white/[0.05]" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {keys.map((key) => {
                                    const val = STATUS_CONFIG[key];
                                    if (!val) return null;
                                    return (
                                      <button
                                        key={key}
                                        disabled={isUpdating}
                                        onClick={() => {
                                          handleStatusChange(selectedApp.id, key);
                                          setIsChangingStatus(false);
                                        }}
                                        className="group/btn flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-amber-600/50 hover:bg-amber-600/5 transition-all rounded-xl disabled:opacity-20 text-left"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full ${val.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor] group-hover/btn:scale-110 transition-transform`} />
                                          <span className="text-[10px] font-bold text-slate-300 group-hover/btn:text-white uppercase tracking-widest">
                                            {val.label}
                                          </span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-700 group-hover/btn:text-amber-600 group-hover/btn:translate-x-1 transition-all" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
                            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">System_Auth: Recruiter_Authorized</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-amber-600 rounded-full opacity-40" />
                              <div className="w-1 h-1 bg-amber-600 rounded-full opacity-20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seção de Contato (WhatsApp e Email) */}
                <div className="pt-8 mt-4 border-t border-white/5 space-y-3">
                  {selectedApp.status !== 'applied' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      <button
                        onClick={() => window.open(`https://wa.me/${selectedApp.candidate_details.whatsapp}`, '_blank')}
                        className="w-full py-3.5 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Phone size={14} /> WhatsApp
                      </button>
                      <button
                        onClick={() => window.location.href = `mailto:${selectedApp.candidate_details.email}`}
                        className="w-full py-3.5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-slate-300 transition-all flex items-center justify-center gap-2"
                      >
                        <Mail size={14} /> E-mail
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-[#080808] border border-dashed border-white/10 group">
                      <Lock size={20} className="mx-auto text-slate-800 mb-3 group-hover:text-amber-900 transition-colors" />
                      <p className="text-[8px] text-slate-700 uppercase font-black tracking-widest leading-none">Criptografia LGPD Ativa: Protocolo Bloqueado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};