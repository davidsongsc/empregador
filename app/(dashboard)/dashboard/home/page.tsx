"use client";

import { useState } from "react";
import {
  ChevronRight, Plus, LayoutDashboard, AlertCircle, Users,
  BarChart3, Activity, ArrowUpRight, TrendingUp, User, Computer,
  ArrowDownRight, Zap, Globe, ShieldCheck, Timer,
  Thermometer,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useDashboard } from "@/hooks/useDashboard";
import PostNewJobModal from "@/components/Modal/PostNewJobModal";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_LABELS } from "@/constants/roles";
import checkModuleAccess from "@/utils/checkModuleAccess";
import { getActiveMembership } from "@/utils/userHelpers";
import { Module } from "@/enum/moduleEnum";
import ContainerMain from "@/components/Layout/ContainerMain";
import { ThemePanel } from "@/components/Modal/ThemeModal";

// Grafico de Barras - Versão "Micro-Série"
const MicroSeriesChart = ({ data }: { data: any[] }) => {
  const maxVal = Math.max(...data.map(d => d.quantidade), 1);
  return (
    <div className="flex items-end gap-1 h-32 w-full bg-delos-grey/20 p-4 rounded-lg border border-white/5">
      {data.map((item, i) => (
        <div
          key={i}
          className="bg-delos-amber/20 hover:bg-delos-amber/60 transition-all w-full relative group cursor-crosshair"
          style={{ height: `${(item.quantidade / maxVal) * 100}%` }}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-delos-amber text-black text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
            {item.data}: {item.quantidade}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { stats, loading, error, refresh } = useDashboard();
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const activeMembership = getActiveMembership();

  const canAccessSupervision = checkModuleAccess(activeMembership?.role, Module.SUPERVISION);
  const cargoExibicao = activeMembership?.role
    ? (ROLE_LABELS[activeMembership.role] || activeMembership.role.replace(/_/g, ' '))
    : "Colaborador";

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-mono p-20 border-2 border-dashed border-red-500/20 rounded-3xl">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6 animate-bounce" />
      <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">Critical System Failure</h2>
      <p className="text-xs text-slate-500 mb-6 font-mono">CODE: {error || "UNKNOWN_ERR"}</p>
      <button onClick={refresh} className="px-10 py-3 bg-delos-surface text-delos-black font-black uppercase text-xs hover:bg-delos-amber transition-all">Manual Reboot</button>
    </div>
  );

  const stats48 = stats?.analytics_periodo?.tempo_real_48h;

  return (
    <ContainerMain>
      {/* 1. TOP BAR - STATUS TÉCNICO */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-[10px] font-mono text-slate-500 border-b border-white/5 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-delos-green animate-pulse" />
            <span className="text-delos-grey uppercase font-black">Servidor Online</span>
          </div>
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-delos-amber" /> Autorização: {stats?.status_servidor?.scope}</span>
          <span className="flex items-center gap-1.5"><Timer size={12} /> UP: {stats?.status_servidor?.uptime}</span>
          <span className="flex items-center gap-1.5">
            <button className="flex justify-center items-center" onClick={() => setIsThemeModalOpen(!isThemeModalOpen)}>
              <Lightbulb size={16} className="text-delos-amber" />Tema


            </button>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="flex items-center gap-1.5"><Computer size={12} /> DB: {stats?.status_servidor?.banco_dados}</span>
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-delos-amber" /> LATENCY: 24ms</span>
        </div>

      </div>

      {/* 2. HERO SECTION - 48H MONITORING */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-[1px] bg-delos-amber" />
              <span className="text-[10px] font-black text-delos-amber uppercase tracking-[0.4em]">ÚLTIMAS • 48H</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-8 italic uppercase">
              {activeMembership?.company_name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 italic">Fluxo Acumulado</p>
                <p className="text-6xl font-light text-white tracking-tighter">{stats48?.total_acumulado?.toString().padStart(2, '0')}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-black uppercase ${stats48?.tendencia === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stats48?.tendencia === 'up' ? '▲ Gain' : '▼ Loss'}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">/ Delta: {stats48?.diff}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end border-l border-white/5 pl-8">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-4 tracking-widest">Snapshot: 24h cycle</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono uppercase italic">T-0 (Hoje)</span>
                    <span className="text-xl font-black text-white">{stats48?.hoje}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-mono uppercase italic">T-24 (Ontem)</span>
                    <span className="text-xl font-black text-slate-600">{stats48?.ontem}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={() => setIsPostJobOpen(true)}
                  disabled={!canAccessSupervision}
                  className="w-full py-4 bg-delos-amber text-black font-black uppercase text-xs italic hover:bg-white transition-all shadow-[0_10px_30px_rgba(255,191,0,0.2)]"
                >
                  Publicar Vaga
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE SÉRIE */}
        <div className="bg-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1 italic">Network Health</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase mb-6">Métrica Diária Mensal</p>
          </div>
          <MicroSeriesChart data={stats?.crescimento_diario || []} />
          <div className="mt-6 flex justify-between text-[9px] font-mono text-slate-600 uppercase">
            <span>{stats?.crescimento_diario?.[0]?.data || 'Start'}</span>
            <span>{stats?.crescimento_diario?.slice(-1)[0]?.data || 'End'}</span>
          </div>
        </div>

      </section>
      {isThemeModalOpen && <ThemePanel />}

      {/* 3. TOTAIS & PERFORMANCE CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* TOTAL VAGAS */}
        <Link href="/dashboard/painel/minhas-vagas" className="group bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:border-delos-amber/50 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-delos-amber/10 border border-delos-amber/20 text-delos-amber"><LayoutDashboard size={18} /></div>
            <ChevronRight size={14} className="text-slate-700 group-hover:text-delos-amber transition-transform group-hover:translate-x-1" />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Openings</p>
          <p className="text-4xl font-black text-white italic tracking-tighter mt-1">{stats?.totais?.vagas?.toString().padStart(2, '0')}</p>
        </Link>

        {/* CANDIDATOS */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <Users size={40} className="absolute -bottom-2 -right-2 text-white/5 group-hover:text-delos-amber/10 transition-colors" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Talent Pool</p>
          <p className="text-4xl font-black text-white italic tracking-tighter">{stats?.totais?.candidatos?.toString().padStart(2, '0')}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-delos-amber animate-pulse" />
            <span className="text-[9px] text-slate-500 font-mono uppercase italic">Global Indexing Active</span>
          </div>
        </div>

        {/* ANALYTICS SEMANAL */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Weekly Performance</p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{stats?.analytics_periodo?.semanal?.valor}</p>
            <div className="pb-1">
              <p className="text-[9px] text-delos-amber font-mono font-bold uppercase leading-none">AVG: {stats?.analytics_periodo?.semanal?.media_diaria}</p>
              <p className="text-[9px] text-slate-600 font-mono uppercase leading-none">PER_DAY</p>
            </div>
          </div>
          <div className="mt-4 w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '65%' }} />
          </div>
        </div>

        {/* ANALYTICS MENSAL */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-transparent">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Monthly Volume</p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-slate-400 italic tracking-tighter leading-none">{stats?.analytics_periodo?.mensal?.valor}</p>
            <div className="pb-1">
              <p className="text-[9px] text-slate-500 font-mono font-bold uppercase leading-none">AVG: {stats?.analytics_periodo?.mensal?.media_diaria}</p>
              <p className="text-[9px] text-slate-700 font-mono uppercase leading-none">PER_DAY</p>
            </div>
          </div>
          <Activity size={18} className="mt-4 text-slate-800" />
        </div>
      </section>

      <PostNewJobModal isOpen={isPostJobOpen} onClose={() => setIsPostJobOpen(false)} />
    </ContainerMain>
  );
}