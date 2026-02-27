"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, Bell, CheckCircle2, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

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
  success: (msg: string, title = "Sucesso!") => toast.show(msg, "success", title),
  error: (msg: string, title = "Atenção") => toast.show(msg, "error", title),
  info: (msg: string, title = "Informação") => toast.show(msg, "info", title),
  warning: (msg: string, title = "Aviso") => toast.show(msg, "warning", title),
};

const NotificationCard = ({ item, onClose }: { item: NotificationItem; onClose: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const configs = {
    success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-600" },
    error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", bar: "bg-red-600" },
    info: { icon: Bell, color: "text-indigo-600", bg: "bg-indigo-50", bar: "bg-indigo-600" },
    warning: { icon: Info, color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-600" },
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
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        relative w-full bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[28px] 
        overflow-hidden pointer-events-auto transition-all duration-500
        ${isExpanded
          ? "fixed inset-0 z-[100000] sm:relative sm:inset-auto h-screen sm:h-auto flex flex-col justify-center p-10"
          : "p-6 sm:max-w-sm min-h-[90px] flex flex-col justify-center" // Altura mínima e centralização
        }
      `}
    >
      <div className={`flex items-center gap-5 ${isExpanded ? "flex-col sm:flex-row items-start" : "flex-row"}`}>

        {/* Barra de progresso visual */}
        {!isExpanded && (
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: (item.duration || 5000) / 1000, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-1.5 ${config.bar} opacity-20`}
          />
        )}

        {/* Ícone Lateral - Container com tamanho fixo para não achatar */}
        <div className={`${config.bg} p-4 rounded-2xl ${config.color} flex-shrink-0 flex items-center justify-center`}>
          <config.icon className="w-6 h-6" />
        </div>

        {/* Conteúdo de Texto */}
        <div className="flex-1 min-w-0 py-1">
          {item.title && (
            <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-900 italic mb-1">
              {item.title}
            </h3>
          )}
          <p className={`font-bold text-gray-500 leading-tight ${isExpanded ? "text-2xl sm:text-base text-gray-700" : "text-[13px]"}`}>
            {item.message}
          </p>

          {item.details && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase mt-2 hover:text-indigo-800 transition-colors"
            >
              {isExpanded ? <><ChevronUp className="w-3 h-3" /> Menos detalhes</> : <><ChevronDown className="w-3 h-3" /> Ver detalhes</>}
            </button>
          )}

          <AnimatePresence>
            {isExpanded && item.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pt-6 text-sm font-medium text-gray-400 leading-relaxed border-t border-gray-50 mt-4"
              >
                {item.details}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botão Fechar */}
        <button
          onClick={() => isExpanded ? setIsExpanded(false) : onClose(item.id)}
          className="text-gray-300 hover:text-gray-900 transition-all p-2 hover:bg-gray-50 rounded-full flex-shrink-0"
        >
          <X className={isExpanded ? "w-8 h-8" : "w-5 h-5"} />
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
    <div className="fixed top-8 right-8 z-[99999] w-full sm:w-auto h-auto pointer-events-none flex flex-col items-end gap-4 px-6 sm:px-0">
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