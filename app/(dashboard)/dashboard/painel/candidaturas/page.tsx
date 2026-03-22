"use client";

import STATUS_LABELS from "@/data/statusLabels";
import { useApplicationStore } from "@/store/useApplicationStore";
import {
    Search,
    Filter,
    X,
    User,
    ChevronRight,
    Loader2,
    Terminal,
    Fingerprint,
    Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ApplicationsPage() {
    const router = useRouter();
    const { data: applications, loading, fetchApplications } = useApplicationStore();
    const searchParams = useSearchParams();

    const statusFilter = searchParams.get("status") || undefined;
    const searchFilter = searchParams.get("search") || undefined;
    const removeFilter = (key: string) => {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        router.push(`/painel/candidaturas?${params.toString()}`);
    };

    return (
        <div className="p-4 sm:p-8 max-w-8xl mx-auto space-y-8 animate-in fade-in duration-700 selection:bg-amber-600/30">

            {/* CABEÇALHO E BUSCA - ESTILO TERMINAL */}
            <header className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Terminal size={16} className="text-amber-600 opacity-50" />
                    <span className="text-[9px] font-black tracking-[0.4em] text-slate-600 uppercase">Sistema de mapeamento pessoal</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-light text-white tracking-tighter uppercase">
                            Mapeamento de <span className="font-black italic">Unidades</span>
                        </h1>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Análise de compatibilidade e fluxo de staff.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                            <input
                                type="text"
                                placeholder="IDENTIFICAR UNIT_ID OU CARGO..."
                                className="w-full pl-11 pr-4 py-3 bg-[#181818] border border-white/5 text-white placeholder:text-slate-800 outline-none focus:border-amber-600/40 transition-all uppercase font-bold text-[10px] tracking-widest"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const params = new URLSearchParams(window.location.search);
                                        params.set('search', e.currentTarget.value);
                                        router.push(`?${params.toString()}`);
                                    }
                                }}
                            />
                        </div>

                        <Link
                            href="/painel/dashboard"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black hover:bg-amber-600 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                        >
                            <Filter className="w-3 h-3" />
                            Filters.exe
                        </Link>
                    </div>
                </div>

                {/* BADGES DE FILTROS ATIVOS - ESTILO LOG */}
                {(statusFilter || searchFilter) && (
                    <div className="flex flex-wrap gap-2">
                        {statusFilter && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/10 text-amber-600 border border-amber-600/20 text-[9px] font-black uppercase tracking-tighter">
                                STATUS::{statusFilter.toUpperCase()}
                                <button onClick={() => removeFilter('status')} className="hover:text-white"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                        {searchFilter && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-slate-400 border border-white/10 text-[9px] font-black uppercase tracking-tighter">
                                QUERY::"{searchFilter.toUpperCase()}"
                                <button onClick={() => removeFilter('search')} className="hover:text-white"><X className="w-3 h-3" /></button>
                            </span>
                        )}
                    </div>
                )}
            </header>

            {/* LISTAGEM - ESTILO DOSSIÊ INDUSTRIAL */}
            <section className="bg-[#141414] border border-white/[0.03] shadow-2xl relative overflow-hidden">
                {/* Efeito Scanline sutil no container */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />

                {loading ? (
                    <div className="p-32 flex flex-col items-center justify-center gap-4 text-slate-700">
                        <Loader2 className="w-10 h-10 animate-spin text-amber-600/40" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing_Host_Data...</p>
                    </div>
                ) : applications.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-[#1A1A1A] transition-all group relative cursor-pointer"
                                onClick={() => router.push(`/dashboard/painel/vagas/${app.id}/candidatos/`)}
                            >
                                {/* Barra de Atividade Lateral */}
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-600 transition-all shadow-[0_0_10px_#d97706]" />

                                <div className="flex items-center gap-6 relative z-10">
                                    {/* Avatar Biométrico */}
                                    <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-amber-600/40 transition-colors">
                                        <User className="w-6 h-6 text-slate-800 group-hover:text-amber-600 transition-colors" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-full w-full animate-scan opacity-0 group-hover:opacity-100" />
                                    </div>

                                    {/* Info Candidato */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-light text-slate-200 uppercase tracking-tight group-hover:text-white transition-colors italic">
                                                {app.candidate_details?.name || "Anonymous_Unit"}
                                            </h3>
                                            <Fingerprint size={12} className="text-slate-800 group-hover:text-amber-600/50" />
                                        </div>

                                        <p className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-[0.1em]">
                                            Candidato_Vaga: <span className="text-slate-400">{app.job_details?.cargo_nome || "UNDEFINED"}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Status e Ação */}
                                <div className="flex items-center justify-between sm:justify-end gap-8 relative z-10">
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                                app.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                    'bg-white/5 text-slate-500 border-white/10'
                                            }`}>
                                            {STATUS_LABELS[app.status] || app.status}
                                        </span>
                                        <span className="text-[7px] font-mono text-slate-800 uppercase italic">Verification_Status</span>
                                    </div>

                                    <div className="p-3 bg-black border border-white/5 text-slate-700 group-hover:text-amber-600 group-hover:border-amber-600/30 transition-all">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-32 text-center space-y-6">
                        <div className="w-20 h-20 bg-black border border-white/5 rounded-full flex items-center justify-center mx-auto relative group">
                            <Activity className="w-8 h-8 text-slate-900 group-hover:text-amber-600/20 transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-white font-black text-sm uppercase tracking-[0.3em]">No_Units_Found</h3>
                            <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest max-w-xs mx-auto italic">
                                A busca não retornou identificadores válidos no banco de dados central.
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* FOOTER HUD */}
            <footer className="flex justify-between items-center text-[8px] font-mono text-slate-800 uppercase tracking-widest pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <span>Active_Database_Link: OK</span>
                    <span>Encrypted: AES-256</span>
                </div>
                <div className="italic">"Analysis: High fidelity units require manual verification."</div>
            </footer>
        </div>
    );
}