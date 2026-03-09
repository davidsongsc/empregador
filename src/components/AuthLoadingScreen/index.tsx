"use client";

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Zap, Globe, Lock, BrainCircuit } from 'lucide-react';

const LOADING_STEPS = [
    { icon: ShieldCheck, text: "CALIBRANDO CONEXÃO", desc: "Integridade de Rede: 100%" },
    { icon: Lock, text: "VERIFICANDO CREDENCIAIS", desc: "Hash de Segurança v3.2.1" },
    { icon: Globe, text: "SINCRONIZANDO REDE", desc: "Latência: 12ms | Cluster: West" },
    { icon: Zap, text: "CONSTRUINDO AMBIENTE", desc: "Compilando Matriz do Host" },
];

const AuthLoadingScreen = () => {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1800);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const next = prev < 98 ? prev + Math.random() * 2 : 98;
                return next;
            });
        }, 100);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const CurrentIcon = LOADING_STEPS[step].icon;

    return (
        <div className="fixed inset-0 bg-[#FDFDFD] z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden">
            
            {/* BACKGROUND CLÍNICO: GRADE DE CALIBRAÇÃO SUTIL */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
                
                {/* Abstração orgânica em cinza */}
                <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]">
                    <circle cx="50" cy="30" r="15" stroke="black" strokeWidth="0.2" fill="none" className="animate-pulse" />
                    <path d="M50 45 L50 75 M30 60 L70 60" stroke="black" strokeWidth="0.1" fill="none" />
                    <ellipse cx="50" cy="85" rx="25" ry="10" stroke="black" strokeWidth="0.2" fill="none" className="animate-pulse [animation-delay:-0.5s]" />
                </svg>
            </div>

            <div className="relative flex flex-col items-center max-w-sm w-full">

                {/* LOGO CENTRAL: O CORE (Estética Industrial Clean) */}
                <div className="relative mb-16 group">
                    {/* Sombra suave de profundidade */}
                    <div className="absolute inset-0 bg-black/5 rounded-full blur-2xl opacity-40 animate-pulse" />
                    
                    <div className="relative p-7 rounded-full border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                        <BrainCircuit className="w-12 h-12 text-black/80 animate-pulse" strokeWidth={1} />
                    </div>
                    
                    {/* Anel de rotação orbital */}
                    <div className="absolute -inset-4 border border-t-black/20 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow" style={{ animationDuration: '4s' }} />
                    <div className="absolute -inset-4 border border-black/[0.03] rounded-full" />
                </div>

                {/* INFO PANEL */}
                <div className="w-full text-center space-y-4">
                    
                    <h1 className="text-sm font-black text-black uppercase tracking-[0.6em] mb-6 leading-none opacity-90">
                        Processando Identidade
                    </h1>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 text-black/60">
                            <CurrentIcon className="w-3.5 h-3.5" strokeWidth={2} />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
                                {LOADING_STEPS[step].text}
                            </h2>
                        </div>
                        
                        {/* Status Log - Estética Mono Terminal */}
                        <div className="px-3 py-1 bg-black/[0.03] rounded-md border border-black/[0.05]">
                            <p className="text-[9px] font-mono text-black/40 uppercase tracking-widest">
                                {">"} {LOADING_STEPS[step].desc}
                            </p>
                        </div>
                    </div>

                    {/* BARRA DE PROGRESSO: Estética de "Corte" ou "Preenchimento de Fluído" */}
                    <div className="mt-12 relative h-1.5 w-full bg-black/[0.03] rounded-full overflow-hidden border border-black/[0.05]">
                        <div
                            className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between items-center px-1">
                        <span className="text-[8px] font-mono text-black/30 uppercase tracking-tighter">Diagnostic Unit: 04</span>
                        <span className="text-[10px] font-black text-black uppercase tracking-widest">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* FOOTER: INDICADORES GEOMÉTRICOS */}
                <div className="mt-16 flex items-center gap-4">
                    <div className="w-1 h-1 bg-black/10 rounded-full" />
                    <div className="w-8 h-[1px] bg-black/10" />
                    <div className="w-1 h-1 bg-black/10 rounded-full" />
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(AuthLoadingScreen);