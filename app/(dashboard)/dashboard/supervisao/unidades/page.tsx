"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Map, 
  Box, 
  TrendingUp, 
  AlertTriangle, 
  MoreVertical, 
  Settings2,
  ChevronRight,
  Activity,
  Layers,
  Database
} from "lucide-react";

const UNIDADES = [
  { id: "UNIT-ALPHA", name: "Setor_Norte_Industrial", status: "Optimal", load: 82 },
  { id: "UNIT-BETA", name: "Hub_Logístico_Central", status: "Warning", load: 94 },
  { id: "UNIT-GAMMA", name: "Distrito_Comercial_Sul", status: "Optimal", load: 45 },
];

const ACOES_RECENTES = [
  { id: "ACT-01", type: "Re-alocação", target: "Host_Group_A", time: "02:14:00" },
  { id: "ACT-02", type: "Suspensão", target: "Unidade_Beta", time: "01:45:12" },
  { id: "ACT-03", type: "Sincronização", target: "Global_Matrix", time: "00:30:05" },
];

export default function SupervisaoGestaoPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO DE FUNDO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px) dark:opacity-10`,
          backgroundSize: '50px 50px'
      }} />

      {/* HEADER: Centro de Comando de Unidades */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-delos-amber" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Unit_Supervision_Console</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Gestão_de_<span className="text-delos-amber">Unidades</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Visão macro-estrutural e controle de diretrizes das unidades operacionais ativas.
          </p>
        </div>

        {/* INDICADORES DE MATRIZ: OPOSIÇÃO TOTAL */}
        <div className="flex gap-px bg-delos-grey/20 border border-delos-grey/20">
            <div className="bg-delos-black p-5 flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-delos-surface text-2xl font-black italic tabular-nums">08</span>
                <span className="text-delos-amber text-[7px] font-black uppercase tracking-widest mt-1">Units_Online</span>
            </div>
            <div className="bg-delos-black p-5 flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-delos-surface text-2xl font-black italic tabular-nums">74%</span>
                <span className="text-delos-amber text-[7px] font-black uppercase tracking-widest mt-1">Total_Capacity</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: LISTA DE UNIDADES */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-delos-grey">Monitoramento_de_Nós</h3>
            <button className="text-[9px] font-black uppercase tracking-widest text-delos-amber hover:underline">View_Map</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {UNIDADES.map((unit) => (
              <div key={unit.id} className="bg-delos-surface border border-delos-grey/20 p-6 flex items-center justify-between group hover:border-delos-black transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-delos-black text-delos-surface flex items-center justify-center border border-white/10 font-black text-[10px]">
                    {unit.id.split('-')[1].slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{unit.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-delos-grey">
                       <span className="text-[8px] font-bold uppercase tracking-tighter italic">{unit.id}</span>
                       <div className="w-1 h-1 bg-delos-grey/40 rounded-full" />
                       <span className={`text-[8px] font-black uppercase tracking-widest ${unit.status === 'Warning' ? 'text-delos-amber' : 'text-emerald-500'}`}>
                         Status: {unit.status}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <span className="text-[8px] font-black text-delos-grey uppercase tracking-widest">Load_Factor</span>
                    <div className="w-32 h-1.5 bg-delos-grey/10 border border-delos-grey/5 relative overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${unit.load > 90 ? 'bg-delos-amber' : 'bg-delos-black'}`}
                        style={{ width: `${unit.load}%` }}
                      />
                    </div>
                  </div>
                  <button className="p-2 hover:bg-delos-black hover:text-delos-surface transition-colors border border-transparent hover:border-white/10">
                    <Settings2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA: LOG DE AÇÕES E CONTROLES */}
        <div className="lg:col-span-4 space-y-8">
          {/* PAINEL DE AÇÕES: OPOSIÇÃO TOTAL NO HEADER */}
          <div className="bg-delos-surface border border-delos-grey/20 shadow-xl overflow-hidden">
            <div className="bg-delos-black p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3 text-delos-surface">
                <Activity size={16} className="text-delos-amber animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Action_Log</h3>
              </div>
              <Database size={12} className="text-delos-grey opacity-50" />
            </div>
            
            <div className="p-2 divide-y divide-delos-grey/5">
              {ACOES_RECENTES.map((action) => (
                <div key={action.id} className="p-4 flex items-center justify-between hover:bg-delos-black/[0.02] transition-colors group">
                  <div>
                    <p className="text-[9px] font-black text-delos-black uppercase">{action.type}</p>
                    <p className="text-[8px] text-delos-grey uppercase tracking-widest mt-0.5">{action.target}</p>
                  </div>
                  <span className="text-[8px] font-mono text-delos-grey group-hover:text-delos-amber tabular-nums">{action.time}</span>
                </div>
              ))}
            </div>

            <button className="w-full p-4 bg-delos-black text-delos-surface font-black text-[9px] uppercase tracking-[0.4em] hover:bg-delos-amber transition-all border-t border-white/10">
              Clear_History_Cache
            </button>
          </div>

          {/* GLOBAL OVERRIDE BUTTON */}
          <button className="w-full p-8 bg-delos-black border border-delos-amber/40 flex flex-col items-center justify-center gap-4 group hover:bg-delos-amber transition-all duration-500 shadow-[0_0_30px_rgba(217,119,6,0.1)]">
            <AlertTriangle size={32} className="text-delos-amber group-hover:text-delos-surface animate-pulse" />
            <div className="text-center">
              <span className="block text-delos-surface text-xs font-black uppercase tracking-[0.5em]">Global_Override</span>
              <span className="block text-delos-surface/40 text-[7px] uppercase tracking-widest mt-1 italic">Emergency_Stop_Protocol</span>
            </div>
          </button>
        </div>
      </div>

      {/* FOOTER TÉCNICO */}
      <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.5em]">
          <Box size={12} />
          Node_Encryption_Active // Unit_Sync_Stable
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-black uppercase tracking-[0.5em]">© 2026 Protocolo Delos_White</span>
          <div className="w-2 h-2 bg-delos-amber rounded-full animate-ping" />
        </div>
      </footer>
    </div>
  );
}