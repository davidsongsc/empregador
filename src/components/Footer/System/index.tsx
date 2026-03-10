import React from "react";

export const FooterHUD = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-2.5 px-6 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center z-30">
      {/* LADO ESQUERDO: STATUS DO SISTEMA */}
      <div className="flex items-center gap-4 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
        <span className="flex items-center gap-2 text-amber-900/50">
          {/* O Indicador Pulsante: Herança Visual do Delos */}
          <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse rounded-full shadow-[0_0_5px_rgba(217,119,6,0.8)]" />
          SISTEMA OPERACIONAL ATIVO
        </span>
        <span className="hidden md:block opacity-30">| DELOS_SECURE_LAYER_V.4</span>
      </div>

      {/* LADO DIREITO: CITAÇÃO/EASTER EGG */}
      <div className="text-[8px] font-mono text-slate-600 italic opacity-40 hover:opacity-100 transition-opacity cursor-default">
        "A maioria das pessoas vive num mundo que é um simulacro do real."
      </div>
    </footer>
  );
};