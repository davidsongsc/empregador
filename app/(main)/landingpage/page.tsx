"use client";

import {
    BarChart3,
    ShieldCheck,
    Zap,
    FileCheck,
    Users,
    ArrowRight,
    Cpu,
    Lock,
    MousePointerClick,
    CheckCircle,
    Database,
    Globe,
    Terminal
} from "lucide-react";
import PricingSection from "@/components/PageComponents/PricingSection";

export default function DelosLandingPage() {
    return (
        <div className="bg-delos-black text-white antialiased font-mono selection:bg-delos-amber selection:text-black">
            
            {/* --- TOP NAV OVERLAY --- */}


            {/* --- HERO: A ORIGEM --- */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
                {/* Efeito de Scanner Animado */}
                <div className="absolute inset-0 bg-scan-slow pointer-events-none opacity-10" 
                     style={{backgroundImage: 'linear-gradient(to bottom, transparent, var(--delos-amber), transparent)', height: '10%'}} />
                
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{backgroundImage: 'radial-gradient(var(--delos-amber) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-12 rounded-full border border-delos-amber/20 bg-delos-amber/5 text-delos-amber animate-pulse">
                        <Terminal size={12} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Sistema_Operacional_V4.0.1</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-[120px] font-black leading-[0.85] tracking-tighter uppercase italic mb-8">
                        Domine a <br />
                        <span className="text-delos-amber">Engenharia</span> <br />
                        do Evento.
                    </h1>

                    <p className="max-w-2xl mx-auto text-delos-grey text-xs md:text-sm uppercase tracking-[0.3em] leading-loose font-bold mb-12">
                        O FreelaCerto Business não é uma ferramenta. É a arquitetura de dados que sustenta a sua produtora em escala global.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-delos-amber text-black px-10 py-5 font-black text-[10px] tracking-[0.3em] uppercase hover:shadow-[0_0_40px_rgba(217,119,6,0.3)] transition-all flex items-center justify-center gap-3">
                            Iniciar_Sincronização <ArrowRight size={14} />
                        </button>
                        <button className="border border-white/10 hover:border-white/30 text-white px-10 py-5 font-black text-[10px] tracking-[0.3em] uppercase transition-all">
                            Ver_Documentação_Técnica
                        </button>
                    </div>
                </div>
            </section>

            {/* --- TECH STACK: OS NÚCLEOS --- */}
            <section className="py-32 px-6 bg-delos-surface text-delos-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">NÚCLEO DE PROCESSAMENTO_</h2>
                            <p className="text-delos-grey text-xs uppercase tracking-widest font-bold">Otimize a gestão de hosts com precisão de milissegundos.</p>
                        </div>
                        <div className="text-[10px] font-black text-delos-amber bg-delos-black px-4 py-2 uppercase tracking-widest">
                            Status: Operacional
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-1">
                        {[
                            { icon: <Zap />, title: "Automação_Fluxo", desc: "Sincronização direta com gateways PIX para pagamentos em lote sem fricção." },
                            { icon: <ShieldCheck />, title: "Integridade_Dados", desc: "Criptografia de ponta a ponta e logs de auditoria imutáveis para cada ação." },
                            { icon: <Database />, title: "Matriz_Offline", desc: "Acesse sua base de dados completa mesmo em ambientes sem conectividade." },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-12 border border-delos-black/5 hover:bg-delos-amber hover:text-white transition-all group">
                                <div className="mb-8 group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-lg font-black uppercase mb-4 tracking-tighter italic">{feature.title}</h3>
                                <p className="text-[10px] uppercase font-bold tracking-[0.15em] leading-relaxed opacity-70">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD VIEW: O CONTROLE --- */}
            <section className="py-32 px-6 bg-delos-black relative overflow-hidden">
                <div className="max-w-5xl mx-auto border border-white/10 rounded-lg overflow-hidden bg-delos-surface-elevated shadow-2xl">
                    <div className="bg-delos-black px-6 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/20" />
                            <div className="w-2 h-2 rounded-full bg-delos-amber/20" />
                            <div className="w-2 h-2 rounded-full bg-delos-success/20" />
                        </div>
                        <span className="text-[8px] text-delos-grey font-black tracking-[0.5em] uppercase">Visualizador_Global_De_Recursos</span>
                    </div>
                    <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Taxa_Conversão", val: "94.2%", color: "text-delos-success" },
                            { label: "Hosts_Ativos", val: "1,240", color: "text-white" },
                            { label: "Eventos_Mês", val: "48", color: "text-white" },
                            { label: "Eficiência_Custo", val: "-12%", color: "text-delos-amber" },
                        ].map((stat, i) => (
                            <div key={i} className="border border-white/5 p-6 bg-black/20">
                                <p className="text-[8px] text-delos-grey font-black uppercase mb-2 tracking-widest">{stat.label}</p>
                                <p className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</p>
                            </div>
                        ))}
                    </div>
                    {/* Placeholder para Gráfico */}
                    <div className="px-10 pb-10">
                         <div className="h-32 border-b border-l border-white/10 relative flex items-end gap-1">
                            {Array.from({length: 40}).map((_, i) => (
                                <div key={i} className="bg-delos-amber/20 hover:bg-delos-amber w-full transition-all" style={{height: `${Math.random() * 100}%`}}></div>
                            ))}
                         </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING REDESIGNED --- */}
            <section className="py-32 px-6 bg-white text-delos-black">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-6 underline decoration-delos-amber decoration-4 underline-offset-8">Escolha seu Protocolo</h2>
                    <p className="text-delos-grey text-xs uppercase font-bold tracking-widest">Escalabilidade adaptada à necessidade do seu ecossistema.</p>
                </div>
                <PricingSection />
            </section>

          
        </div>
    );
}