"use client";

import { useState, useEffect, useMemo } from "react";
import { ROLE_LABELS } from "@/constants/roles";
import { 
    ChevronRight, ChevronLeft, Check, 
    X, Fingerprint, Database,
    ShieldCheck, Box, Layers
} from "lucide-react";
import { ROLE_MAP, RoleScope, RoleDepartment } from "@/enum/permissionEnum";

interface RoleSelectorProps {
  currentRole: string;
  onSelect: (role: string) => void;
  onClose: () => void;
  companyName: string | undefined;
}

export default function RoleSelectorPanel({ currentRole, onSelect, onClose, companyName }: RoleSelectorProps) {
  const [step, setStep] = useState<'scope' | 'department' | 'roles'>('scope');
  const [selectedScope, setSelectedScope] = useState<'CLIENT' | 'INTERNAL' | null>(null);
  const [selectedDept, setSelectedDept] = useState<RoleDepartment | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const availableDepartments = useMemo(() => {
    if (!selectedScope) return [];
    const depts = new Set<RoleDepartment>();
    Object.values(ROLE_MAP).forEach(role => {
      const isMatch = selectedScope === 'INTERNAL' 
        ? role.scope === RoleScope.SAAS 
        : role.scope === RoleScope.CLIENT;
      if (isMatch) depts.add(role.department);
    });
    return Array.from(depts);
  }, [selectedScope]);

  const filteredRoles = useMemo(() => {
    if (!selectedDept || !selectedScope) return [];
    return Object.entries(ROLE_LABELS).filter(([key]) => {
      const roleData = ROLE_MAP[key];
      if (!roleData) return false;
      const scopeMatch = selectedScope === 'INTERNAL' 
        ? roleData.scope === RoleScope.SAAS 
        : roleData.scope === RoleScope.CLIENT;
      return scopeMatch && roleData.department === selectedDept;
    });
  }, [selectedScope, selectedDept]);

  const handleBack = () => {
    if (step === 'roles') setStep('department');
    else if (step === 'department') setStep('scope');
  };

  const handleFinalSelect = (role: string) => {
    onSelect(role.replace(/['"]+/g, '').trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden text-black">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      
      {/* CONTAINER PRINCIPAL: flex-col no mobile, flex-row no desktop */}
      <div className="relative w-full h-full lg:max-w-[1600px] flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] lg:border lg:border-white/20">
        
        {/* LATERAL ESQUERDA / TOPO (MOBILE) */}
        <div className="w-full lg:w-[30%] bg-black p-6 lg:p-12 flex flex-row lg:flex-col justify-between border-b lg:border-r border-white/10 shrink-0">
          <div className="space-y-4 lg:space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[var(--delos-amber)] flex items-center justify-center rounded-sm rotate-45 shrink-0">
                <Fingerprint className="w-5 h-5 lg:w-6 lg:h-6 text-black -rotate-45" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-xl lg:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Freela<span className="text-[var(--delos-amber)]">Certo</span></h2>
                <p className="text-[8px] lg:text-[10px] font-bold text-[var(--delos-amber)] uppercase tracking-[0.4em] truncate">Op_{companyName}</p>
              </div>
            </div>

            <div className="hidden lg:block space-y-6">
              <div className="p-6 border-l-2 border-[var(--delos-amber)] bg-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Protocolo_Atual</p>
                <p className="text-xl font-black uppercase italic text-white leading-none truncate">{ROLE_LABELS[currentRole] || "Indefinido"}</p>
              </div>
              <div className="font-mono text-[9px] text-white/30 uppercase leading-relaxed space-y-2 border-t border-white/10 pt-4">
                <p className={selectedScope ? "text-[var(--delos-amber)]" : ""}>› Escopo: {selectedScope || "Aguardando"}</p>
                <p className={selectedDept ? "text-[var(--delos-amber)]" : ""}>› Setor: {selectedDept || "---"}</p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all self-center lg:self-start">
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            <span className="hidden sm:inline">Fechar_Página</span>
          </button>
        </div>

        {/* ÁREA DE SELEÇÃO PRINCIPAL */}
        <div className="flex-1 bg-white p-6 lg:p-20 overflow-y-auto custom-scrollbar flex flex-col">
          <header className="mb-8 lg:mb-16 flex justify-between items-end border-b-4 border-black pb-4 lg:pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--delos-amber)]">
                <Layers className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.5em]">Lvl_{step.toUpperCase()}</span>
              </div>
              <h3 className="text-3xl lg:text-7xl font-black uppercase italic tracking-tighter leading-none">
                {step === 'scope' && "Escopo"}
                {step === 'department' && "Setores"}
                {step === 'roles' && "Cargos"}
              </h3>
            </div>
            
            {step !== 'scope' && (
              <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 border-2 border-black font-black text-[9px] lg:text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95">
                <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" /> Voltar
              </button>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 flex-1">
            {step === 'scope' && (
              <>
                <button onClick={() => { setSelectedScope('CLIENT'); setStep('department'); }} 
                        className="group relative flex flex-col justify-end p-6 lg:p-10 border-4 border-black hover:bg-black hover:text-white transition-all aspect-video lg:aspect-auto min-h-[160px]">
                  <Database className="w-10 h-10 lg:w-12 lg:h-12 mb-4 lg:mb-6 text-[var(--delos-amber)] group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl lg:text-3xl font-black uppercase italic tracking-tighter mb-2 truncate">{companyName}_Equipe</h4>
                  <p className="hidden sm:block text-[10px] font-bold uppercase tracking-widest opacity-60">Operação direta na unidade cliente.</p>
                  <ChevronRight className="absolute right-6 lg:right-8 bottom-6 lg:bottom-8 w-6 h-6 lg:w-8 lg:h-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[var(--delos-amber)]" />
                </button>
                <button onClick={() => { setSelectedScope('INTERNAL'); setStep('department'); }}
                        className="group relative flex flex-col justify-end p-6 lg:p-10 border-4 border-black hover:bg-black hover:text-white transition-all aspect-video lg:aspect-auto min-h-[160px]">
                  <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 mb-4 lg:mb-6 text-[var(--delos-amber)] group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl lg:text-3xl font-black uppercase italic tracking-tighter mb-2">Staff_Nexus</h4>
                  <p className="hidden sm:block text-[10px] font-bold uppercase tracking-widest opacity-60">Administração e suporte core do SaaS.</p>
                  <ChevronRight className="absolute right-6 lg:right-8 bottom-6 lg:bottom-8 w-6 h-6 lg:w-8 lg:h-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[var(--delos-amber)]" />
                </button>
              </>
            )}

            {step === 'department' && availableDepartments.map(dept => (
              <button key={dept} onClick={() => { setSelectedDept(dept); setStep('roles'); }}
                      className="group p-6 lg:p-8 border-2 border-gray-100 hover:border-black flex justify-between items-center transition-all bg-white hover:shadow-lg">
                <span className="text-lg lg:text-xl font-black uppercase italic tracking-tight">{dept}</span>
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--delos-amber)] opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}

            {step === 'roles' && filteredRoles.map(([key, label]) => {
              const isActive = currentRole === key;
              return (
                <button key={key} onClick={() => handleFinalSelect(key)}
                        className={`group relative p-6 lg:p-8 border-2 transition-all flex items-center justify-between ${isActive ? 'bg-black text-white border-black shadow-xl' : 'bg-white border-gray-100 hover:border-black'}`}>
                  <div className="space-y-1">
                    <p className={`text-sm lg:text-base font-black uppercase italic tracking-tight ${isActive ? 'text-[var(--delos-amber)]' : 'text-black'}`}>{label}</p>
                    <p className="text-[8px] font-mono opacity-50 uppercase tracking-tighter">DATA_REF::{key}</p>
                  </div>
                  {isActive && <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[var(--delos-amber)] rounded-full flex items-center justify-center animate-in zoom-in"><Check className="w-5 h-5 text-black" /></div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}