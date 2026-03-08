"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, Bell, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp, Zap, ShieldAlert } from "lucide-react";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  details?: string;
  duration?: number;
}

let observers: ((notifications: NotificationItem[]) => void)[] = [];
let notifications: NotificationItem[] = [];

const notify = () => observers.forEach((obs) => obs([...notifications]));

export const toast = {
  show: (message: string, type: NotificationType = "info", title?: string, details?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    notifications.push({ id, message, type, title, details, duration: 5000 });
    notify();
  },
  success: (msg: string, title = "Sincronização Concluída") => toast.show(msg, "success", title),
  error: (msg: string, title = "Falha de Sistema") => toast.show(msg, "error", title),
  info: (msg: string, title = "Log de Sistema") => toast.show(msg, "info", title),
  warning: (msg: string, title = "Aviso de Protocolo") => toast.show(msg, "warning", title),
};

const NotificationCard = ({ item, onClose }: { item: NotificationItem; onClose: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const configs = {
    success: { icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/30", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", bar: "bg-emerald-500" },
    error: { icon: ShieldAlert, color: "text-rose-500", border: "border-rose-500/30", glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]", bar: "bg-rose-500" },
    info: { icon: Zap, color: "text-amber-500", border: "border-amber-500/30", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]", bar: "bg-amber-500" },
    warning: { icon: AlertCircle, color: "text-amber-600", border: "border-amber-600/30", glow: "shadow-[0_0_15px_rgba(217,119,6,0.15)]", bar: "bg-amber-600" },
  };

  const config = configs[item.type] || configs.info;

  useEffect(() => {
    if (!isExpanded) {
      const timer = setTimeout(() => onClose(item.id), item.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [item, onClose, isExpanded]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`
        relative w-full bg-[#0A0A0A] border ${config.border} ${config.glow}
        overflow-hidden pointer-events-auto transition-all duration-500
        ${isExpanded
          ? "fixed inset-0 z-[100000] sm:relative sm:inset-auto h-screen sm:h-auto flex flex-col justify-center p-12 bg-[#080808]/95 backdrop-blur-xl"
          : "p-5 sm:max-w-xs min-h-[80px] flex flex-col justify-center"
        }
      `}
    >
      {/* Scanline Effect (apenas no tema Westworld) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

      <div className={`flex items-start gap-4 relative z-10 ${isExpanded ? "flex-col items-center text-center" : "flex-row"}`}>
        
        {/* Barra de Progresso Estilo Terminal */}
        {!isExpanded && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: (item.duration || 5000) / 1000, ease: "linear" }}
            className={`absolute top-0 left-0 h-[1px] ${config.bar} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
          />
        )}

        {/* Ícone com Pulso de Status */}
        <div className={`flex-shrink-0 ${config.color} p-1`}>
          <config.icon className={`${isExpanded ? "w-12 h-12 mb-4" : "w-5 h-5"} animate-pulse`} />
        </div>

        {/* Conteúdo de Texto */}
        <div className="flex-1 min-w-0">
          {item.title && (
            <h3 className={`font-black uppercase tracking-[0.2em] italic mb-1 ${config.color} ${isExpanded ? "text-sm" : "text-[9px]"}`}>
              {item.title}
            </h3>
          )}
          <p className={`font-bold tracking-tight text-slate-300 ${isExpanded ? "text-xl leading-relaxed italic" : "text-[12px] leading-snug"}`}>
            {item.message}
          </p>

          {item.details && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase mt-3 hover:text-amber-500 transition-colors tracking-[0.2em]"
            >
              {isExpanded ? <><ChevronUp className="w-3 h-3" /> Fechar Log</> : <><ChevronDown className="w-3 h-3" /> Abrir Dossiê</>}
            </button>
          )}

          <AnimatePresence>
            {isExpanded && item.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-6 text-sm font-light text-slate-500 leading-relaxed border-t border-white/5 mt-6 italic"
              >
                {item.details}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botão Fechar Estilo Minimalista */}
        <button
          onClick={(e) => { e.stopPropagation(); isExpanded ? setIsExpanded(false) : onClose(item.id); }}
          className="text-slate-700 hover:text-white transition-all p-1 hover:bg-white/5 rounded flex-shrink-0"
        >
          <X className={isExpanded ? "w-6 h-6" : "w-4 h-4"} />
        </button>
      </div>
    </motion.div>
  );
};

export const Notification = () => {
  const [list, setList] = useState<NotificationItem[]>([]);

  useEffect(() => {
    observers.push(setList);
    return () => { observers = observers.filter((o) => o !== setList); };
  }, []);

  const remove = useCallback((id: string) => {
    notifications = notifications.filter((n) => n.id !== id);
    notify();
  }, []);

  return (
    <div className="fixed top-6 right-6 z-[99999] w-full sm:w-auto h-auto pointer-events-none flex flex-col items-end gap-3 px-6 sm:px-0">
      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          {list.map((item) => (
            <NotificationCard key={item.id} item={item} onClose={remove} />
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};