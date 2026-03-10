import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Loader2, User, ChevronRight, History, MapPin,
    Zap, Ban, MoreHorizontal, Phone, Mail, Lock,
    ArrowRight, Briefcase,
    X
} from "lucide-react";
import { CandidateDrawer } from '@/components/Candidate/Drawer';

import { Application } from '@/interfaces/aplications';
import { checkModuleAccess } from '@/utils/hasRecruitmentPermission';
import { useAuthStore } from '@/store/useAuthStore';

// --- Interfaces ---
interface Experience {
    id: number;
    empresa: string;
    cargo: string;
    data_entrada: string;
    data_saida: string | null;
    atualmente_trabalhando: boolean;
    descricao: string;
    localizacao: string;
}

interface StatusConfigItem {
    label: string;
    color: string;
    glow?: string;
}

interface CandidateListProps {
    loading: boolean;
    isUpdating: boolean; // Estado de salvamento/API
    candidatos: Application[];
    filteredCandidatos: Application[];
    selectedApp: Application | null; // Para saber qual está aberto
    setSelectedApp: (app: Application | null) => void;
    STATUS_CONFIG: Record<string, StatusConfigItem>;
    GROUPED_STATUS: Record<string, string[]>; // Para o menu de override
    total: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    calculateAge: (data: any) => number | null;
    handleNextStep: (app: Application) => Promise<void> | void;
    handleStatusChange: (id: string, newStatus: string) => void;
}

