"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Zap, ShieldAlert, ChevronDown, ChevronUp, Terminal } from "lucide-react";

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
  success: (msg: string, title = "Process_Complete") => toast.show(msg, "success", title),
  error: (msg: string, title = "System_Failure") => toast.show(msg, "error", title),
  info: (msg: string, title = "Data_Log") => toast.show(msg, "info", title),
  warning: (msg: string, title = "Protocol_Alert") => toast.show(msg, "warning", title),
};

const NotificationCard = ({ item, onClose }: { item: NotificationItem; onClose: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const configs = {
    success: { icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/40", bar: "bg-emerald-500", label: "LOG_OK" },
    error: { icon: ShieldAlert, color: "text-rose-600", border: "border-rose-600/40", bar: "bg-rose-600", label: "CRITICAL" },
    info: { icon: Terminal, color: "text-amber-500", border: "border-amber-500/40", bar: "bg-amber-500", label: "STATUS" },
    warning: { icon: AlertCircle, color: "text-amber-600", border: "border-amber-600/40", bar: "bg-amber-600", label: "WARNING" },
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
      initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      className={`
        relative w-full bg-[#080808] border-l-2 ${config.border} shadow-2xl
        overflow-hidden pointer-events-auto transition-all duration-500
        ${isExpanded
          ? "fixed inset-0 z-[100000] sm:relative sm:inset-auto h-screen sm:h-auto flex flex-col justify-center p-12 bg-[#050505]/98 backdrop-blur-2xl"
          : "p-4 sm:max-w-[320px] min-h-[70px] flex flex-col justify-center border-t border-r border-b border-white/5"
        }
      `}
    >
      {/* Efeito de Scanline Interno */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_2px] opacity-10" />

      <div className={`flex items-start gap-4 relative z-10 ${isExpanded ? "flex-col items-center text-center" : "flex-row"}`}>
        
        {/* Timer Bar (Estilo Loading de Terminal) */}
        {!isExpanded && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: (item.duration || 5000) / 1000, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-[1px] ${config.bar} opacity-50`}
          />
        )}

        {/* Ícone de Status */}
        <div className={`flex-shrink-0 ${config.color} mt-0.5`}>
          <config.icon className={`${isExpanded ? "w-16 h-16 mb-6" : "w-4 h-4"}`} />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[8px] font-black px-1 py-0.5 bg-white/5 ${config.color} tracking-tighter`}>
              {config.label}
            </span>
            {item.title && (
              <h3 className={`font-mono uppercase tracking-[0.2em] ${isExpanded ? "text-lg" : "text-[9px] text-slate-400"}`}>
                {item.title}
              </h3>
            )}
          </div>
          
          <p className={`font-bold tracking-tight text-slate-200 ${isExpanded ? "text-2xl leading-relaxed font-light italic" : "text-[11px] leading-tight"}`}>
            {item.message}
          </p>

          {item.details && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center gap-1 text-[8px] font-black text-amber-600/60 uppercase mt-3 hover:text-amber-500 transition-colors tracking-[0.3em] font-mono"
            >
              {isExpanded ? <><ChevronUp className="w-3 h-3" /> Terminate_Log</> : <><ChevronDown className="w-3 h-3" /> Inspect_Dossier</>}
            </button>
          )}

          <AnimatePresence>
            {isExpanded && item.details && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-8 text-sm font-mono text-slate-500 leading-relaxed border-t border-white/5 mt-8 text-left w-full max-w-2xl mx-auto"
              >
                <span className="text-amber-600/40 block mb-2 text-[10px] tracking-widest uppercase font-black">// Sequence_Details</span>
                {item.details}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => { e.stopPropagation(); isExpanded ? setIsExpanded(false) : onClose(item.id); }}
          className="text-slate-700 hover:text-amber-600 transition-all p-1"
        >
          <X className={isExpanded ? "w-8 h-8" : "w-3 h-3"} />
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
    <div className="fixed top-8 right-8 z-[99999] w-full sm:w-auto flex flex-col items-end gap-2 px-6 sm:px-0 pointer-events-none">
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