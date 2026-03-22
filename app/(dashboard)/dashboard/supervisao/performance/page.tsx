"use client";

import React from "react";
import {
    TrendingUp,
    Zap,
    Activity,
    Target,
    Cpu,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    ShieldCheck,
    Terminal,
    ArrowRight
} from "lucide-react";

const METRICS = [
    { label: "Sync_Accuracy", value: "99.4%", change: "+0.2%", trend: "up" },
    { label: "Latency_Index", value: "14ms", change: "-4ms", trend: "up" },
    { label: "Host_Efficiency", value: "87.1%", change: "+1.5%", trend: "up" },
    { label: "Resource_Drain", value: "12%", change: "+2%", trend: "down" },
];

export default function PerformancePage() {
    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">

            {/* GRID DECORATIVO */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
                backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
            }} />

            {/* HEADER: Performance & Biometria */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-delos-amber animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">System_Performance_Index</span>
                    </div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                        Métricas_<span className="text-delos-amber">Core</span>
                    </h1>
                    <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
                        Análise em tempo real da integridade dos protocolos e rendimento da rede host.
                    </p>
                </div>
            </header>

            {/* METRIC CARDS: OPOSIÇÃO TOTAL NO HOVER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-delos-grey/20 border border-delos-grey/20 shadow-2xl">
                {METRICS.map((metric, i) => (
                    <div key={i} className="bg-delos-surface p-8 group hover:bg-delos-black transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[9px] font-black uppercase tracking-widest text-delos-grey group-hover:text-delos-surface/50">
                                {metric.label}
                            </span>
                            {metric.trend === 'up' ? (
                                <ArrowUpRight size={14} className="text-emerald-500" />
                            ) : (
                                <ArrowDownRight size={14} className="text-delos-red" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black italic tabular-nums group-hover:text-delos-surface">
                                {metric.value}
                            </h2>
                            <p className={`text-[8px] font-black uppercase tracking-widest ${metric.trend === 'up' ? 'text-emerald-500' : 'text-delos-red'}`}>
                                {metric.change} FROM_PREVIOUS_CYCLE
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* GRÁFICO DE ESTABILIDADE: OPOSIÇÃO TOTAL (FUNDO BLACK) */}
                <div className="lg:col-span-8 bg-delos-black p-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BarChart3 size={200} className="text-white" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-delos-surface">
                                <Zap size={18} className="text-delos-amber" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em]">Network_Stability_Graph</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-delos-amber rounded-none" />
                                    <span className="text-[7px] text-delos-surface/40 uppercase font-black">Core_Process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white/20 rounded-none" />
                                    <span className="text-[7px] text-delos-surface/40 uppercase font-black">Host_Response</span>
                                </div>
                            </div>
                        </div>

                        {/* FAKE CHART RECTANGLES */}
                        <div className="h-64 flex items-end gap-2 px-2">
                            {[40, 70, 45, 90, 65, 80, 30, 95, 50, 75, 85, 60, 40, 55, 90].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-delos-amber/20 hover:bg-delos-amber transition-all cursor-crosshair relative group/bar"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] text-delos-amber opacity-0 group-hover/bar:opacity-100 font-bold tabular-nums">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-white/5">
                            <span className="text-[8px] font-black text-delos-surface/20 uppercase tracking-[0.5em]">Sequence_001_015</span>
                            <span className="text-[8px] font-black text-delos-amber uppercase tracking-[0.5em]">Real_Time_Sync: Active</span>
                        </div>
                    </div>
                </div>

                {/* RECOMENDAÇÕES DE OTIMIZAÇÃO */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-delos-surface border border-delos-grey/20 p-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <Target size={18} className="text-delos-black" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em]">Directives</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "Optimize_Buffer", cost: "Low_Impact", icon: Cpu },
                                { label: "Re-sync_Host_Gateway", cost: "Med_Impact", icon: ShieldCheck },
                                { label: "Update_Core_DLS", cost: "High_Impact", icon: Terminal },
                            ].map((rec, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-delos-black flex items-center justify-center text-delos-surface group-hover:bg-delos-amber transition-colors">
                                            <rec.icon size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">{rec.label}</p>
                                            <p className="text-[7px] text-delos-grey uppercase mt-1">{rec.cost}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-delos-grey group-hover:text-delos-amber group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 bg-delos-black text-delos-surface font-black text-[9px] uppercase tracking-[0.4em] hover:bg-delos-amber transition-all shadow-lg">
                            Apply_Optimization_All
                        </button>
                    </div>
                </div>
            </div>

            {/* FOOTER TÉCNICO */}
            <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-30">
                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em]">
                    <BarChart3 size={12} />
                    Biometric_Data_Stream // Cycle_342_A
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Delos_White_Performance</span>
            </footer>
        </div>
    );
}