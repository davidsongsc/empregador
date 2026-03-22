"use client";

import { useUIStore } from "@/store/useUiStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const LogoFreelaCerto = () => {
    const isScrolled = useUIStore((state) => state.isScrolled);

    // Configuração da animação de largura/opacidade
    const textVariants = {
        hidden: { width: 0, opacity: 0, marginLeft: 0 },
        visible: {
            width: "auto",
            opacity: 1,
            marginLeft: 4,
            transition: { duration: 1.3, ease: "easeOut" }
        },
        exit: {
            width: 0,
            opacity: 0,
            marginLeft: 0,
            transition: { duration: 0.5, ease: "easeIn" }
            
        }
    } as const;

    return (
        <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center group">
                <div className="flex items-center text-[11px] font-black tracking-[0.5em] uppercase italic overflow-hidden">

                    {/* Parte "Freela" */}
                    <span className={`flex items-center px-2 transition-all duration-700 ${isScrolled ? 'bg-black text-white' : 'bg-white text-black border border-black/10'
                        }`}>
                        <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                            <path d="M20 15 H75 V30 H40 V45 H70 V60 H40 V85 H20 Z" fill="currentColor" />
                            <path d="M45 70 L65 50 L65 60 L85 40 L65 20 L65 30 L45 50 Z" fill="currentColor" className="text-amber-500" />
                        </svg>

                        <AnimatePresence>
                            {!isScrolled && (
                                <motion.span
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="whitespace-nowrap inline-block"
                                >
                                    reela
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </span>

                    {/* Parte "Fácil" (ou Certo) */}
                    <span className={`flex items-center px-2 transition-all duration-700 ${!isScrolled ? 'bg-amber-600 text-white shadow-lg shadow-amber-200/50' : 'bg-gray-100 text-gray-400'
                        }`}>
                        <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                            <path d="M20 15 H75 V30 H40 V45 H70 V60 H40 V85 H20 Z" fill="currentColor" />
                            <path d="M70 20 L73 30 L83 33 L73 36 L70 46 L67 36 L57 33 L67 30 Z" fill="currentColor" className="text-amber-500" />
                        </svg>

                        <AnimatePresence>
                            {!isScrolled && (
                                <motion.span
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="whitespace-nowrap inline-block"
                                >
                                    acil
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </span>

                </div>
            </Link>
        </div>
    );
};

export default LogoFreelaCerto;