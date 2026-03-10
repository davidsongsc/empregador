"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronRight, Plus, LayoutDashboard, AlertCircle, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import { STATUS_CONFIG } from "@/data/statusLabels";
import PostNewJobModal from "@/components/Modal/PostNewJobModal";
import { useAuthStore } from "@/store/useAuthStore";
import { checkModuleAccess } from "@/utils/hasRecruitmentPermission";

export default function DashboardPage() {
  const { stats, loading, error, refresh } = useDashboard();
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const { activeCompanyId } = useAuthStore();
  useEffect(() => {
    if (activeCompanyId) {
      refresh();
    }
  }, [activeCompanyId, refresh]);
  const { user } = useAuthStore()

  const empresas = user?.profile?.empresas

  const canAccessSupervision = checkModuleAccess(empresas, 'SUPERVISION');
  const operador = user?.profile?.name;
  const empresaName = user?.profile?.empresas?.find(
    (empresa) => empresa.id === activeCompanyId
  )?.name
  const cards = [
    {
      label: "Vagas Ativas",
      value: stats?.total_vagas ?? 0,
      icon: <LayoutDashboard className="w-5 h-5 text-amber-500" />,
      bg: "bg-slate-900/50",
      href: "/dashboard/painel/minhas-vagas"
    },
    {
      label: "Hosts Candidatos",
      value: stats?.total_candidaturas ?? 0,
      icon: <Users className="w-5 h-5 text-slate-400" />,
      bg: "bg-slate-900/50",
      href: "/dashboard/painel/minhas-vagas"
    },
    {
      label: "Aguardando Resposta",
      value: stats?.novas_candidaturas ?? 0,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: "bg-slate-900/50",
      href: "/painel/candidaturas?status=applied"
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-mono">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <p className="tracking-widest uppercase text-xs font-bold">System Error: Data Corruption</p>
        <button onClick={refresh} className="mt-4 text-amber-600 font-black hover:text-amber-500 transition-colors uppercase text-xs tracking-tighter italic underline">
          Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className="sm:py-4 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* HEADER - Estilo Delos Corporate */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-800 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] bg-amber-600" />
            <span className="text-[10px] font-black tracking-[0.4em] text-amber-600 uppercase">Visão Geral</span>
          </div>
          <h1 className="text-4xl font-light text-slate-100 tracking-tighter">
            {empresaName} | <span className="font-black uppercase">{operador} </span>
          </h1>
          <p className="text-slate-500 text-xs font-medium tracking-wide uppercase">Operações de Unidades e Gestão de Fluxo</p>
        </div>

        <button
          onClick={() => setIsPostJobOpen(true)}
          disabled={!canAccessSupervision}
          className={`group relative flex items-center justify-center gap-3  text-black px-8 py-4 overflow-hidden transition-all  ${!canAccessSupervision ? 'bg-slate-800' : 'bg-white hover:bg-amber-600 hover:text-white'}`}
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          <span className={`font-black text-xs uppercase tracking-[0.2em] ${!canAccessSupervision ? 'opacity-50 cursor-not-allowed' : ''}`}>Anunciar Vaga</span>
        </button>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-slate-800 border border-slate-800 shadow-2xl">
        {cards.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group bg-slate-950 p-8 transition-all hover:bg-slate-900 flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Background Detail */}
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
              <BarChart3 className="w-16 h-16 text-slate-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-900 border border-slate-800 group-hover:border-amber-600/50 transition-colors">
                {loading ? <div className="w-5 h-5 animate-pulse bg-slate-800" /> : item.icon}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">{item.label}</p>
              {loading ? (
                <div className="h-10 w-20 bg-slate-900 animate-pulse" />
              ) : (
                <p className="text-4xl font-light text-slate-100 italic">
                  {String(item.value).padStart(2, '0')}<span className="text-amber-600 text-sm not-italic ml-1">.n</span>
                </p>
              )}
            </div>
          </Link>
        ))}
      </section>

      {/* FUNIL DE CANDIDATURA - Visual de Monitor de Controle */}
      <section className="bg-slate-950 border border-slate-800 shadow-2xl">
        <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-75" />
            </div>
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Progressão de Candidaturas</h3>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-none">Status: Live Feed</span>
        </div>

        <div className="p-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 bg-slate-800">
          {stats?.resumo_por_status.map((status, idx) => {
            const config = STATUS_CONFIG[status.status] || { label: status.status, color: "text-slate-400" };
            return (
              <Link
                key={idx}
                href={`/dashboard/painel/candidaturas?status=${status.status}`}
                className="bg-slate-950 p-6 text-center hover:bg-slate-900 transition-all group relative"
              >
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-3 group-hover:text-amber-500 transition-colors">
                  {config.label}
                </p>
                <p className="text-3xl font-light text-slate-200 group-hover:scale-110 transition-transform">
                  {status.total}
                </p>
                {/* Indicador inferior sutil */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-amber-600/30 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      <PostNewJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />
    </div>
  );
}