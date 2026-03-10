"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Lock, BrainCircuit, Activity, Terminal } from 'lucide-react';
import LogoFreelaCerto from '../MiniComponents/Logo';

const LOADING_STEPS = [
    { icon: ShieldCheck, text: "CALIBRANDO_CONEXÃO", desc: "Integridade de Rede: 100%" },
    { icon: Lock, text: "VERIFICANDO_CREDENCIAIS", desc: "Hash de Segurança v3.2.1" },
    { icon: Globe, text: "SINCRONIZANDO_REDE", desc: "Latência: 12ms | Cluster: West" },
    { icon: Zap, text: "CONSTRUINDO_AMBIENTE", desc: "Compilando Matriz do Host" },
];

const AuthLoadingScreen = () => {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1500);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                const next = prev < 99 ? prev + Math.random() * 3 : 99;
                return next;
            });
        }, 80);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    const CurrentIcon = LOADING_STEPS[step].icon;

    return (
        <div
            style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-700"
        >

            {/* BACKGROUND: GRID DE CALIBRAÇÃO DELOS */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(var(--delos-black) 1px, transparent 1px), linear-gradient(90deg, var(--delos-black) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />

                {/* Geometria de Scanner Orbital */}
                <svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] md:w-[100%] md:h-[100%] opacity-20">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.05" fill="none" className="animate-pulse" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.1" fill="none" strokeDasharray="2,4" />
                    <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.02" fill="none" />
                </svg>
            </div>

            <div className="relative flex flex-col items-center max-w-sm w-full z-10">

                {/* LOGO CENTRAL: O NÚCLEO (Estética Industrial) */}
                <div className="relative mb-12">
                    {/* Glow de Atividade */}
                    <div
                        style={{ backgroundColor: 'var(--delos-indigo)' }}
                        className="absolute inset-0 rounded-full blur-[60px] opacity-10 animate-pulse"
                    />

                    <motion.div
                        animate={{ scale: [0.98, 1.02, 0.98] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-60 h-60 p-10 rounded-full border border-black/10 dark:border-white/10 bg-[var(--delos-surface)] shadow-2xl flex items-center justify-center"
                    >
                        <LogoFreelaCerto />

                        {/* Scanner Line interna */}
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[var(--delos-indigo)]/30 animate-[scan_2s_infinite]" />
                    </motion.div>

                    {/* Anéis de Rotação Técnicos */}
                    <div className="absolute -inset-6 border border-t-[var(--delos-amber)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute -inset-6 border border-black/[0.05] dark:border-white/[0.05] rounded-full" />
                </div>

                {/* PAINEL DE TELEMETRIA */}
                <div className="w-full text-center space-y-6">

                    <div className="space-y-1">
                        <h1 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40 leading-none">
                            Melhore a perfomance do seu time
                        </h1>
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-lg font-black italic tracking-tighter uppercase">Loading_Page</span>
                            <div className="w-1 h-1 bg-[var(--delos-amber)] rounded-full animate-ping" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="flex items-center gap-3 text-[var(--delos-indigo)]">
                                    <CurrentIcon className="w-4 h-4" />
                                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em]">
                                        {LOADING_STEPS[step].text}
                                    </h2>
                                </div>

                                <div className="px-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-sm">
                                    <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal size={10} /> {LOADING_STEPS[step].desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* BARRA DE CARREGAMENTO (Estética Westworld) */}
                    <div className="mt-8">
                        <div className="relative h-[2px] w-full bg-black/5 dark:bg-white/5 overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-[var(--delos-black)]"
                                style={{ width: `${progress}%` }}
                            />
                            {/* Reflexo de luz na barra */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                        </div>

                        <div className="mt-4 flex justify-between items-center px-1">
                            <div className="flex items-center gap-2 opacity-30">
                                <Activity size={10} />
                                <span className="text-[8px] font-mono uppercase tracking-tighter">Unit_Authorization::Verified</span>
                            </div>
                            <span className="text-xs font-black italic tracking-tighter">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>

                {/* FOOTER: INDICADORES GEOMÉTRICOS DE SEGURANÇA */}
                <div className="mt-16 flex items-center gap-6 opacity-20">
                    <div className="w-1.5 h-1.5 border border-current rounded-full" />
                    <div className="w-12 h-[1px] bg-current" />
                    <div className="w-1.5 h-1.5 border border-current rotate-45" />
                    <div className="w-12 h-[1px] bg-current" />
                    <div className="w-1.5 h-1.5 border border-current rounded-full" />
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-30px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(30px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default React.memo(AuthLoadingScreen);