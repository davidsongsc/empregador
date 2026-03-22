"use client";

import React from "react";
import { 
  BarChart3, 
  MousePointerClick, 
  Table2, 
  Layers, 
  Terminal, 
  Activity, 
  ArrowUpRight, 
  LucideIcon 
} from "lucide-react";

// Definição da interface para garantir tipagem estrita Delos
interface Feature {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    Icon: Table2,
    title: "Tabelas_Dinâmicas",
    desc: "Agrupe custos por setor, por dia ou por fornecedor em milissegundos dentro do seu ambiente de análise."
  },
  {
    Icon: BarChart3,
    title: "Gráficos_Custom",
    desc: "Gere visualizações de nível executivo sem depender de novos protocolos de desenvolvimento ou TI."
  },
  {
    Icon: Layers,
    title: "Cruzamento_Temporal",
    desc: "Compare a performance de hosts entre ciclos distintos e identifique divergências de margem operacional."
  }
];

export default function RelatoriosPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-12 space-y-20 font-mono text-delos-black">
      
      {/* GRID DECORATIVO DE FUNDO */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
      }} />

      {/* CABEÇALHO TÉCNICO */}
      <header className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center justify-center gap-3">
          <Terminal size={18} className="text-delos-amber" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-delos-grey">Data_Intelligence_Module</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">
          Relatórios_Sem_<span className="text-delos-amber">Limites.</span>
        </h1>
        
        <p className="text-delos-grey max-w-2xl mx-auto text-[11px] md:text-xs uppercase tracking-[0.2em] leading-relaxed">
          Nós entregamos a extração bruta dos hosts. Você define a narrativa. 
          Ignore protocolos engessados e acesse o núcleo da operação FreelaCerto.
        </p>
      </header>

      {/* FEATURES GRID (TERMINAL STYLE) */}
      <div className="grid md:grid-cols-3 gap-px bg-delos-black/10 border border-delos-black/10 shadow-2xl">
        {FEATURES.map((feature, i) => (
          <div key={i} className="p-10 bg-delos-surface group hover:bg-delos-black transition-all duration-500 relative overflow-hidden">
            {/* EFEITO DE SCANLINE NO HOVER */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-delos-amber/50 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="bg-delos-black group-hover:bg-delos-amber w-14 h-14 flex items-center justify-center mb-8 transition-colors duration-300">
              <feature.Icon 
                size={24} 
                className="text-delos-amber group-hover:text-white transition-colors duration-300" 
              />
            </div>

            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-4 group-hover:text-white transition-colors">
              {feature.title}
            </h3>
            
            <p className="text-delos-grey text-[10px] leading-relaxed uppercase tracking-widest group-hover:text-white/60 transition-colors">
              {feature.desc}
            </p>

            <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
               <ArrowUpRight size={14} className="text-delos-amber" />
               <span className="text-[8px] font-black text-delos-amber uppercase tracking-[0.3em]">Access_Gate</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA: PROTOCOLO DE EXPORTAÇÃO */}
      <div className="relative group overflow-hidden bg-delos-black border border-white/5 shadow-2xl">
        {/* Camada de textura sutil */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        
        <div className="p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Activity size={14} className="text-delos-amber animate-pulse" />
              <span className="text-[9px] font-black text-delos-amber uppercase tracking-[0.4em]">Query_Status: Online</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
              Requisitar_Dados_Brutos?
            </h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
              Se existe no Host, está na sua planilha. Protocolo de extração imediato.
            </p>
          </div>

          <button className="relative group/btn bg-delos-amber text-white px-12 py-6 font-black uppercase text-xs tracking-[0.4em] overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] active:scale-95">
            <div className="relative z-10 flex items-center gap-3">
              <MousePointerClick size={18} />
              Iniciar_Extração
            </div>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* LOG DE SEGURANÇA NO RODAPÉ DO CTA */}
        <div className="absolute bottom-4 left-10 hidden md:block opacity-20">
          <span className="text-[7px] text-white font-mono uppercase tracking-[0.5em]">
            AES-256_ENCRYPTED_STREAM // SOURCE: DELOS_MAIN_RECORDS
          </span>
        </div>
      </div>

      {/* FOOTER TÉCNICO */}
      <footer className="flex justify-between items-center opacity-30 pt-10 border-t border-delos-black/5">
        <div className="text-[8px] font-black uppercase tracking-[0.4em]">© 2026 Protocolo Delos_White</div>
        <div className="flex gap-4">
          <div className="w-2 h-2 bg-delos-amber rounded-full animate-ping" />
          <div className="w-2 h-2 bg-delos-black rounded-full" />
        </div>
      </footer>
    </div>
  );
}