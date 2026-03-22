"use client";

import React from "react";
import { 
  MessageSquare, 
  Send, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Database, 
  ArrowRight,
  Cpu,
  Smartphone,
  Activity
} from "lucide-react";

const TOOLS = [
  {
    id: "whatsapp-sender",
    title: "WhatsApp_Direct",
    desc: "Envio de protocolos de mensagem via API sem necessidade de salvar o contato na agenda do host.",
    icon: MessageSquare,
    status: "Active"
  },
  {
    id: "bulk-broadcast",
    title: "Bulk_Broadcast",
    desc: "Disparo em massa para listas segmentadas de hosts com variáveis de personalização dinâmica.",
    icon: Send,
    status: "Standby"
  },
  {
    id: "data-parser",
    title: "Entity_Parser",
    desc: "Extração e formatação de números de telefone e dados brutos de arquivos CSV/Excel.",
    icon: Database,
    status: "Active"
  }
];

export default function FerramentasPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-16 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO DE FUNDO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      {/* HEADER TÉCNICO */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Cpu size={16} className="text-delos-amber animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Utility_Module_v4.2</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Ferramentas_<span className="text-delos-amber">Sincronizadas</span>
          </h1>
          <p className="text-delos-grey text-[10px] uppercase tracking-[0.2em] max-w-xl">
            Acesse utilitários de baixo nível para comunicação e manipulação de dados na rede host.
          </p>
        </div>

        {/* STATUS PANEL NO HEADER */}
        <div className="bg-delos-black p-4 border border-white/10 hidden md:block">
            <div className="flex items-center gap-4 text-delos-surface">
                <Activity size={12} className="text-delos-amber" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">System_Integrity: 100%</span>
            </div>
        </div>
      </header>

      {/* FERRAMENTAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TOOLS.map((tool) => (
          <div key={tool.id} className="bg-delos-surface border border-delos-grey/20 group hover:border-delos-black transition-all duration-300 flex flex-col">
            
            {/* TOOL TOP BAR */}
            <div className="p-4 border-b border-delos-grey/10 flex justify-between items-center bg-delos-black/[0.02]">
                <div className="flex items-center gap-2">
                    <tool.icon size={14} className="text-delos-amber" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-delos-grey">{tool.id}</span>
                </div>
                <div className={`text-[7px] font-black uppercase px-2 py-0.5 border ${tool.status === 'Active' ? 'border-emerald-500/50 text-emerald-500' : 'border-delos-amber/50 text-delos-amber'}`}>
                    {tool.status}
                </div>
            </div>

            {/* CONTENT: Oposição no Hover */}
            <div className="p-8 space-y-6 flex-1 group-hover:bg-delos-black transition-colors duration-500">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-delos-surface">
                    {tool.title}
                </h3>
                <p className="text-delos-grey text-[11px] leading-relaxed uppercase tracking-[0.1em] group-hover:text-delos-surface/60">
                    {tool.desc}
                </p>
            </div>

            {/* ACTION FOOTER: Oposição Total no Hover */}
            <button className="w-full p-5 border-t border-delos-grey/10 flex items-center justify-between group-hover:bg-delos-amber group-hover:border-delos-amber transition-all group-hover:text-delos-surface text-delos-black font-black text-[10px] uppercase tracking-[0.3em]">
                Initialize_Utility
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* QUICK_SEND COMPONENT (Utilidade Pronta) */}
      <section className="bg-delos-black text-delos-surface p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Smartphone size={120} className="rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
                <Zap size={18} className="text-delos-amber" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Zap_Fast_Link</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Phone_Number</label>
                    <input 
                        type="text" 
                        placeholder="5511999999999" 
                        className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-delos-amber text-delos-surface font-bold tracking-widest placeholder:opacity-20"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-50">Encrypted_Payload (Message)</label>
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="INPUT_MESSAGE_DATA..." 
                            className="flex-1 bg-white/5 border border-white/10 p-4 outline-none focus:border-delos-amber text-delos-surface font-bold tracking-widest placeholder:opacity-20"
                        />
                        <button className="bg-delos-amber text-delos-surface px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-delos-black transition-all">
                            Transmit
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40">End-to-End_Encryption_Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-delos-amber" />
                    <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40">Node_Sychronized: WA_Gateway</span>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER TÉCNICO */}
      <footer className="pt-12 border-t border-delos-grey/10 flex flex-col md:flex-row justify-between gap-4 opacity-40">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Delos_White_Tools // Protocol_303</span>
        <div className="flex gap-2 text-[8px] font-black uppercase tracking-[0.5em]">
            <span>Latency: 24ms</span>
            <span className="text-delos-amber">Matrix_Safe</span>
        </div>
      </footer>
    </div>
  );
}