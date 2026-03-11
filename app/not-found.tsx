"use client";

import Link from 'next/link';
import { Search, ArrowLeft, Terminal, AlertTriangle, Cpu } from 'lucide-react';
import Header from '@/components/Header';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-delos-surface font-mono text-delos-black relative overflow-hidden transition-colors duration-500">
            
            {/* GRID DECORATIVO DE FUNDO - TECNOLOGIA DELOS */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] -z-10" style={{
                backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <Header />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 relative">
                
                {/* ELEMENTO CENTRAL: PROTOCOLO CORROMPIDO */}
                <div className="max-w-md w-full text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                    
                    <div className="relative inline-block">
                        {/* Frame Industrial */}
                        <div className="w-40 h-40 bg-delos-black flex items-center justify-center relative shadow-2xl">
                            <Cpu className="w-16 h-16 text-delos-amber animate-pulse" />
                            
                            {/* Overlay de Erro */}
                            <div className="absolute inset-0 flex items-center justify-center bg-delos-red/10 backdrop-blur-[2px]">
                                <span className="text-delos-red font-black text-5xl italic tracking-tighter animate-bounce">
                                    404
                                </span>
                            </div>
                        </div>

                        {/* Tag de Status */}
                        <div className="absolute -bottom-4 -right-4 bg-delos-amber text-delos-surface px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] shadow-lg">
                            Divergence_Detected
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 opacity-40">
                            <Terminal size={14} className="text-delos-amber" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocol_Error_303</span>
                        </div>
                        
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Unidade_<span className="text-delos-amber">Não_Localizada</span>
                        </h2>
                        
                        <p className="text-delos-grey text-[11px] uppercase tracking-[0.15em] leading-relaxed max-w-sm mx-auto">
                            O host ou oportunidade que você está tentando acessar foi re-alocado ou o protocolo de link foi corrompido.
                        </p>
                    </div>

                    {/* ACTIONS: OPOSIÇÃO TOTAL */}
                    <div className="pt-6 space-y-4">
                        <Link
                            href="/"
                            className="group relative w-full bg-delos-black text-delos-surface py-5 px-8 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-delos-amber transition-all overflow-hidden active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> 
                            Return_to_Mainframe
                            
                            {/* Efeito Scanline no hover */}
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>

                        <Link
                            href="/vagas"
                            className="w-full bg-transparent border border-delos-grey/30 text-delos-grey py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:border-delos-black hover:text-delos-black transition-all"
                        >
                            <Search className="w-4 h-4" /> Explorar_Outros_Nós
                        </Link>
                    </div>

                    {/* LOG DE SISTEMA (Sutil) */}
                    <div className="pt-8 flex items-center justify-center gap-4 opacity-20">
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-delos-amber rounded-full" />
                            <span className="text-[7px] font-black uppercase tracking-widest">Mem_Sync: Stable</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-delos-amber rounded-full animate-ping" />
                            <span className="text-[7px] font-black uppercase tracking-widest">Matrix_Link: Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRA LATERAL TÉCNICA (Decoração) */}
            <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 space-y-4 opacity-20">
                <div className="h-20 w-[1px] bg-delos-grey mx-auto" />
                <span className="text-[8px] [writing-mode:vertical-lr] font-black uppercase tracking-[0.8em]">
                    DELOS_WHITE_SYSTEM
                </span>
                <div className="h-20 w-[1px] bg-delos-grey mx-auto" />
            </div>
        </div>
    );
}