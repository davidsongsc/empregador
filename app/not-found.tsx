"use client";

import Link from 'next/link';
import { Search, ArrowLeft, Terminal, Cpu, ShieldAlert, ScanLine } from 'lucide-react';
import Header from '@/components/Header';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--delos-surface)] font-mono text-[var(--delos-black)] relative overflow-hidden transition-colors duration-500 flex flex-col">
            
            {/* GRID DECORATIVO - Usando a variável âmbar do tema */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
                backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
            }} />

            <Header />

            <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
                
                {/* CONTAINER DE ERRO CRÍTICO */}
                <div className="max-w-md w-full text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                    
                    <div className="relative inline-block">
                        {/* Frame Industrial / Unidade de Processamento */}
                        <div className="w-48 h-48 bg-[var(--delos-black)] flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.2)] border-2 border-[var(--delos-amber)]/20">
                            <Cpu className="w-20 h-20 text-[var(--delos-amber)] animate-pulse opacity-20" />
                            
                            {/* Overlay 404 Estilo Glitch */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--delos-red)]/5 backdrop-blur-[1px]">
                                <span className="text-[var(--delos-red)] font-black text-6xl italic tracking-tighter leading-none">
                                    404
                                </span>
                                <span className="text-[var(--delos-red)] text-[8px] font-black uppercase tracking-[0.4em] mt-2">
                                    Null_Reference
                                </span>
                            </div>

                            {/* Scanline Animada (CSS Puro) */}
                            <div className="absolute inset-0 w-full h-[2px] bg-[var(--delos-amber)]/30 top-0 animate-[scanline_4s_linear_infinite]" />
                        </div>

                        {/* Tag de Status Flutuante */}
                        <div className="absolute -top-4 -left-4 bg-[var(--delos-red)] text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            <ShieldAlert size={10} /> Sector_Invalid
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-3 opacity-50">
                            <Terminal size={14} className="text-[var(--delos-amber)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System_Log: 0x404_NOT_FOUND</span>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                                Link_<span className="text-[var(--delos-amber)]">Corrompido</span>
                            </h2>
                            <p className="text-[var(--delos-grey)] text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                                A coordenada solicitada não faz parte do mainframe FreelaCerto ou o host foi desativado.
                            </p>
                        </div>
                    </div>

                    {/* ACTIONS: BOTOES ESTILO DELOS */}
                    <div className="pt-4 flex flex-col gap-3">
                        <Link
                            href="/"
                            className="group relative w-full bg-[var(--delos-black)] text-[var(--delos-surface)] py-5 px-8 font-black text-xs uppercase tracking-[0.5em] flex items-center justify-center gap-3 hover:bg-[var(--delos-amber)] hover:text-black transition-all overflow-hidden active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> 
                            Reboot_Mainframe
                        </Link>

                        <Link
                            href="/vagas"
                            className="w-full bg-transparent border-2 border-[var(--delos-black)] text-[var(--delos-black)] py-4 px-8 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[var(--delos-black)] hover:text-white transition-all"
                        >
                            <Search className="w-4 h-4" /> Buscar_Novos_Nós
                        </Link>
                    </div>

                    {/* STATUS DE CONEXÃO */}
                    <div className="pt-4 flex items-center justify-center gap-6 opacity-30">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-[var(--delos-amber)] rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Delos_White_Link</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-[var(--delos-red)] rounded-full" />
                            <span className="text-[8px] font-black uppercase tracking-widest italic">Node_Offline</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* DECORAÇÃO LATERAL TÉCNICA */}
            <div className="hidden xl:flex absolute right-12 top-0 bottom-0 flex-col items-center justify-center gap-8 opacity-10">
                <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[var(--delos-black)] to-transparent" />
                <span className="text-[9px] [writing-mode:vertical-lr] font-black uppercase tracking-[1em] py-8">
                    DATA_RECOVERY_PROTOCOL_v.4.0
                </span>
                <div className="w-[1px] flex-1 bg-gradient-to-b from-transparent via-[var(--delos-black)] to-transparent" />
            </div>

            <style jsx>{`
                @keyframes scanline {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    );
}