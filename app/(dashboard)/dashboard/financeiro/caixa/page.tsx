"use client";

import React from "react";
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Calendar, 
  Filter, 
  Download,
  Activity,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const TRANSACOES = [
  { id: "TX-9901", desc: "Aporte_Matriz_Alpha", value: "+R$ 45.000,00", type: "in", status: "Settle" },
  { id: "TX-9902", desc: "Manutenção_Hosts_Setor_B", value: "-R$ 12.450,00", type: "out", status: "Pending" },
  { id: "TX-9903", desc: "Taxa_Sincronização_DLS", value: "-R$ 2.300,00", type: "out", status: "Settle" },
  { id: "TX-9904", desc: "Contrato_Unit_Gamma", value: "+R$ 18.200,00", type: "in", status: "Settle" },
];

export default function FluxoCaixaPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER: Monitor de Liquidez */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <DollarSign size={16} className="text-delos-amber" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Financial_Entropy_Monitor</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Fluxo_de_<span className="text-delos-amber">Caixa</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Sincronização de créditos e débitos operacionais na rede de unidades FreelaCerto.
          </p>
        </div>

        {/* SALDO CONSOLIDADO: OPOSIÇÃO TOTAL */}
        <div className="bg-delos-black p-8 flex flex-col items-center justify-center min-w-[280px] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/50 animate-pulse" />
            <span className="text-delos-surface/40 text-[8px] font-black uppercase tracking-[0.4em] mb-2">Total_Available_Liquidity</span>
            <h2 className="text-delos-surface text-4xl font-black italic tracking-tighter tabular-nums">
                R$ 248.910,42
            </h2>
            <div className="flex items-center gap-2 mt-4">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-delos-amber text-[7px] font-black uppercase tracking-widest">Vault_Secure_Link</span>
            </div>
        </div>
      </header>

      {/* MINI DASHBOARD DE FLUXO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-delos-grey/20 border border-delos-grey/20">
        <div className="bg-delos-surface p-8 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
                <ArrowUpCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Entradas_Ciclo</span>
            </div>
            <p className="text-2xl font-black text-delos-black tabular-nums">+ R$ 63.200,00</p>
        </div>
        <div className="bg-delos-surface p-8 space-y-2 border-x border-delos-grey/10">
            <div className="flex items-center gap-2 text-delos-red">
                <ArrowDownCircle size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Saídas_Ciclo</span>
            </div>
            <p className="text-2xl font-black text-delos-black tabular-nums">- R$ 14.750,00</p>
        </div>
        <div className="bg-delos-surface p-8 space-y-2">
            <div className="flex items-center gap-2 text-delos-amber">
                <TrendingUp size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Net_Profit_Margin</span>
            </div>
            <p className="text-2xl font-black text-delos-black tabular-nums">76.4%</p>
        </div>
      </div>

      {/* TOOLBAR TÉCNICA */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-4 bg-delos-black/5 p-2 border border-delos-grey/20">
            <div className="flex items-center gap-3 px-4 py-2 bg-delos-black text-delos-surface font-black text-[9px] uppercase tracking-widest">
                <Calendar size={14} /> March_2026
            </div>
            <input 
                type="text" 
                placeholder="SEARCH_TRANSACTION_ID..." 
                className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:opacity-30"
            />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 border border-delos-grey/20 hover:bg-delos-black hover:text-delos-surface transition-all font-black text-[10px] uppercase tracking-widest">
            <Download size={14} /> Export_Statement
        </button>
      </section>

      {/* LISTA DE TRANSAÇÕES */}
      <div className="bg-delos-surface border border-delos-grey/10 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-delos-black text-delos-surface">
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Transaction_UID</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Descriptor</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Entropy_Value</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Status</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em] text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-delos-grey/10">
                {TRANSACOES.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-delos-black/[0.02] transition-colors">
                        <td className="p-6 text-[10px] font-black text-delos-grey italic tabular-nums">{tx.id}</td>
                        <td className="p-6">
                            <span className="text-xs font-black uppercase tracking-tighter text-delos-black">{tx.desc}</span>
                        </td>
                        <td className="p-6">
                            <span className={`text-sm font-black tabular-nums ${tx.type === 'in' ? 'text-emerald-600' : 'text-delos-red'}`}>
                                {tx.value}
                            </span>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-none ${tx.status === 'Settle' ? 'bg-emerald-500' : 'bg-delos-amber animate-pulse'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${tx.status === 'Settle' ? 'text-emerald-600' : 'text-delos-amber'}`}>
                                    {tx.status}
                                </span>
                            </div>
                        </td>
                        <td className="p-6 text-right">
                            <button className="text-delos-grey hover:text-delos-black transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* FOOTER TÉCNICO */}
      <footer className="pt-10 border-t border-delos-grey/10 flex flex-col md:flex-row justify-between items-center opacity-40">
        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.5em]">
          <Activity size={12} className="text-delos-amber" />
          Ledger_Consistency: 100% // No_Divergence_Detected
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.5em]">
          © 2026 Delos_White_Financial_Services
        </div>
      </footer>
    </div>
  );
}