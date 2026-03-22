"use client";

import React from "react";
import { 
  LifeBuoy, 
  MessageCircle, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight,
  UserCheck,
  Zap,
  Terminal,
  Activity
} from "lucide-react";

const TICKETS = [
  { id: "TK-7702", host: "Caleb_Nichols", issue: "Divergência de Sincronização de Horas", priority: "High", time: "12m ago" },
  { id: "TK-8841", host: "Maeve_M", issue: "Falha de Acesso ao Módulo de Pagamento", priority: "Critical", time: "5m ago" },
  { id: "TK-9012", host: "Bernard_L", issue: "Solicitação de Alteração de Privilégios", priority: "Medium", time: "1h ago" },
];

export default function SuporteModeradorPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* BACKGROUND DECO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER: Console de Moderação */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <LifeBuoy size={16} className="text-delos-amber animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Moderator_Console_v4.0</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Suporte_<span className="text-delos-amber">Operacional</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Monitoramento de chamados e intervenção em tempo real na rede FreelaCerto.
          </p>
        </div>

        {/* METRICS PANEL */}
        <div className="grid grid-cols-2 gap-px bg-delos-grey/20 border border-delos-grey/20">
            <div className="bg-delos-black p-4 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-delos-amber text-xl font-black italic">14</span>
                <span className="text-delos-surface text-[7px] font-black uppercase tracking-widest mt-1">Pending_Tickets</span>
            </div>
            <div className="bg-delos-black p-4 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-emerald-500 text-xl font-black italic">98%</span>
                <span className="text-delos-surface text-[7px] font-black uppercase tracking-widest mt-1">Resolution_Rate</span>
            </div>
        </div>
      </header>

      {/* TOOLBAR TÉCNICA */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-amber opacity-50 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="SEARCH_TICKET_ID_OR_HOST_NAME..."
            className="w-full pl-12 pr-6 py-5 bg-delos-black/[0.02] border border-delos-grey/20 outline-none focus:border-delos-amber text-sm font-bold tracking-widest uppercase placeholder:opacity-20"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-5 bg-delos-surface border border-delos-grey/20 text-delos-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-delos-black hover:text-delos-surface transition-all">
          <Filter size={14} /> Refine_Search
        </button>
      </section>

      {/* TICKETS TABLE */}
      <div className="bg-delos-surface border border-delos-grey/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            {/* TABLE HEADER: OPOSIÇÃO TOTAL */}
            <tr className="bg-delos-black text-delos-surface">
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Ticket_UID</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Host_Identity</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Incident_Report</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em]">Latency</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.4em] text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-delos-grey/10">
            {TICKETS.map((ticket) => (
              <tr key={ticket.id} className="group hover:bg-delos-black/[0.02] transition-colors">
                <td className="p-6 font-black text-xs italic text-delos-amber">{ticket.id}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-delos-black flex items-center justify-center text-delos-surface border border-white/10 text-[10px] font-black">
                        {ticket.host.slice(0, 1)}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tighter">{ticket.host}</span>
                  </div>
                </td>
                <td className="p-6">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-delos-black uppercase">{ticket.issue}</p>
                      <div className="flex items-center gap-2">
                        <ShieldAlert size={10} className={ticket.priority === 'Critical' ? 'text-delos-red animate-pulse' : 'text-delos-amber'} />
                        <span className={`text-[8px] font-black uppercase ${ticket.priority === 'Critical' ? 'text-delos-red' : 'text-delos-grey'}`}>Priority: {ticket.priority}</span>
                      </div>
                   </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-delos-grey">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold tabular-nums tracking-widest">{ticket.time}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button className="inline-flex items-center gap-2 bg-delos-black text-delos-surface px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-delos-amber transition-all group-hover:shadow-[0_0_15px_rgba(217,119,6,0.2)]">
                    Analyze <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODERATOR QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-delos-black p-8 space-y-4 group hover:bg-delos-amber transition-all duration-500">
            <Zap size={24} className="text-delos-amber group-hover:text-delos-surface" />
            <h3 className="text-delos-surface text-xl font-black uppercase italic tracking-tighter">Fast_Sync</h3>
            <p className="text-delos-surface/40 text-[9px] uppercase tracking-widest leading-relaxed">Forçar ressincronização imediata de todos os hosts em estado de latência crítica.</p>
         </div>
         <div className="bg-delos-surface border border-delos-grey/20 p-8 space-y-4 hover:border-delos-black transition-all">
            <UserCheck size={24} className="text-delos-amber" />
            <h3 className="text-delos-black text-xl font-black uppercase italic tracking-tighter">Validate_Identity</h3>
            <p className="text-delos-grey text-[9px] uppercase tracking-widest leading-relaxed">Aprovação manual de novos hosts pendentes de verificação biométrica e documental.</p>
         </div>
         <div className="bg-delos-black p-8 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <Activity size={40} className="text-delos-amber/20 animate-pulse" />
            </div>
            <Terminal size={24} className="text-delos-amber" />
            <h3 className="text-delos-surface text-xl font-black uppercase italic tracking-tighter">Audit_Logs</h3>
            <p className="text-delos-surface/40 text-[9px] uppercase tracking-widest leading-relaxed">Acessar a trilha de auditoria completa da matriz para investigação de anomalias.</p>
         </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-30">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Suporte_Moderador // Node_Access_Established</span>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em]">Encryption: AES-512</span>
        </div>
      </footer>
    </div>
  );
}