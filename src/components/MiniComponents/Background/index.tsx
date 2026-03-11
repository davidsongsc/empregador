"use client";
import React from "react";

const DelosBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-delos-surface overflow-hidden">
      {/* 1. O GRID TÉCNICO (Cálculos de Engenharia) */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `
            linear-gradient(var(--delos-amber) 1px, transparent 1px),
            linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} 
      />
      
      {/* 2. CÍRCULOS DE CALIBRAGEM (Referência ao Vitruvian Man do Westworld) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-delos-amber/10 rounded-full animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-delos-amber/5 rounded-full rotate-45 border-dashed" />
      
      {/* 3. PARTÍCULAS DE DADOS (Sinapses) */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-delos-amber/40 rounded-full blur-[1px] animate-float"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 10 + 10 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* 4. SCANNER VERTICAL (Protocolo de Diagnóstico) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-delos-amber/20 to-transparent animate-scan-slow" />

      {/* 5. TEXTO DE CÓDIGO SUBTIL (Logs de Sistema) */}
      <div className="absolute bottom-10 left-10 font-mono text-[8px] text-delos-grey/20 uppercase tracking-[0.5em] space-y-1 select-none">
        <p>System.Init(Host_01)</p>
        <p>Calibration: 98.4%</p>
        <p>Status: Synchronizing_Dream</p>
      </div>

      {/* VIGNETTE (Escurece as bordas para focar no Modal) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default DelosBackground;