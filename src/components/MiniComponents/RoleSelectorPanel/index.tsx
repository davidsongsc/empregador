"use client";

import { useState, useEffect, useMemo } from "react";
import { ROLE_LABELS } from "@/constants/roles";
import {
  ChevronRight, ChevronLeft, Check,
  X, Fingerprint, Database,
  ShieldCheck, Box, Layers,
  Utensils, Wine, UserCircle,
  Briefcase, HardHat, Building2,
  Activity, Cpu, Network
} from "lucide-react";
import { ROLE_MAP, RoleScope, RoleDepartment, RoleLevel } from "@/enum/permissionEnum";

interface RoleSelectorProps {
  currentRole: string;
  onSelect: (role: string) => void;
  onClose: () => void;
  companyName: string | undefined;
}

export default function RoleSelectorPanel({ currentRole, onSelect, onClose, companyName }: RoleSelectorProps) {
  const [step, setStep] = useState<'scope' | 'department' | 'roles'>('scope');
  const [selectedScope, setSelectedScope] = useState<RoleScope | null>(null);
  const [selectedDept, setSelectedDept] = useState<RoleDepartment | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const getScopeIcon = (scope: RoleScope) => {
    const icons: Record<string, any> = {
      [RoleScope.SAAS]: <ShieldCheck className="w-8 h-8" />,
      [RoleScope.CLIENT_KITCHEN]: <Utensils className="w-8 h-8" />,
      [RoleScope.CLIENT_BAR]: <Wine className="w-8 h-8" />,
      [RoleScope.CLIENT_FLOOR]: <UserCircle className="w-8 h-8" />,
      [RoleScope.CLIENT_OFFICE]: <Briefcase className="w-8 h-8" />,
      [RoleScope.CLIENT_FACILITIES]: <HardHat className="w-8 h-8" />,
      [RoleScope.CANDIDATE]: <Cpu className="w-8 h-8" />,
    };
    return icons[scope] || <Building2 className="w-8 h-8" />;
  };

  const availableDepartments = useMemo(() => {
    if (!selectedScope) return [];
    const depts = new Set<RoleDepartment>();
    Object.values(ROLE_MAP).forEach(role => {
      if (role.scope === selectedScope) depts.add(role.department);
    });
    return Array.from(depts);
  }, [selectedScope]);

  // AGRUPAMENTO POR NÍVEL (Hiararquia Visual)
  const groupedRoles = useMemo(() => {
    if (!selectedDept || !selectedScope) return {};

    const roles = Object.entries(ROLE_LABELS).filter(([key]) => {
      const roleData = ROLE_MAP[key];
      return roleData?.scope === selectedScope && roleData?.department === selectedDept;
    });

    const groups: Record<string, typeof roles> = {};
    roles.forEach(role => {
      const level = ROLE_MAP[role[0]]?.level || 'OTHER';
      if (!groups[level]) groups[level] = [];
      groups[level].push(role);
    });
    return groups;
  }, [selectedScope, selectedDept]);

  const handleBack = () => {
    if (step === 'roles') setStep('department');
    else if (step === 'department') setStep('scope');
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center animate-in fade-in duration-700 overflow-hidden text-black">
      {/* Background Grid Dinâmico */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      <div className="relative w-full h-full lg:max-w-[1700px] flex flex-col lg:flex-row shadow-[0_0_150px_rgba(0,0,0,1)] lg:border-x lg:border-white/10">

        {/* STATUS BAR (LEFT) */}
        <div className="w-full lg:w-[22%] bg-black p-6 lg:p-10 flex flex-row lg:flex-col justify-between border-b lg:border-r border-white/5 shrink-0 relative">
          <div className="space-y-10">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[var(--delos-amber)] flex items-center justify-center rounded-none rotate-45 group-hover:rotate-[135deg] transition-transform duration-500">
                <Activity className="w-6 h-6 text-black -rotate-45 group-hover:-rotate-[135deg] transition-transform duration-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">NEXUS<span className="text-[var(--delos-amber)]">OS</span></h2>
                <p className="text-[7px] font-bold text-white/40 uppercase tracking-[0.5em]">PROTOCOL::DELOS_MODE</p>
              </div>
            </div>

            <div className="hidden lg:block space-y-8">
              <div className="p-5 border-r-4 border-[var(--delos-amber)] bg-white/[0.02] text-right">
                <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-2">ACTIVE_IDENTITY</p>
                <p className="text-lg font-black uppercase italic text-white leading-tight">{ROLE_LABELS[currentRole] || "NOT_ASSIGNED"}</p>
              </div>

              <div className="font-mono text-[9px] text-white/20 space-y-4 border-t border-white/5 pt-8">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${selectedScope ? 'bg-[var(--delos-amber)] animate-pulse' : 'bg-white/20'}`} />SCOPE</span>
                  <span className="text-white font-bold">{selectedScope || "---"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${selectedDept ? 'bg-[var(--delos-amber)] animate-pulse' : 'bg-white/20'}`} />DEPT</span>
                  <span className="text-white font-bold">{selectedDept || "---"}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="group flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-[var(--delos-amber)] transition-colors">
            <X className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden lg:block">Fechar Painel</span>
          </button>
        </div>

        {/* CONTENT AREA (RIGHT) */}
        <div className="flex-1 bg-white p-6 lg:p-16 overflow-y-auto custom-scrollbar flex flex-col">
          <header className="mb-12 flex justify-between items-start border-b-[12px] border-black pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-4 w-1 bg-[var(--delos-amber)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-black/40">Step_0{step === 'scope' ? '1' : step === 'department' ? '2' : '3'}</span>
              </div>
              <h3 className="text-5xl lg:text-9xl font-black uppercase italic tracking-tighter leading-none select-none">
                {step === 'scope' ? "PERMISSÕES" : step === 'department' ? "UNITS" : "ROLES"}
              </h3>
            </div>

            {step !== 'scope' && (
              <button onClick={handleBack} className="mt-4 flex items-center gap-3 px-8 h-14 border-[5px] border-black font-black text-xs uppercase tracking-tighter hover:bg-black hover:text-white transition-all active:scale-95">
                <ChevronLeft className="w-5 h-5" /> Reverter
              </button>
            )}
          </header>

          <div className="flex-1">
            {/* STEP 1: SCOPES */}
            {step === 'scope' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in slide-in-from-bottom-4 duration-500">
                {Object.values(RoleScope).map((scope) => (
                  <button key={scope} onClick={() => { setSelectedScope(scope); setStep('department'); }}
                    className="group relative h-56 border-[6px] border-black p-8 flex flex-col justify-end hover:bg-black hover:text-white transition-all overflow-hidden text-left shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    <div className="absolute top-0 right-0 p-6 text-black/5 group-hover:text-[var(--delos-amber)]/20 transition-colors">
                      {getScopeIcon(scope)}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--delos-amber)] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Selecionar </p>
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{scope.split('_').join(' ')}</h4>
                    <Network className="absolute right-8 bottom-8 w-6 h-6 opacity-0 group-hover:opacity-100 transition-all text-[var(--delos-amber)]" />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: DEPARTMENTS */}
            {step === 'department' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
                {availableDepartments.map(dept => (
                  <button key={dept} onClick={() => { setSelectedDept(dept); setStep('roles'); }}
                    className="group h-32 border-[4px] border-black/10 p-8 flex items-center justify-between hover:border-black bg-[#fcfcfc] transition-all">
                    <span className="text-3xl font-black uppercase italic tracking-tighter group-hover:translate-x-3 transition-transform">{dept}</span>
                    <Box className="w-8 h-8 text-[var(--delos-amber)] opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: ROLES (GROUPED & STAGGERED) */}
            {step === 'roles' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
                {Object.entries(groupedRoles).map(([level, roles]) => (
                  <section key={level} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[var(--delos-amber)] whitespace-nowrap">{level}</span>
                      <div className="h-[1px] w-full bg-black/5" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {roles.map(([key, label], index) => (
                        <button key={key} onClick={() => { onSelect(key); onClose(); }}
                          style={{ animationDelay: `${index * 50}ms` }}
                          className={`group relative p-6 border-[3px] transition-all flex items-center justify-between text-left animate-in fade-in slide-in-from-bottom-2
                                                            ${currentRole === key ? 'bg-black text-white border-black ring-4 ring-[var(--delos-amber)]/20' : 'bg-white border-black/5 hover:border-black'}`}>
                          <div>
                            <p className={`text-lg font-black uppercase italic tracking-tight leading-tight ${currentRole === key ? 'text-[var(--delos-amber)]' : 'text-black'}`}>
                              {label}
                            </p>
                            <p className="text-[8px] font-mono opacity-40 mt-1 uppercase">ID::{key.slice(0, 15)}...</p>
                          </div>
                          {currentRole === key && <Check className="w-6 h-6 text-[var(--delos-amber)]" />}
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}