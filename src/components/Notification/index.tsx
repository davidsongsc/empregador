"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Info } from "lucide-react";

interface NotificationProps {
  title?: string;
  message: string;
  duration?: number; // em milissegundos
  onClose: () => void;
}

const Notification = ({ title, message, duration = 3000, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed top-6 right-6 z-[100] w-full max-w-sm"
    >
      <div className="bg-white border border-gray-100 shadow-2xl shadow-indigo-100/50 rounded-[24px] p-5 flex items-start gap-4 overflow-hidden relative group">
        {/* Barra de progresso visual */}
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-1 bg-indigo-600/20"
        />

        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
          <Bell className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1">
          {title && (
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">
              {title}
            </h3>
          )}
          <p className="text-sm font-bold text-gray-500 leading-relaxed">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-gray-900 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Notification;