"use client";

import { useEventStore } from "@/store/useEventStore";
import { Event } from "@/interfaces/events";
import {
    Plus, Search, Calendar,
    ArrowRight, Filter, Loader2, Inbox,
    Activity, Terminal, Database, Shield
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EventsListPage() {
    const { events, count, loading, search, setSearch, page, setPage, totalPages } = useEventStore();

    if (loading && events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 font-mono">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-delos-amber" />
                    <div className="absolute inset-0 blur-lg bg-delos-amber/20 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-delos-black font-black uppercase text-[10px] tracking-[0.4em]">Query_Status: Fetching_Data</p>
                    <div className="w-48 h-1 bg-delos-grey/10 overflow-hidden">
                        <div className="h-full bg-delos-amber animate-progress-indetermined" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-8xl mx-auto space-y-10 animate-in fade-in duration-700 font-mono text-delos-black">
            
            {/* BACKGROUND DECO */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
                backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* HEADER TÉCNICO */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-delos-black/10 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Database size={14} className="text-delos-amber" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Sistema / Recrutamento</span>
                    </div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                        Eventos_<span className="text-delos-amber text-6xl">Registrados</span>
                    </h1>
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-delos-black text-delos-surface text-[9px] font-black uppercase tracking-widest">
                            <Activity size={10} className="animate-pulse" /> {count} Registros
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard/painel/eventos/novo"
                    className="group relative flex items-center justify-center gap-4 bg-delos-black text-delos-surface px-10 py-5 font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-delos-amber active:scale-95 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Novo Evento
                </Link>
            </header>

            {/* BUSCA & FILTROS (ESTILO TERMINAL) */}
            {events.length > 0 && (
                <section className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-delos-amber" />
                            <span className="text-[9px] font-black text-delos-grey uppercase opacity-50">Filter_ID:</span>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="SEARCH_NAME_OR_ENTITY..."
                            className="w-full pl-28 pr-6 py-5 bg-delos-surface border border-delos-grey/20 outline-none focus:border-delos-amber transition-all font-bold text-sm tracking-widest placeholder:opacity-20 uppercase"
                        />
                    </div>
                    <button className="flex items-center gap-3 px-8 py-5 bg-delos-surface border border-delos-grey/20 text-delos-black font-black text-[10px] uppercase tracking-widest hover:bg-delos-black hover:text-white transition-all shadow-sm">
                        <Filter className="w-4 h-4" /> Advanced_Params
                    </button>
                </section>
            )}

            {/* LISTAGEM PRINCIPAL */}
            {events.length === 0 ? (
                <div className="bg-delos-surface border border-delos-grey/10 p-24 text-center flex flex-col items-center gap-8 animate-in zoom-in-95">
                    <div className="relative">
                        <Inbox className="w-16 h-16 text-delos-grey/20" />
                        <Shield className="absolute -top-2 -right-2 w-6 h-6 text-delos-amber animate-pulse" />
                    </div>
                    <div className="space-y-4 max-w-sm">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Null_Registry_Detected</h2>
                        <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                            {search
                                ? `Nenhum sinal correspondente ao parâmetro "${search}".`
                                : "Nenhum protocolo de evento localizado na rede local Delos_White."}
                        </p>
                    </div>
                    <button 
                        onClick={() => setSearch("")}
                        className="text-delos-amber font-black uppercase text-[11px] tracking-[0.3em] border-b border-delos-amber hover:pb-2 transition-all"
                    >
                        {search ? "Reset_Filter" : "Initiate_Registry"}
                    </button>
                </div>
            ) : (
                <div className="bg-delos-surface border border-delos-black/10 shadow-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-delos-black text-white/50 border-b border-delos-black">
                                <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Host_Identity / Entity</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Protocol_Status</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Schedules</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em] text-right">Access_Gate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-delos-grey/10">
                            {events.map((event : Event) => (
                                <tr key={event.uid} className="group hover:bg-delos-amber/[0.03] transition-colors relative">
                                    <td className="p-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-delos-black text-white flex flex-col items-center justify-center font-black text-[10px] shadow-xl group-hover:bg-delos-amber transition-colors">
                                                <span className="opacity-40 tracking-tighter">ID</span>
                                                {event.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg uppercase tracking-tighter group-hover:text-delos-amber transition-colors italic">{event.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-1.5 h-1.5 bg-delos-amber rounded-full" />
                                                    <p className="text-[10px] text-delos-grey font-bold uppercase tracking-widest">{event.owner_company_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                                                Active_Sync
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black tabular-nums tracking-widest">
                                                {event.schedules?.length || 0} UNITS
                                            </span>
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(event.schedules?.length || 0, 5) }).map((_, i) => (
                                                    <div key={i} className="w-3 h-1 bg-delos-amber/30" />
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-4">
                                            {event.schedules?.map((schedule, idx) => (
                                                <Link
                                                    key={schedule.uid}
                                                    href={`/dashboard/painel/escalas/${schedule.uid}`}
                                                    className="px-4 py-2 border border-delos-black/10 text-delos-black font-black text-[9px] uppercase tracking-widest hover:bg-delos-black hover:text-white transition-all group/link"
                                                >
                                                    {schedule.start_time_display} <ArrowRight className="inline ml-1 w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            ))}
                                            {(!event.schedules || event.schedules.length === 0) && (
                                                <span className="text-[9px] font-black text-delos-grey/30 uppercase tracking-[0.3em]">No_Link_Available</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINAÇÃO TÉCNICA */}
                    {totalPages > 1 && (
                        <div className="p-8 bg-delos-black/[0.02] border-t border-delos-black flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] font-black text-delos-grey uppercase tracking-[0.4em]">
                                    Sequence: <span className="text-delos-black">{page.toString().padStart(2, '0')}</span> // {totalPages.toString().padStart(2, '0')}
                                </div>
                            </div>
                            <div className="flex gap-px bg-delos-black/10 border border-delos-black/10">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className="px-8 py-3 bg-delos-surface text-[10px] font-black uppercase tracking-widest hover:bg-delos-black hover:text-white disabled:opacity-20 transition-all"
                                >
                                    Prev_Node
                                </button>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-8 py-3 bg-delos-surface text-[10px] font-black uppercase tracking-widest hover:bg-delos-black hover:text-white disabled:opacity-20 transition-all"
                                >
                                    Next_Node
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}