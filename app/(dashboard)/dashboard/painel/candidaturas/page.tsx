"use client";

import STATUS_LABELS from "@/data/statusLabels";
import { useApplications } from "@/hooks/useApplications";
import {
    Search,
    Filter,
    X,
    User,
    MapPin,
    MessageSquare,
    Calendar,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
    const router = useRouter();
    const { applications, loading, statusFilter, searchFilter, refresh } = useApplications();

    // Função para remover um filtro específico da URL
    const removeFilter = (key: string) => {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        router.push(`/painel/candidaturas?${params.toString()}`);
    };

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">

            {/* CABEÇALHO E BUSCA */}
            <header className="space-y-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Gestão de Candidatos
                    </h1>
                    <p className="text-slate-500 text-sm">Analise e gerencie o progresso dos seus talentos.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou cargo..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
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
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
                    >
                        <Filter className="w-4 h-4" />
                        Filtros Avançados
                    </Link>
                </div>

                {/* BADGES DE FILTROS ATIVOS */}
                {(statusFilter || searchFilter) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {statusFilter && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                Status: {STATUS_LABELS[statusFilter] || statusFilter}
                                <button onClick={() => removeFilter('status')}><X className="w-3 h-3" /></button>
                            </span>
                        )}
                        {searchFilter && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
                                Busca: "{searchFilter}"
                                <button onClick={() => removeFilter('search')}><X className="w-3 h-3" /></button>
                            </span>
                        )}
                    </div>
                )}
            </header>

            {/* LISTAGEM */}
            <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-sm font-medium">Buscando candidatos...</p>
                    </div>
                ) : applications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {applications.map((app) => (
                            <div
                                key={app.id}
                                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-all group cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar / Foto */}
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                                        <User className="w-6 h-6 text-slate-300" />
                                    </div>

                                    {/* Info Candidato */}
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {/* O ?. garante que se candidate for nulo, o código não quebre */}
                                            {app.candidate_details?.name || "Candidato Privado"}
                                        </h3>

                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
                                            Vaga: {app.job_details?.cargo_nome || "Cargo não informado"}
                                        </p>
                                    </div>
                                </div>

                                {/* Status e Ação */}
                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <div className="text-right">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${app.status === 'hired' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-slate-50 text-slate-500 border-slate-200'
                                            }`}>
                                            {STATUS_LABELS[app.status] || app.status}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/painel/candidaturas/${app.id}`}
                                        className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-200" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg">Nenhum candidato encontrado</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                            Tente mudar os filtros ou a busca para encontrar o que procura.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}