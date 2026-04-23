"use client";

import Link from 'next/link';
import { Fingerprint, ArrowRight, Loader2 } from 'lucide-react';
import SelectCompanyModal from '@/components/Modal/SelectCompany';
import { useState } from 'react';
import LogoFreelaCerto from '@/components/MiniComponents/Logo';
import { motion } from "framer-motion";
import DelosSpaceTimeBackground from '@/components/MiniComponents/Background';

export default function Unauthorized() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsOpen(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 font-sans tracking-tight overflow-hidden relative">

      {/* BACKGROUND DINÂMICO */}
      <DelosSpaceTimeBackground />
      {/* 2. CONTAINER PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-xl w-full bg-[#080808] p-10 md:p-16 rounded-none relative shadow-[0_0_90px_rgba(0,0,0,1)] text-center space-y-12 overflow-visible"
      >
        {/* --- LINHA VERMELHA CIRCULANTE (SVG BORDER ANIMATION) --- */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <motion.rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="none"
              stroke="#dc2626" // red-600
              strokeWidth="0.9"
              strokeDasharray="100 800" // Comprimento da linha e do espaço
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 1800 }} // Faz a linha correr o perímetro
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
          {/* Borda estática sutil de fundo para definir o limite */}
          <div className="absolute inset-0 border border-white/5" />
        </div>

        {/* 3. ÍCONE DE ESCANEAMENTO */}
        <div className="relative">
          <div className="w-28 h-28 border border-white/5 rounded-full flex items-center justify-center mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 border-t-2 border-red-600/80 animate-[spin_6s_linear_infinite] rounded-full" />
            <motion.div
              animate={{ translateY: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-bottom from-transparent via-red-950/40 to-transparent opacity-50"
            />
            <Fingerprint className="w-12 h-12 text-white/90 font-thin relative z-10" />
          </div>
        </div>

        {/* 4. BLOCO DE TEXTO */}
        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-3 text-red-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.4em] border border-red-950/50 bg-red-950/10">
            Acesso Negado
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3 }}>
            <div className="inline-flex items-center">
              <LogoFreelaCerto />
            </div>

          </motion.div>
          <p className="text-gray-400 font-light max-w-sm mx-auto leading-relaxed text-sm italic tracking-wide">
            "Narrative divergence detected. Your credentials do not permit access to this sector."
          </p>
        </div>

        {/* 5. AÇÕES */}
        <div className="grid gap-8 pt-6 relative z-10">
          <motion.button
            onClick={handleAuth}
            disabled={isAuthenticating}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
            whileTap={{ scale: 0.99 }}
            className="group relative bg-transparent border border-white/10 text-white py-4.5 font-bold text-[13px] uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isAuthenticating ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors" />
            )}
            {isAuthenticating ? "Verificando corporativo..." : "Autenticar Corporativo"}
          </motion.button>

          <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/5 opacity-60">
            <Link href="/" className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 hover:text-red-500 transition-colors">
              Terminal Inicial
            </Link>
            <Link href="/ajuda" className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 hover:text-white transition-colors">
              Suporte Técnico
            </Link>
          </div>
        </div>

        {/* 6. RODAPÉ */}
        <div className="absolute bottom-2 right-4">
          <motion.span
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-[8px] text-white/10 font-mono uppercase tracking-[0.4em]"
          >
            Host::Unknown_narrative_v9.2
          </motion.span>
        </div>
      </motion.div>

      <SelectCompanyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}