"use client";
import React from "react";
import { motion } from "framer-motion";

const DelosSpaceTimeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020202] overflow-hidden pointer-events-none">

      {/* 1. O TECIDO (Com correção de compatibilidade de máscara) */}
      <div
        className="absolute inset-0 opacity-20" // Aumentei para 0.20 para teste inicial
        style={{
          perspective: "1000px",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          // FIX DE COMPATIBILIDADE:
          WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
          transform: 'rotateX(25deg) scale(1.5)', 
        }}
      />

      {/* 2. CÍRCULOS DE CALIBRAGEM (Curvatura) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.2, 0],
              scale: [0.5, 2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute border border-white/20 rounded-full"
            style={{
              width: `${(i + 1) * 300}px`,
              height: `${(i + 1) * 300}px`,
            }}
          />
        ))}
      </div>

      {/* 3. PONTOS DE LUZ (Estrelas/Dados) */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
            }}
            className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full shadow-[0_0_3px_white]"
            style={{
              top: `${(i * 7.7) % 100}%`,
              left: `${(i * 13.3) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* 4. SCANNER (Horizonte de Eventos) */}
      <motion.div
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* VIGNETTE (Sombreamento das bordas) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
    </div>
  );
};

export default DelosSpaceTimeBackground;