"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, CheckCircle2, AlertCircle, ShieldAlert, Terminal, Activity } from "lucide-react";

// --- Tipagem e Estado Global (Singleton) ---
export type NotificationType = "success" | "error" | "info" | "warning";

// Erro de Validação (Pydantic/FastAPI)
interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: any;
}

// Erro de Status Simples (Sessão encerrada, etc)
interface StatusError {
  status: number;
  message: string;
}

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string | { detail: ValidationError[] } | StatusError;
  duration?: number;
}

let observers: ((notifications: NotificationItem[]) => void)[] = [];
let notifications: NotificationItem[] = [];

const notify = () => observers.forEach((obs) => obs([...notifications]));

export const toast = {
  show: (message: string, type: NotificationType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    notifications.push({ id, message, type, duration });
    notify();
  },
  success: (msg: string) => toast.show(msg, "success"),
  error: (msg: string) => toast.show(msg, "error"),
  info: (msg: string) => toast.show(msg, "info"),
  warning: (msg: string) => toast.show(msg, "warning"),
};

// --- Sub-componente: Card de Notificação ---
const NotificationCard = ({ item, onClose }: { item: NotificationItem; onClose: (id: string) => void }) => {
  const configs = {
    success: { icon: CheckCircle2, color: "text-emerald-400", border: "border-emerald-500/50", bar: "bg-emerald-400", label: "ACCESS_GRANTED" },
    error: { icon: ShieldAlert, color: "text-rose-500", border: "border-rose-600/50", bar: "bg-rose-500", label: "SYS_CRITICAL" },
    info: { icon: Terminal, color: "text-sky-400", border: "border-sky-500/50", bar: "bg-sky-400", label: "DATA_LOG" },
    warning: { icon: AlertCircle, color: "text-amber-500", border: "border-amber-600/50", bar: "bg-amber-500", label: "PROTOCOL_INTRUSION" },
  };

  const config = configs[item.type] || configs.info;

  useEffect(() => {
    const timer = setTimeout(() => onClose(item.id), item.duration || 4000);
    return () => clearTimeout(timer);
  }, [item.id, item.duration, onClose]);

  const renderContent = () => {
    const msg = item.message;

    // CASO 1: String Simples
    if (typeof msg === "string") {
      return <p className="text-[11px] font-mono leading-tight text-slate-100/90 uppercase tracking-tight">{msg}</p>;
    }

    // CASO 2: Objeto de Erro de Validação ({ detail: [...] })
    if (msg && typeof msg === "object" && "detail" in msg) {
      return (
        <div className="flex flex-col gap-1.5 mt-1">
          {msg.detail.map((err, idx) => (
            <div key={idx} className="bg-white/5 p-1.5 border-l border-white/10">
              <span className="text-[9px] text-rose-400 font-bold block leading-none mb-1">
                {err.loc.filter(l => l !== "body").join(" > ")}
              </span>
              <p className="text-[10px] text-slate-300 leading-tight">{err.msg}</p>
            </div>
          ))}
        </div>
      );
    }

    // CASO 3: Objeto de Status ({ status, message })
    if (msg && typeof msg === "object" && "status" in msg) {
      return (
        <div className="flex flex-col gap-0.5 mt-0.5">
          <span className="text-[10px] font-bold text-white/40">HTTP_CODE: {msg.status}</span>
          <p className="text-[11px] font-mono text-slate-100 uppercase">{msg.message}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        relative flex items-start gap-3 px-4 py-3
        bg-[#050505]/95 backdrop-blur-xl border border-white/10
        border-l-2 ${config.border} shadow-[0_0_20px_rgba(0,0,0,0.6)]
        pointer-events-auto min-w-[300px] max-w-[400px] overflow-hidden
      `}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <config.icon className={`${config.color} w-4 h-4 mt-0.5 flex-shrink-0 animate-pulse`} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <span className={`text-[8px] font-black font-mono tracking-[0.2em] ${config.color} uppercase mb-1`}>
          {config.label}
        </span>

        {renderContent()}
      </div>

      <button onClick={() => onClose(item.id)} className="text-slate-500 hover:text-white transition-colors">
        <X size={14} strokeWidth={3} />
      </button>

      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (item.duration || 4000) / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[1px] ${config.bar} opacity-30`}
      />
    </motion.div>
  );
};

// --- Componente Container ---
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
    <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-2 pointer-events-none select-none">
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