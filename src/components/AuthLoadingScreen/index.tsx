"use client";

import React, { useEffect, useState } from 'react';
import { Briefcase, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

const LOADING_STEPS = [
    { icon: ShieldCheck, text: "Estabelecendo conexão...", color: "text-blue-500" },
    { icon: Lock, text: "Validando credenciais...", color: "text-indigo-500" },
    { icon: Globe, text: "Sincronizando com a rede...", color: "text-emerald-500" },
    { icon: Zap, text: "Preparando seu ambiente...", color: "text-amber-500" },
];

const AuthLoadingScreen = () => {
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(0);

    // Ciclo de mensagens dinâmicas
    useEffect(() => {
        const stepInterval = setInterval(() => {
            setStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1500);

        const progressInterval = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 1 : prev));
        }, 50);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const CurrentIcon = LOADING_STEPS[step].icon;

    return (
        <div className="fixed inset-0 bg-slate-50 z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Decorativo Animado */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />

            <div className="relative flex flex-col items-center max-w-sm w-full">

                {/* LOGO CENTRAL COM ANIMAÇÃO DE PULSO */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-2xl opacity-20 animate-ping" />
                    <div className="relative bg-white p-5 rounded-[2rem] shadow-2xl border border-white">
                        <Briefcase className="w-12 h-12 text-indigo-600 animate-bounce" />
                    </div>
                </div>

                {/* CARD DE INFORMAÇÕES DINÂMICAS */}
                <div className="w-full bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center">

                    {/* Ícone do Step Atual com Transição */}
                    <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-2xl bg-white shadow-sm ${LOADING_STEPS[step].color} transition-all duration-500 transform scale-110`}>
                            <CurrentIcon className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Texto Dinâmico */}
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-2 min-h-[20px] transition-all">
                        {LOADING_STEPS[step].text}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Aguarde um instante
                    </p>

                    {/* BARRA DE PROGRESSO "INTELIGENTE" */}
                    <div className="mt-8 relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between items-center px-1">
                        <span className="text-[9px] font-black text-indigo-600/50 uppercase tracking-tighter">Status: Ativo</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{progress}%</span>
                    </div>
                </div>

                {/* FOOTER DO LOADING */}
                <div className="mt-12 flex items-center gap-2 opacity-40">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
            </div>

            <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

export default React.memo(AuthLoadingScreen);