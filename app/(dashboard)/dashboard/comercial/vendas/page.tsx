"use client";

import React from "react";
import { 
  Trello, 
  Search, 
  UserPlus, 
  MessageSquare, 
  FileCheck, 
  DollarSign, 
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";

const STAGES = [
  { id: "lead", name: "Sinal_Bruto", color: "bg-delos-grey/20", count: 12 },
  { id: "contact", name: "Sincronização", color: "bg-delos-amber/40", count: 8 },
  { id: "proposal", name: "Protocolo_Enviado", color: "bg-delos-amber/70", count: 5 },
  { id: "closing", name: "Negociação_Final", color: "bg-delos-black", count: 3 },
];

const CARDS = [
  { id: "C-01", name: "Setor_Norte_Corp", value: "R$ 45.000", stage: "lead", health: "Stable" },
  { id: "C-02", name: "Matriz_Alpha_Industrial", value: "R$ 120.000", stage: "proposal", health: "Critical" },
  { id: "C-03", name: "Tech_Hub_Sinc", value: "R$ 12.500", stage: "closing", health: "Optimal" },
];

export default function SalesPipelinePage() {
  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-10 space-y-10 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER: Engenharia de Vendas */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trello size={16} className="text-delos-amber" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Sales_Conversion_Matrix</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Pipeline_<span className="text-delos-amber">Vendas</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Monitoramento do fluxo de capital e progressão de protocolos comerciais na rede DLS.
          </p>
        </div>

        {/* METRICS OVERVIEW: OPOSIÇÃO TOTAL */}
        <div className="flex gap-px bg-delos-grey/20 border border-delos-grey/20">
          <div className="bg-delos-black p-6 flex flex-col items-center min-w-[160px]">
            <span className="text-delos-surface text-2xl font-black italic">R$ 1.2M</span>
            <span className="text-delos-amber text-[7px] font-black uppercase tracking-widest mt-1">Total_Pipe_Value</span>
          </div>
          <div className="bg-delos-black p-6 flex flex-col items-center min-w-[160px]">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-delos-surface text-[7px] font-black uppercase tracking-widest mt-2">Conversion: 24%</span>
          </div>
        </div>
      </header>

      {/* PIPELINE KANBAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex flex-col gap-4">
            
            {/* STAGE HEADER: Oposição Total no Estágio Crítico */}
            <div className={`p-4 flex items-center justify-between border-b-2 ${stage.id === 'closing' ? 'bg-delos-black border-delos-amber' : 'bg-delos-black/5 border-delos-grey/20'}`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stage.id === 'closing' ? 'text-delos-surface' : 'text-delos-black'}`}>
                {stage.name}
              </span>
              <span className={`text-[9px] font-mono tabular-nums ${stage.id === 'closing' ? 'text-delos-amber font-black' : 'text-delos-grey'}`}>
                ({stage.count.toString().padStart(2, '0')})
              </span>
            </div>

            {/* CARDS CONTAINER */}
            <div className="space-y-4 min-h-[500px] bg-delos-black/[0.01] p-2 border-x border-dashed border-delos-grey/10">
              {CARDS.filter(c => c.stage === stage.id).map((card) => (
                <div key={card.id} className="bg-delos-surface border border-delos-grey/20 p-5 group hover:border-delos-black hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[8px] font-black text-delos-grey uppercase tracking-widest">{card.id}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${card.health === 'Critical' ? 'bg-delos-red animate-pulse' : 'bg-emerald-500'}`} />
                  </div>
                  
                  <h3 className="text-sm font-black uppercase italic tracking-tighter text-delos-black group-hover:text-delos-amber transition-colors mb-1">
                    {card.name}
                  </h3>
                  <p className="text-lg font-black tabular-nums text-delos-black mb-6">{card.value}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-delos-grey/5">
                    <div className="flex items-center gap-2">
                      <Activity size={10} className="text-delos-grey opacity-40" />
                      <span className="text-[7px] font-black text-delos-grey uppercase tracking-widest">Health: {card.health}</span>
                    </div>
                    <button className="text-delos-black hover:text-delos-amber transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* ADD NEW CARD PLACEHOLDER */}
              <button className="w-full py-4 border border-dashed border-delos-grey/20 text-delos-grey hover:text-delos-amber hover:border-delos-amber transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                <UserPlus size={12} /> Sync_New_Lead
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION FOOTER: OPOSIÇÃO TOTAL */}
      <footer className="bg-delos-black p-8 flex flex-col md:flex-row items-center justify-between border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-delos-amber/10 border border-delos-amber/20">
            <DollarSign size={20} className="text-delos-amber" />
          </div>
          <div>
            <p className="text-delos-surface text-[10px] font-black uppercase tracking-[0.3em]">Forecast_Revenue_Cycle</p>
            <p className="text-delos-surface/40 text-[8px] uppercase tracking-widest">Baseado nos protocolos em Negociação_Final</p>
          </div>
        </div>

        <button className="bg-delos-amber text-delos-surface px-12 py-5 font-black uppercase text-xs tracking-[0.4em] hover:bg-delos-surface hover:text-delos-black transition-all active:scale-95 group">
          Execute_Quarterly_Report
          <ArrowRight className="inline ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </footer>
    </div>
  );
}