export const CandidateList = ({
    loading,
    isUpdating,
    candidatos,
    filteredCandidatos,
    selectedApp,
    setSelectedApp,
    STATUS_CONFIG,
    GROUPED_STATUS,
    total,
    page,
    setPage,
    calculateAge,
    handleNextStep,
    handleStatusChange
}: CandidateListProps) => {
    // Estado interno para o menu de override dentro da linha expandida
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const { user } = useAuthStore();
    // Estado para detecção de Mobile
    const [isMobile, setIsMobile] = useState(false);
    const canAccessSupervision = checkModuleAccess(user?.profile?.empresas, 'SUPERVISION');

    // Efeito para monitorar largura da janela e definir comportamento Mobile/Desktop
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Define 768px como breakpoint para mobile
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <main className="max-w-8xl mx-auto p-6 space-y-3">
            {loading && candidatos.length === 0 ? (
                <div className="py-40 text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">
                        Scanning Bio-Network...
                    </p>
                </div>
            ) : (
                filteredCandidatos.map((app) => {
                    const isExpanded = selectedApp?.id === app.id;
                    const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                    const isUnlocked = app.status !== 'applied';
                    const details = app.candidate_details;

                    return (
                        <div
                            key={app.id}
                            className={`group flex flex-col bg-[#0D0D0D] border transition-all duration-500 overflow-hidden ${isExpanded && !isMobile ? 'border-amber-900/40 my-4 shadow-2xl' : 'border-white/5 my-0 hover:border-white/10'
                                }`}
                        >
                            {/* LINHA PRINCIPAL (HEADER) */}
                            <div
                                onClick={() => {
                                    setSelectedApp(isExpanded ? null : app);
                                    setIsChangingStatus(false);
                                }}
                                className="flex items-center justify-between p-5 cursor-pointer relative z-10"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${config.glow || 'bg-transparent'}`} />

                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-900 border border-white/10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                                        {isUnlocked && details?.foto ? (
                                            <Image src={details.foto} alt="Avatar" width={56} height={56} className="object-cover h-full w-full" />
                                        ) : (
                                            <User className="text-slate-800" size={24} />
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-black text-white tracking-widest uppercase flex items-center gap-2 flex-col md:flex-row">
                                            {isUnlocked ? details.name : `Ficha-${app.id.substring(14, 23).toUpperCase()}`}
                                            {isUnlocked && details?.data_nascimento && (
                                                <span className="text-[10px] text-slate-600 font-bold opacity-60 italic">
                                                    • {calculateAge(details.data_nascimento)} anos
                                                </span>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">

                                                {/* ADICIONAR ESTE TRECHO AQUI */}
                                                {details?.experiences && details.experiences.length > 0 && (
                                                    <span className="text-[10px] text-amber-600/60 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ml-1">
                                                        <div className="w-1 h-1 bg-amber-600/40 rounded-full" />
                                                        <Briefcase size={10} className="opacity-50" />
                                                        {details.experiences.length} {details.experiences.length === 1 ? 'EXPERIÊNCIA' : 'EXPERIÊNCIAS'}
                                                    </span>
                                                )}
                                            </div>
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            {isUnlocked && (
                                                <span className={`px-2 py-0.5 border text-[12px] font-black uppercase tracking-tighter ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            )}

                                            <span className="text-[8px] text-slate-700 font-bold uppercase">{app.data_aplicacao}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            {details?.ocupation || "HOST"}
                                        </span>
                                    </div>
                                    {isMobile ? (
                                        <ArrowRight size={18} className="text-slate-800 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                    ) : (
                                        <ChevronRight
                                            size={18}
                                            className={`transition-transform duration-500 ${isExpanded ? 'rotate-90 text-amber-600' : 'text-slate-800'}`}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* CONTEÚDO EXPANSÍVEL (DETALHES INLINE) - OCULTO NO MOBILE PARA USAR DRAWER */}
                            {!isMobile && (
                                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 pointer-events-none'
                                    }`}>
                                    <div className="p-8 md:p-12 bg-[#080808]/50 grid grid-cols-1 lg:grid-cols-12 gap-12">

                                        {/* Coluna Esquerda: Bio, Info e Experiências */}
                                        <div className="lg:col-span-7 space-y-10">
                                            {/* Biografia */}
                                            <section>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="h-px w-8 bg-amber-600/40" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Perfil Profissional</h4>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed font-light italic tracking-wide">
                                                    "{details?.bio || "Nenhuma biografia registrada para esta unidade."}"
                                                </p>
                                            </section>

                                            {/* Grid de Info Rápida */}
                                            <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                                                <div className="p-6 bg-[#080808] group transition-colors">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <History size={12} className="text-amber-900/50" />
                                                        <span className="text-[8px] text-slate-600 uppercase tracking-widest">Ocupação Atual</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-200 uppercase">{details?.ocupation || "Não Informado"}</span>
                                                </div>
                                                <div className="p-6 bg-[#080808] group transition-colors">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MapPin size={12} className="text-amber-900/50" />
                                                        <span className="text-[8px] text-slate-600 uppercase tracking-widest">Localização</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-200 uppercase">
                                                        {isUnlocked ? details?.localizacao : "Cidade Protegida"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* SEÇÃO DE EXPERIÊNCIAS (NOVA) */}
                                            <section className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="h-px w-8 bg-amber-600/40" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Histórico de Atuação (Top 3)</h4>
                                                </div>

                                                <div className="space-y-4">
                                                    {details?.experiences && details.experiences.length > 0 ? (
                                                        details.experiences.map((exp: Experience) => (
                                                            <div key={exp.id} className="p-5 bg-white/[0.02] border border-white/5 relative group/exp hover:bg-white/[0.03] transition-colors">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex gap-4">
                                                                        <div className="mt-1">
                                                                            <Briefcase size={14} className="text-amber-900/40 group-hover/exp:text-amber-600 transition-colors" />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-[11px] font-black text-white uppercase tracking-wider">{exp.cargo}</h5>
                                                                            <p className="text-[10px] text-amber-600/80 font-bold uppercase mt-0.5">{exp.empresa}</p>
                                                                            <p className="text-[9px] text-slate-500 mt-2 leading-relaxed italic">{exp.descricao}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">
                                                                            {exp.data_entrada} — {exp.atualmente_trabalhando ? "PRESENTE" : exp.data_saida}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-8 border border-dashed border-white/5 text-center">
                                                            <p className="text-[9px] text-slate-700 uppercase font-black tracking-widest leading-none">Nenhum registro de experiência identificado no Host</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>
                                        </div>

                                        {/* Coluna Direita: Ações */}
                                        <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-white/5 lg:pl-12">
                                            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Controle de Protocolo</h4>

                                            {/* Botão de Ação Principal */}

                                            <button
                                                onClick={() => setIsChangingStatus(true)}
                                                disabled={!canAccessSupervision || loading || isUpdating }

                                                className={`w-full py-4.5 ${isUnlocked ? 'bg-amber-600' : 'bg-delos-indigo text-amber-500/50 border border-amber-500/20'} hover:bg-amber-500 text-black font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all disabled:opacity-40`}

                                            >
                                                <MoreHorizontal size={12} /> Editar Progresso
                                            </button>
                                            {/* Grid de Ações Secundárias */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 'rejected')}
                                                    className={`py-3.5 border border-rose-900/30 ${!canAccessSupervision || app.status === 'hired' || app.status === 'rejected' ? 'bg-slate-800 text-slate-600' : 'text-rose-400 hover:bg-rose-500 hover:text-white'} text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2`}
                                                    disabled={!canAccessSupervision || loading || isUpdating || app.status === 'hired' || app.status === 'rejected'}
                                                >
                                                    <Ban size={12} /> Reprovar
                                                </button>

                                                {/* Gatilho do Novo Modal de Override */}
                                                <button
                                                    onClick={() => handleNextStep(app)}
                                                    disabled={loading || isUpdating || app.status === 'hired'}
                                                    className={`py-3.5 border bg-slate-200 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all ${isChangingStatus ? 'bg-amber-600 text-black' : 'border-white/10 text-slate-500 hover:bg-black'}`}
                                                >
                                                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} fill={isUnlocked ? "black" : "none"} />}
                                                    {isUpdating ? "Sincronizando..." : !isUnlocked ? "Puxar Ficha" : "Avançar Etapa"}
                                                </button>
                                            </div>

                                            {/* --- NOVO MODAL DE OVERRIDE --- */}
                                            {isChangingStatus && (
                                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                                                    {/* Backdrop de alto contraste */}
                                                    <div
                                                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                                                        onClick={() => setIsChangingStatus(false)}
                                                    />

                                                    <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
                                                        {/* Header do Modal */}
                                                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                                            <div>
                                                                <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.5em]">System_Override</h3>
                                                                <p className="text-[9px] text-slate-500 uppercase mt-1 tracking-widest">Reescrita manual de status do Host</p>
                                                            </div>
                                                            <button onClick={() => setIsChangingStatus(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                                                                <X size={20} />
                                                            </button>
                                                        </div>

                                                        {/* Área de Botões Dinâmicos */}
                                                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                                                            {Object.entries(GROUPED_STATUS).map(([groupName, keys]) => (
                                                                <div key={groupName} className="space-y-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] whitespace-nowrap">{groupName}</span>
                                                                        <div className="h-px w-full bg-white/5" />
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {keys.map((k) => {
                                                                            const status = STATUS_CONFIG[k];
                                                                            if (!status) return null;

                                                                            return (
                                                                                <button
                                                                                    key={k}
                                                                                    onClick={() => {
                                                                                        handleStatusChange(app.id, k);
                                                                                        setIsChangingStatus(false);
                                                                                    }}
                                                                                    className="group/item flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-amber-600/50 hover:bg-amber-600/5 transition-all text-left rounded-xl"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text', 'bg')} shadow-[0_0_8px_currentColor] group-hover/item:scale-125 transition-transform`} />
                                                                                        <span className="text-[10px] font-bold text-slate-400 group-hover/item:text-white uppercase tracking-widest">
                                                                                            {status.label}
                                                                                        </span>
                                                                                    </div>
                                                                                    <ChevronRight size={14} className="text-slate-800 group-hover/item:text-amber-600 group-hover/item:translate-x-1 transition-all" />
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Rodapé informativo */}
                                                        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
                                                            <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.4em]">Auth_Level: Administrator_Access_Only</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contatos */}
                                            <div className="pt-6 border-t border-white/5 space-y-3">
                                                {isUnlocked ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => window.open(`https://wa.me/${details?.whatsapp}`)} className="flex-1 py-3 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 text-[9px] font-black uppercase flex items-center justify-center gap-2">
                                                            <Phone size={12} /> WhatsApp
                                                        </button>
                                                        <button onClick={() => window.location.href = `mailto:${details?.email}`} className="flex-1 py-3 border border-white/10 text-slate-500 text-[9px] font-black uppercase flex items-center justify-center gap-2">
                                                            <Mail size={12} /> Email
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-4 bg-[#080808] border border-dashed border-white/10">
                                                        <Lock size={16} className="mx-auto text-slate-800 mb-2" />
                                                        <p className="text-[8px] text-slate-700 uppercase font-black">Dados Criptografados</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {/* DRAWER (APENAS MOBILE) */}
            {isMobile && (
                <CandidateDrawer
                    selectedApp={selectedApp}
                    setSelectedApp={setSelectedApp}
                    isUpdating={isUpdating}
                    loading={loading}
                    handleNextStep={handleNextStep}
                    handleStatusChange={handleStatusChange}
                    STATUS_CONFIG={STATUS_CONFIG}
                    GROUPED_STATUS={GROUPED_STATUS}
                />
            )}

            {/* Paginação */}
            {!loading && total > 10 && (
                <div className="flex justify-center gap-2 mt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/5 transition-all text-slate-400"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * 10 >= total}
                        className="px-4 py-2 border border-white/5 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-white/5 transition-all text-slate-400"
                    >
                        Próximo
                    </button>
                </div>
            )}
        </main>
    );
};