"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, CheckCircle2, Activity, Binary, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemePanel } from "../ThemeModal";

interface SelectCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SelectCompanyModal({ isOpen, onClose }: SelectCompanyModalProps) {
    const { user, setActiveCompany, activeCompanyId } = useAuthStore();
    const router = useRouter();
    const empresas = user?.profile?.memberships || [];

    const handleSelect = (id: string) => {
        setActiveCompany(id);
        // Feedback tátil antes do redirecionamento
        setTimeout(() => {
            onClose();
            //router.push(`/`);
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6">

                    {/* Backdrop com Blur Progressivo */}
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 cursor-crosshair"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-xl bg-[var(--delos-surface)] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                    >
                        {/* Grid de Calibração Interno */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:40px_40px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />

                        {/* Barra de Topo Estilo Terminal */}
                        <div className="bg-black/10 px-6 py-3 flex items-center justify-between border-b border-black/5">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[var(--delos-amber)] rounded-full animate-pulse" />
                                <span className="text-[9px] font-mono font-black text-black/40 uppercase tracking-[0.3em]">
                                    Terminal
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="hover:rotate-90 transition-transform duration-300 opacity-40 hover:opacity-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-8 relative z-10">
                            <header className="mb-8 space-y-2">
                                <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                                    Selecionar_<span className="opacity-30 tracking-widest text-delos-amber animate-pulse">Loja</span>
                                </h1>
                                <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.2em]">
                                    Selecione a unidade corporativa para sincronização de parâmetros.
                                </p>
                            </header>

                            {/* Lista Scrollável */}
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {empresas.map((emp, index) => {
                                    const isSelected = activeCompanyId === emp.company_id;

                                    return (
                                        <motion.button
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={emp.company_id}
                                            onClick={() => handleSelect(emp.company_id)}
                                            className={`
                        w-full group flex items-center justify-between p-5 rounded-sm border transition-all duration-300
                        ${isSelected
                                                    ? "border-black bg-black/[0.04] shadow-lg"
                                                    : "border-black/5 bg-transparent hover:border-black/20 hover:bg-black/[0.02]"}
                      `}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                          w-10 h-10 flex items-center justify-center border transition-all duration-300
                          ${isSelected
                                                        ? "bg-black text-white border-black"
                                                        : "bg-transparent text-black/20 border-black/10 group-hover:border-black group-hover:text-black"}
                        `}>
                                                    <Building2 size={18} strokeWidth={isSelected ? 3 : 2} />
                                                </div>

                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-base font-black uppercase italic tracking-tight leading-none">
                                                            {emp.company_name}
                                                        </p>
                                                        {isSelected && (
                                                            <CheckCircle2 size={12} className="text-[var(--delos-amber)]" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Binary size={8} className="opacity-20" />
                                                        <p className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-40">
                                                            Role::{emp.role || "Host"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <ArrowRight
                                                className={`transition-all duration-300 ${isSelected ? "text-[var(--delos-amber)] translate-x-0" : "opacity-0 -translate-x-4 group-hover:opacity-20 group-hover:translate-x-0"}`}
                                                size={16}
                                            />
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Status Footer */}
                            <footer className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between opacity-30">
                                <div className="flex items-center gap-2">
                                    <Activity size={10} />
                                    <span className="text-[7px] font-mono uppercase tracking-widest italic">Auth_Session::Active</span>
                                </div>
                                <span className="text-[7px] font-mono uppercase tracking-widest font-black">Delos_OS // v3.0</span>
                            </footer>
                        </div>

                        
                    </motion.div>

                </div>
            )}

          
        </AnimatePresence>
    );
}