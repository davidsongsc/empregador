"use client";
import { AlertTriangle, X, Terminal, Trash2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export function ConfirmationModal({ 
  isOpen, onClose, onConfirm, title, description, loading 
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />

      <div className="bg-[#0D0D0D] w-full max-w-md border border-red-900/30 shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden relative font-mono">
        
        {/* Header de Alerta */}
        <div className="p-4 bg-red-950/20 border-b border-red-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Critical_Action_Required</span>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white"><X size={16} /></button>
        </div>

        <div className="p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <Trash2 size={24} className="text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-white text-lg font-black uppercase italic tracking-tighter">{title}</h2>
            <p className="text-slate-500 text-[10px] uppercase leading-relaxed tracking-widest">
              {description}
            </p>
          </div>

          <div className="bg-black/40 p-3 border border-white/5 rounded-sm">
             <p className="text-[8px] text-red-400 font-mono uppercase tracking-tighter">
               Warning: Esta operação é irreversível na base de dados FreelaCerto.
             </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-transparent border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Abort_Operation
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "TERMINATING..." : "CONFIRM_DELETE"}
            </button>
          </div>
        </div>

        {/* Footer Técnico */}
        <div className="px-4 py-2 bg-black border-t border-white/5 flex justify-between">
           <span className="text-[7px] text-slate-700 uppercase tracking-widest font-mono">Auth_Level: Admin</span>
           <span className="text-[7px] text-red-900/50 uppercase tracking-widest font-mono italic">Sector: Core_Storage</span>
        </div>
      </div>
    </div>
  );
}