"use client";

import React from "react";
import { 
  BarChart, 
  FileText, 
  ArrowUpRight, 
  History, 
  Download, 
  Filter, 
  CreditCard,
  Zap,
  CheckCircle2,
  Terminal
} from "lucide-react";

const FATURAS = [
  { id: "INV-2026-001", client: "Matriz_Industrial_B", amount: "R$ 88.400,00", date: "10/03/2026", status: "Processed" },
  { id: "INV-2026-002", client: "Setor_Logistico_Alpha", amount: "R$ 12.150,00", date: "08/03/2026", status: "Processed" },
  { id: "INV-2026-003", client: "Tech_Hub_Sinc", amount: "R$ 4.300,00", date: "05/03/2026", status: "Pending" },
  { id: "INV-2026-004", client: "Distrito_Comercial_Sul", amount: "R$ 32.900,00", date: "01/03/2026", status: "Failed" },
];

export default function FaturamentoPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO DE FUNDO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER: Gestão de Faturamento */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BarChart size={16} className="text-delos-amber" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Revenue_Extraction_Module</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Faturamento_<span className="text-delos-amber">Global</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Processamento de faturas e liquidação de contratos de serviços de hosts.
          </p>
        </div>

        {/* RECEITA MENSAL: OPOSIÇÃO TOTAL */}
        <div className="bg-delos-black p-8 flex flex-col items-center justify-center min-w-[320px] relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/50 animate-scan" />
            <span className="text-delos-surface/40 text-[8px] font-black uppercase tracking-[0.4em] mb-2">Total_Revenue_Cycle_03</span>
            <h2 className="text-delos-surface text-4xl font-black italic tracking-tighter tabular-nums uppercase">
                R$ 137.750,00
            </h2>
            <div className="flex items-center gap-2 mt-4">
                <ArrowUpRight size={12} className="text-emerald-500" />
                <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">+12.4% vs Last_Cycle</span>
            </div>
        </div>
      </header>

      {/* TOOLS & ACTIONS */}
      <section className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex gap-2 w-full">
            <div className="relative flex-1 group">
                <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-amber opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input
                    type="text"
                    placeholder="QUERY_INVOICE_ID..."
                    className="w-full pl-12 pr-6 py-4 bg-delos-black/[0.02] border border-delos-grey/20 outline-none focus:border-delos-amber text-xs font-bold tracking-widest uppercase placeholder:opacity-20"
                />
            </div>
            <button className="px-6 py-4 border border-delos-grey/20 hover:bg-delos-black hover:text-delos-surface transition-all">
                <Filter size={14} />
            </button>
        </div>
        
        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-delos-black text-delos-surface px-10 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-delos-amber transition-all shadow-xl active:scale-95">
            <FileText size={16} />
            Generate_Invoice
        </button>
      </section>

      {/* LISTA DE FATURAS */}
      <div className="bg-delos-surface border border-delos-grey/10 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
                {/* TABLE HEADER: OPOSIÇÃO TOTAL */}
                <tr className="bg-delos-black text-delos-surface">
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Invoice_Protocol</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Target_Client</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Extraction_Value</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Status</th>
                    <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em] text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-delos-grey/10">
                {FATURAS.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-delos-black/[0.02] transition-colors">
                        <td className="p-6">
                            <span className="text-[10px] font-black text-delos-grey italic tabular-nums uppercase">{inv.id}</span>
                            <p className="text-[7px] text-delos-grey/50 uppercase mt-1 tracking-widest">{inv.date}</p>
                        </td>
                        <td className="p-6 font-black text-xs uppercase tracking-tighter text-delos-black">
                            {inv.client}
                        </td>
                        <td className="p-6 font-black text-sm tabular-nums text-delos-black">
                            {inv.amount}
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 ${inv.status === 'Processed' ? 'bg-emerald-500' : inv.status === 'Pending' ? 'bg-delos-amber animate-pulse' : 'bg-delos-red'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${inv.status === 'Processed' ? 'text-emerald-600' : inv.status === 'Pending' ? 'text-delos-amber' : 'text-delos-red'}`}>
                                    {inv.status}
                                </span>
                            </div>
                        </td>
                        <td className="p-6 text-right space-x-4">
                            <button className="text-delos-grey hover:text-delos-black transition-colors">
                                <Download size={16} />
                            </button>
                            <button className="text-delos-grey hover:text-delos-amber transition-colors">
                                <ArrowUpRight size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-delos-black p-8 flex flex-col justify-between group hover:bg-delos-amber transition-all duration-500 cursor-help">
            <Zap size={24} className="text-delos-amber group-hover:text-delos-surface" />
            <div className="mt-8 space-y-2">
                <h3 className="text-delos-surface text-xl font-black italic uppercase tracking-tighter">Fast_Liquidation</h3>
                <p className="text-delos-surface/30 text-[9px] uppercase tracking-widest leading-relaxed">Antecipe o recebimento de faturas pendentes com taxa de rede reduzida.</p>
            </div>
         </div>
         <div className="bg-delos-surface border border-delos-grey/20 p-8 flex flex-col justify-between hover:border-delos-black transition-all">
            <CreditCard size={24} className="text-delos-amber" />
            <div className="mt-8 space-y-2">
                <h3 className="text-delos-black text-xl font-black italic uppercase tracking-tighter">Gateway_Status</h3>
                <p className="text-delos-grey text-[9px] uppercase tracking-widest leading-relaxed">Todas as pontes de pagamento estão operando em regime de estabilidade alta.</p>
            </div>
         </div>
         <div className="bg-delos-black p-8 flex flex-col justify-between relative overflow-hidden">
            <History size={24} className="text-delos-amber" />
            <div className="mt-8 space-y-2">
                <h3 className="text-delos-surface text-xl font-black italic uppercase tracking-tighter">Audit_Archive</h3>
                <p className="text-delos-surface/30 text-[9px] uppercase tracking-widest leading-relaxed">Acesse o histórico completo de faturamentos de ciclos anteriores.</p>
            </div>
            <CheckCircle2 size={80} className="absolute -bottom-4 -right-4 text-delos-amber/10" />
         </div>
      </div>

      {/* FOOTER TÉCNICO */}
      <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Billing_Service // Delos_Internal_Ledger</span>
        <div className="flex gap-4">
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Sync_Stable: 100%</span>
            <span className="text-delos-amber text-[8px] font-black uppercase tracking-[0.5em]">Safe_Mode_On</span>
        </div>
      </footer>
    </div>
  );
}