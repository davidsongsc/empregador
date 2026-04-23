"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, CheckCircle2, Activity, Binary } from "lucide-react";
import { motion } from "framer-motion";

export default function SelectCompany() {
  const { user, setActiveCompany, activeCompanyId } = useAuthStore();
  const router = useRouter();
  const empresas = user?.profile?.memberships || [];

  const handleSelect = (id: string) => {
    setActiveCompany(id);
    // Feedback tátil/visual imediato antes do push
    // router.push(`/dashboard/painel/companies/`);
  };

  return (
    <div className="min-h-screen bg-[var(--delos-surface)] text-[var(--delos-black)] relative flex flex-col justify-center p-4 md:p-8 overflow-hidden">

      {/* Grid de Calibração Delos (Fundo) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:100px_100px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />

      <div className="w-full max-w-lg mx-auto relative z-10">

        {/* Header Estilo Terminal */}
        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[var(--delos-amber)] animate-pulse rounded-full" />
            <span className="text-[10px] font-mono font-black text-[var(--delos-amber)] uppercase tracking-[0.4em]">Você participa de {empresas.length} equipes</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
            Escolha_<span className="opacity-30">Empresa</span>
          </h1>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">
            Selecione a unidade corporativa para sincronização de parâmetros.
          </p>
        </header>

        {/* Lista de Empresas */}
        <div className="space-y-3">
          {empresas.map((emp, index) => {
            const isSelected = activeCompanyId === emp.company_id;

            return (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={emp.company_id}
                onClick={() => handleSelect(emp.company_id)}
                className={`
                  w-full group flex items-center justify-between p-6 rounded-sm border transition-all duration-500
                  ${isSelected
                    ? "border-[var(--delos-black)] bg-black/[0.03] shadow-2xl"
                    : "border-black/5 bg-transparent hover:border-[var(--delos-indigo)]/30 hover:bg-black/[0.01]"}
                `}
              >
                <div className="flex items-center gap-5">
                  <div className={`
                    w-12 h-12 flex items-center justify-center border transition-all duration-500
                    ${isSelected
                      ? "bg-[var(--delos-black)] text-[var(--delos-surface)] border-[var(--delos-black)]"
                      : "bg-transparent text-black/20 border-black/10 group-hover:border-[var(--delos-indigo)] group-hover:text-[var(--delos-indigo)]"}
                  `}>
                    <Building2 size={20} strokeWidth={isSelected ? 3 : 2} />
                  </div>

                  <div className="text-left space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black uppercase italic tracking-tight leading-none">
                        {emp.company_name}
                      </p>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-[var(--delos-amber)] animate-in zoom-in" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Binary size={10} className="opacity-30" />
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-40">
                        Access_Level::{emp.role || "Host"}
                      </p>
                    </div>
                  </div>
                </div>

                <ArrowRight
                  className={`transition-transform duration-500 group-hover:translate-x-2 ${isSelected ? "text-[var(--delos-amber)]" : "opacity-10"}`}
                  size={18}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Footer Info Mobile */}
        <footer className="mt-12 pt-6 border-t border-black/5 flex items-center justify-between opacity-30">
          <div className="flex items-center gap-2">
            <Activity size={12} />
            <span className="text-[8px] font-mono uppercase tracking-widest">System_Ready</span>
          </div>
          <span className="text-[8px] font-mono uppercase tracking-widest">Delos_Inc // 2026</span>
        </footer>
      </div>
    </div>
  );
}