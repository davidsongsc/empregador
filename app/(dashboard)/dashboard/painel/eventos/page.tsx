"use client";

import { useEvents } from "@/hooks/useEvents";
import {
    Plus, Search, Calendar,
    ArrowRight, LayoutGrid, List as ListIcon,
    Filter, Loader2, Inbox
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EventsListPage() {
    // Pegamos os dados do hook que configuramos com paginação e busca
    const { events, count, loading, search, setSearch, page, setPage, totalPages } = useEvents();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // 1. ESTADO DE CARREGAMENTO
    if (loading && events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Consultando sua base de dados...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* CABEÇALHO DINÂMICO */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Seus Eventos</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        {count > 0 ? `Gerenciando ${count} registros ativos.` : "Pronto para começar sua organização?"}
                    </p>
                </div>

                <Link
                    href="/painel/eventos/novo"
                    className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Novo Evento
                </Link>
            </header>

            {/* 2. ESTADO VAZIO (EMPTY STATE) */}
            {events.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[48px] p-20 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center">
                        <Inbox className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                        <h2 className="text-xl font-black text-slate-900">Nenhum evento encontrado</h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {search
                                ? `Não encontramos resultados para "${search}". Tente outro termo.`
                                : "Você ainda não cadastrou nenhum evento. Comece criando um agora mesmo para gerenciar suas escalas."}
                        </p>
                    </div>

                    {!search ? (
                        <Link
                            href="/painel/eventos/novo"
                            className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                        >
                            Criar meu primeiro evento <ArrowRight className="w-4 h-4" />
                        </Link>
                    ) : (
                        <button
                            onClick={() => setSearch("")}
                            className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600"
                        >
                            Limpar busca
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* BARRA DE FERRAMENTAS (Só aparece se houver dados) */}
                    <section className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filtrar por nome ou empresa..."
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm shadow-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-3xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                            <Filter className="w-4 h-4" /> Filtros
                        </button>
                    </section>

                    {/* LISTAGEM ESTILO DJANGO ADMIN */}
                    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento / Empresa</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Geral</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Escalas</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {events.map((event) => (
                                    <tr key={event.uid} className="group hover:bg-indigo-50/30 transition-all">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-slate-200">
                                                    {event.name.slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{event.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">{event.owner_company_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-xs font-bold text-slate-600">{event.schedules?.length || 0} Datas</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Link
                                                href={`/dashboard/painel/eventos/${event.uid}`}
                                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Gerenciar <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINAÇÃO */}
                        {totalPages > 1 && (
                            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Página {page} de {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}