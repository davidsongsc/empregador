"use client";
import { AlertTriangle, X, Terminal, PowerOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function WithdrawalModal({ 
  isOpen, onClose, onConfirm, loading 
}: WithdrawalModalProps) {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Overlay com Desfoque usando variáveis Delos */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-delos-black/90 backdrop-blur-md"
          />

          {/* Efeito de Scanline Animado (usando sua animação scan-slow) */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-delos-amber-glow animate-scan-slow z-[111]" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-delos-surface w-full max-w-md border border-delos-red/30 shadow-[0_0_60px_rgba(var(--delos-red),0.15)] overflow-hidden relative font-mono z-[112]"
          >
            
            {/* Header de Alerta - Protocolo de Interrupção */}
            <div className="p-4 bg-delos-red/5 border-b border-delos-red/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-delos-red animate-pulse" />
                <span className="text-[10px] font-black text-delos-red uppercase tracking-[0.4em]">Protocol_Abort_Req</span>
              </div>
              <button onClick={onClose} className="text-delos-subtext hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-10 space-y-8 text-center">
              {/* Ícone com Glow de Alerta */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-delos-red/10 rounded-full animate-ping opacity-20" />
                <div className="w-full h-full bg-delos-red/5 border border-delos-red/40 rounded-full flex items-center justify-center relative shadow-[0_0_20px_rgba(var(--delos-red),0.1)]">
                   <PowerOff size={28} className="text-delos-red" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-delos-texto text-xl font-black uppercase italic tracking-tighter leading-none">
                  Finalizar Vínculo Neural?
                </h2>
                <p className="text-delos-subtext text-[9px] uppercase leading-relaxed tracking-[0.2em] px-4">
                  Confirmar encerramento imediato desta candidatura. Seus dados de progresso nesta vaga serão arquivados.
                </p>
              </div>

              <div className="bg-delos-red/5 p-4 border border-delos-red/10 rounded-sm">
                 <p className="text-[8px] text-delos-red/80 font-mono uppercase tracking-tighter leading-tight">
                    Note: A operação mudará seu status para [WITHDRAWN]. A unidade de recrutamento será notificada da interrupção.
                 </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-4 bg-transparent border border-delos-border text-delos-subtext text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all"
                >
                  Continuar_Link
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-4 bg-delos-red text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-delos-red/80 transition-all shadow-[0_0_25px_rgba(var(--delos-red),0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Terminal size={12} className="animate-spin" />
                      Terminando...
                    </>
                  ) : "ABORTAR_SYNC"}
                </button>
              </div>
            </div>

            {/* Footer Técnico Estilo Delos - Versão Dark Surface Elevated */}
            <div className="px-5 py-2 bg-delos-surface-elevated border-t border-delos-border flex justify-between items-center">
               <span className="text-[7px] text-delos-subtext uppercase tracking-widest font-mono">ID: {Math.random().toString(36).slice(2, 9).toUpperCase()}</span>
               <div className="flex items-center gap-2">
                 <span className="w-1 h-1 bg-delos-red rounded-full animate-pulse" />
                 <span className="text-[7px] text-delos-red/60 uppercase tracking-widest font-mono italic">Sector: Deployment_Ops</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}