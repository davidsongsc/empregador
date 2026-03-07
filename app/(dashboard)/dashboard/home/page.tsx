"use client";

import { useState } from "react";
import { FileText, Clock, ChevronRight, Plus, LayoutDashboard, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import PostJobModal from "@/components/Modal/PostJobModal";
import { useDashboard } from "@/hooks/useDashboard";
import { STATUS_CONFIG } from "@/data/statusLabels";



export default function DashboardPage() {
  const { stats, loading, error, refresh } = useDashboard();
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  // Cards principais com rotas específicas
  const cards = [
    {
      label: "Minhas Vagas",
      value: stats?.total_vagas ?? 0,
      icon: <LayoutDashboard className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50",
      href: "/dashboard/painel/minhas-vagas"
    },
    {
      label: "Total de Candidatos",
      value: stats?.total_candidaturas ?? 0,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
      href: "/dashboard/painel/minhas-vagas"
    },
    {
      label: "Aguardando Análise",
      value: stats?.novas_candidaturas ?? 0,
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50",
      href: "/painel/candidaturas?status=applied" // Filtro direto
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p>{error}</p>
        <button onClick={refresh} className="mt-4 text-indigo-600 font-bold underline">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-2">Gestão de talentos e oportunidades.</p>
        </div>

        <button
          onClick={() => setIsPostJobOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Postar Nova Vaga
        </button>
      </section>

      {/* GRID DE STATS (Cards linkados) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((item, i) => (
          <Link 
            key={i} 
            href={item.href}
            className="group bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex items-center gap-5 cursor-pointer"
          >
            <div className={`p-4 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform`}>
              {loading ? <div className="w-5 h-5 animate-pulse bg-slate-200 rounded" /> : item.icon}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.label}</p>
              {loading ? (
                <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-lg" />
              ) : (
                <p className="text-2xl font-black text-slate-900">{String(item.value).padStart(2, '0')}</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </Link>
        ))}
      </section>

      {/* STATUS DOS CANDIDATOS (Filtros por status) */}
      <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h3 className="font-bold text-slate-900">Funil de Candidatura</h3>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {stats?.resumo_por_status.map((status, idx) => {
            const config = STATUS_CONFIG[status.status] || { label: status.status, color: "text-indigo-600" };
            return (
              <Link
                key={idx}
                href={`/dashboard/painel/candidaturas?status=${status.status}`}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all group"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mb-1 group-hover:text-indigo-400">
                  {config.label}
                </p>
                <p className={`text-xl font-black ${config.color}`}>{status.total}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <PostJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />
    </div>
  );
}