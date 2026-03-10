"use client";

import {
    BarChart3,
    FileSpreadsheet,
    ShieldCheck,
    Zap,
    FileCheck,
    Users,
    ArrowRight,
    TrendingUp,
    Download,
    Lock,
    MousePointerClick,
    CheckCircle,
    Terminal,
    Binary,
    Activity,
    Cpu
} from "lucide-react";
import PricingSection from "@/components/PageComponents/PricingSection";

export default function BusinessPlanPage() {
    return (
        <div className="bg-delos-surface text-delos-black antialiased font-mono">

            {/* --- HERO SECTION: O POSICIONAMENTO --- */}
            <section className="relative overflow-hidden bg-delos-black pt-32 pb-40 border-b border-white/5">
                {/* Calibration Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
                    backgroundImage: 'linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }} />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-lg bg-delos-amber/10 border border-delos-amber/20 text-delos-amber">
                            <Cpu size={14} className="animate-spin-slow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Arquitetura_Corporativa_v4</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none italic tracking-tighter uppercase">
                            OPERAÇÃO EM <br />
                            <span className="text-delos-amber drop-shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                                MATRIZ_DADOS.
                            </span>
                        </h1>
                        
                        <p className="text-delos-grey text-lg max-w-3xl mx-auto leading-relaxed uppercase tracking-widest font-bold">
                            O Plano Business transcende o gerenciamento manual. 
                            Converta sua produtora em um ecossistema de dados autônomo.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                            <button className="bg-delos-amber text-white px-12 py-6 rounded-xl font-black text-xs tracking-[0.3em] uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] flex items-center gap-3 mx-auto">
                                ATIVAR_PROTOCOLO_BUSINESS
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- OS TRÊS PILARES TÉCNICOS --- */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12">

                    {/* Pilar 1: Conforto Financeiro */}
                    <div className="group p-10 bg-white border border-white/10 hover:border-delos-amber hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-delos-black">
                            <Binary size={60} />
                        </div>
                        <div className="w-16 h-16 bg-delos-black text-delos-amber rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Sincronização_Lote_PIX</h3>
                        <p className="text-delos-grey text-xs leading-relaxed uppercase tracking-widest font-bold">
                            Gere fluxos de dados em <strong>.CSV</strong> compatíveis com os gateways bancários. 
                            Liquide 100 diárias em segundos. Erro humano: <span className="text-delos-black">0%</span>.
                        </p>
                    </div>

                    {/* Pilar 2: Backup & Segurança */}
                    <div className="group p-10 bg-white border border-white/10 hover:border-delos-amber transition-all relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-5 text-delos-black">
                            <ShieldCheck size={60} />
                        </div>
                        <div className="w-16 h-16 bg-delos-black text-delos-amber rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Backup_Matriz_Offline</h3>
                        <p className="text-delos-grey text-xs leading-relaxed uppercase tracking-widest font-bold">
                            O show não admite falhas. Exporte logs de presença em PDF/Excel. 
                            Seu domínio continua operando mesmo sem conexão com a rede global.
                        </p>
                    </div>

                    {/* Pilar 3: Liberdade Analítica */}
                    <div className="group p-10 bg-white border border-white/10 hover:border-delos-amber transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-delos-black">
                            <BarChart3 size={60} />
                        </div>
                        <div className="w-16 h-16 bg-delos-black text-delos-amber rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">Deep_Analytics_BI</h3>
                        <p className="text-delos-grey text-xs leading-relaxed uppercase tracking-widest font-bold">
                            Analise o rendimento de cada host. Tabelas dinâmicas, performance de staff e 
                            custo por cluster organizados para processamento externo.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD MOCKUP: CENTRO DE COMANDO --- */}
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto bg-delos-black rounded-3xl p-2 shadow-2xl border border-white/5">
                    <div className="bg-delos-surface rounded-[1.5rem] overflow-hidden">
                        <div className="p-6 border-b border-delos-black/5 bg-delos-black flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-delos-amber/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                            </div>
                            <span className="text-delos-grey text-[9px] font-black uppercase tracking-[0.4em]">Terminal_Analítico_FreelaCerto</span>
                        </div>
                        
                        <div className="p-10 grid md:grid-cols-4 gap-8">
                            <div className="bg-delos-black p-6 rounded-xl">
                                <p className="text-delos-grey text-[8px] font-black uppercase tracking-widest">Total_Payload_Staff</p>
                                <p className="text-2xl font-black text-white mt-2 italic">R$ 42.850,00</p>
                            </div>
                            <div className="bg-delos-black p-6 rounded-xl border-l-2 border-delos-amber">
                                <p className="text-delos-grey text-[8px] font-black uppercase tracking-widest">Sync_Efficiency</p>
                                <p className="text-2xl font-black text-delos-amber mt-2 italic">98.2%</p>
                            </div>
                            <div className="bg-delos-black p-6 rounded-xl">
                                <p className="text-delos-grey text-[8px] font-black uppercase tracking-widest">Active_Domains</p>
                                <p className="text-2xl font-black text-white mt-2 italic">12</p>
                            </div>
                            <div className="bg-delos-black p-6 rounded-xl">
                                <p className="text-delos-grey text-[8px] font-black uppercase tracking-widest">Registered_Hosts</p>
                                <p className="text-2xl font-black text-white mt-2 italic">154</p>
                            </div>
                        </div>

                        <div className="px-10 pb-10">
                            <div className="h-48 bg-delos-black/5 rounded-xl border border-delos-black/5 flex items-end p-6 gap-3">
                                <div className="w-full bg-delos-black h-[40%] group-hover:bg-delos-amber transition-colors"></div>
                                <div className="w-full bg-delos-black h-[70%]"></div>
                                <div className="w-full bg-delos-black h-[55%]"></div>
                                <div className="w-full bg-delos-amber h-[90%] animate-pulse"></div>
                                <div className="w-full bg-delos-black h-[30%]"></div>
                            </div>
                            <p className="text-center text-delos-grey mt-6 text-[9px] font-black uppercase tracking-[0.3em]">
                                Alocação de Recursos // Bar // Portaria // Produção // Logística
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES EXCLUSIVAS: O MANIFESTO --- */}
            <section className="py-32 bg-delos-black text-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <h2 className="text-5xl font-black leading-none italic uppercase tracking-tighter">
                                VOCÊ NÃO ESTÁ COMPRANDO <span className="text-delos-amber">SOFTWARE.</span> <br /> 
                                ESTÁ COMPRANDO <span className="underline decoration-delos-amber underline-offset-8">TEMPO.</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-lg bg-delos-amber/10 border border-delos-amber/20 flex items-center justify-center shrink-0 text-delos-amber group-hover:bg-delos-amber group-hover:text-white transition-all">
                                        <FileCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg uppercase italic tracking-widest">Smart_Contracts_WORD</h4>
                                        <p className="text-delos-grey text-[10px] uppercase font-bold tracking-widest mt-1">Geração instantânea de protocolos jurídicos personalizados.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-lg bg-delos-amber/10 border border-delos-amber/20 flex items-center justify-center shrink-0 text-delos-amber group-hover:bg-delos-amber group-hover:text-white transition-all">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg uppercase italic tracking-widest">Acesso_Elite_Staff</h4>
                                        <p className="text-delos-grey text-[10px] uppercase font-bold tracking-widest mt-1">Histórico de reputação e performance de hosts verificado.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-lg bg-delos-amber/10 border border-delos-amber/20 flex items-center justify-center shrink-0 text-delos-amber group-hover:bg-delos-amber group-hover:text-white transition-all">
                                        <Download size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg uppercase italic tracking-widest">Export_Full_BI_Stack</h4>
                                        <p className="text-delos-grey text-[10px] uppercase font-bold tracking-widest mt-1">Arquivos brutos preparados para Power BI e Tableau.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-delos-surface p-12 rounded-2xl border border-white/5 shadow-2xl relative">
                            <div className="absolute -top-4 -left-4 bg-delos-amber text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">Recomendado_pela_Matriz</div>
                            <h3 className="text-delos-black text-2xl font-black mb-8 italic uppercase tracking-tighter">Protocolo_Business</h3>
                            <div className="space-y-5 mb-12">
                                {["Eventos_Ilimitados", "Relatórios_Financeiros_Logs", "Suporte_Prioritário_Matrix", "Gestão_Ativa_Hosts"].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle size={14} className="text-delos-amber" />
                                        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-delos-black">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black text-delos-black italic tracking-tighter">R$ 347</span>
                                <span className="text-delos-grey text-xs uppercase font-black tracking-widest">/MÊS</span>
                            </div>
                            <button className="w-full bg-delos-black text-white py-6 rounded-xl font-black text-xs uppercase tracking-[0.4em] hover:bg-delos-amber hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] transition-all">
                                INICIAR_SINCRONIZAÇÃO
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <section className="py-32 text-center bg-delos-surface relative">
                <Lock size={32} className="mx-auto text-delos-grey mb-8 opacity-20" />
                <h2 className="text-3xl font-black mb-4 italic uppercase tracking-tighter">Operação sob Controle_Delos.</h2>
                <p className="text-delos-grey text-[10px] mb-12 max-w-md mx-auto font-black uppercase tracking-[0.2em]">
                    Migre do plano Start para o Business e assuma o controle total da infraestrutura de dados da sua produtora.
                </p>
                <div className="flex justify-center gap-8">
                    <button className="flex items-center gap-3 font-black text-delos-amber hover:gap-5 transition-all uppercase tracking-[0.4em] text-[10px]">
                        ABRIR_CANAL_SUPORTE <MousePointerClick size={14} />
                    </button>
                </div>
            </section>
            
            <PricingSection />
        </div>
    );
}

