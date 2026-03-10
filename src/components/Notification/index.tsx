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
  const configs = {
    success: { icon: CheckCircle2, color: "text-emerald-500", border: "border-emerald-500/40", bar: "bg-emerald-500", label: "OK" },
    error: { icon: ShieldAlert, color: "text-rose-600", border: "border-rose-600/40", bar: "bg-rose-600", label: "ERR" },
    info: { icon: Terminal, color: "text-amber-500", border: "border-amber-500/40", bar: "bg-amber-500", label: "LOG" },
    warning: { icon: AlertCircle, color: "text-amber-600", border: "border-amber-600/40", bar: "bg-amber-600", label: "WRN" },
  };

  const config = configs[item.type] || configs.info;

  useEffect(() => {
    const timer = setTimeout(() => onClose(item.id), item.duration || 5000);
    return () => clearTimeout(timer);
  }, [item, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`
        relative flex items-center gap-3 px-3 py-1.5 
        bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 
        border-l-2 ${config.border} shadow-lg pointer-events-auto
      `}
    >
      {/* Timer Bar Minimalista */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (item.duration || 5000) / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[1px] ${config.bar} opacity-30`}
      />

      {/* Ícone e Conteúdo em Linha */}
      <config.icon className={`${config.color} w-3.5 h-3.5 flex-shrink-0`} />

      <div className="flex items-center gap-2 overflow-hidden">
        <span className={`text-[7px] font-black font-mono tracking-tighter ${config.color} opacity-80`}>
          {config.label}
        </span>
        <p className="text-[10px] font-medium text-slate-300 truncate max-w-[200px] sm:max-w-[400px]">
          {item.message}
        </p>
      </div>

      <button
        onClick={() => onClose(item.id)}
        className="ml-2 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X size={12} />
      </button>
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