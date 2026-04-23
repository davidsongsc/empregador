"use client";

import { useState, useEffect, useMemo } from "react";
import { ROLE_LABELS } from "@/constants/roles";
import {
  ChevronLeft, Check, X, Fingerprint, Activity, 
  Cpu, Network, Box, Terminal, Binary, ShieldAlert, Zap, Lock
} from "lucide-react";
import { ROLE_MAP, RoleScope, RoleDepartment } from "@/enum/permissionEnum";
import { motion, AnimatePresence } from "framer-motion";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useAuthStore } from "@/store/useAuthStore";

interface RoleSelectorProps {
  currentRole: string;
  onSelect: (role: string) => void;
  onClose: () => void;
  companyName: string | undefined;
}

export default function RoleSelectorPanel({ currentRole, onSelect, onClose, companyName }: RoleSelectorProps) {
  const { user } = useAuthStore();
  // Importando as permissões para validar se o usuário pode reatribuir papéis
  const { high, modules, isSuperAdmin } = useUserPermissions(user?.profile?.role || "");
  
  const [step, setStep] = useState<'scope' | 'department' | 'roles'>('scope');
  const [selectedScope, setSelectedScope] = useState<RoleScope | null>(null);
  const [selectedDept, setSelectedDept] = useState<RoleDepartment | null>(null);

  // Bloqueio de segurança: Apenas usuários com acesso administrativo ou nível alto podem operar o Nexus
  const canOperateNexus = modules.admin || high || isSuperAdmin;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const availableDepartments = useMemo(() => {
    if (!selectedScope) return [];
    const depts = new Set<RoleDepartment>();
    Object.values(ROLE_MAP).forEach(role => {
      if (role.scope === selectedScope) depts.add(role.department);
    });
    return Array.from(depts);
  }, [selectedScope]);

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
    <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center p-0 lg:p-6 overflow-hidden font-sans">
      
      {/* Background Decorativo Sistêmico */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--delos-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-border)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-full lg:max-w-7xl lg:h-[90vh] bg-delos-surface border border-delos-border flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
      >
        
        {/* BARRA LATERAL (IDENTIDADE E CLEARANCE) */}
        <aside className="w-full lg:w-[320px] border-b lg:border-r border-delos-border p-8 flex flex-col justify-between bg-black/40 backdrop-blur-md">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-delos-red flex items-center justify-center">
                <Activity className="w-5 h-5 text-delos-red animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-delos-texto">NEXUS<span className="text-delos-red">_OS</span></h2>
                <p className="text-[7px] font-mono text-delos-subtext uppercase tracking-[0.4em] mt-1">Clearance::Level_{high ? '03' : '01'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 border-l-2 border-delos-red bg-delos-red/5">
                <p className="text-[8px] font-black uppercase text-delos-red opacity-60 tracking-widest mb-1">Operador_Autenticado</p>
                <p className="text-sm font-black uppercase italic tracking-tight text-delos-texto">{user?.profile?.name || "GUEST_USER"}</p>
                {!canOperateNexus && (
                  <div className="mt-2 flex items-center gap-2 text-[8px] text-red-500 font-bold uppercase">
                    <Lock size={10} /> Privilégios_Insuficientes
                  </div>
                )}
              </div>

              <div className="p-4 border-l-2 border-delos-border bg-white/5 space-y-4 opacity-60">
                 <p className="text-[8px] font-black uppercase text-delos-subtext tracking-widest">Alvo_de_Sincronia</p>
                 <p className="text-xs font-bold uppercase text-delos-texto">{companyName || "ROOT_SYSTEM"}</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block space-y-4">
             <button onClick={onClose} className="w-full py-4 border border-delos-border flex items-center justify-center gap-3 hover:bg-delos-texto hover:text-delos-surface transition-all group">
                <X size={14} className="group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Abortar_Protocolo</span>
             </button>
          </div>
        </aside>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-delos-surface-elevated">
          
          <header className="p-8 lg:p-12 border-b border-delos-border flex justify-between items-end bg-black/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <div className={`w-1 h-1 rounded-full shadow-[0_0_5px_var(--delos-red)] ${canOperateNexus ? 'bg-emerald-500' : 'bg-delos-red'}`} />
                 <span className="text-[9px] font-mono font-bold text-delos-subtext uppercase tracking-[0.5em]">
                    Terminal_Override::0{step === 'scope' ? '1' : step === 'department' ? '2' : '3'}
                 </span>
              </div>
              <h3 className="text-4xl lg:text-7xl font-light uppercase tracking-tighter leading-none text-delos-texto">
                {step === 'scope' ? "SCOPES" : step === 'department' ? "UNITS" : "ROLES"}
              </h3>
            </div>

            {step !== 'scope' && (
              <button onClick={handleBack} className="flex items-center gap-2 px-6 py-3 border border-delos-border text-[10px] font-black uppercase tracking-widest text-delos-texto hover:bg-delos-red/10 transition-all">
                <ChevronLeft size={14} /> Voltar
              </button>
            )}
          </header>

          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            {!canOperateNexus ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <ShieldAlert size={80} className="text-delos-red animate-pulse" />
                <h4 className="text-2xl font-black uppercase italic tracking-widest">Acesso Restrito ao Módulo Nexus</h4>
                <p className="text-xs font-mono max-w-md uppercase tracking-wider">Você não possui o nível de segurança (Clearance) necessário para reatribuir papéis neste setor.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* ETAPA 1: SCOPES */}
                {step === 'scope' && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(RoleScope).map((scope) => (
                      <button key={scope} onClick={() => { setSelectedScope(scope); setStep('department'); }}
                        className="group p-8 border border-delos-border bg-delos-item/5 hover:border-delos-red transition-all flex flex-col justify-between h-44 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all text-delos-red"><Zap size={60} /></div>
                        <span className="text-[9px] font-mono font-bold text-delos-subtext uppercase tracking-[0.4em]">Sector_Identity</span>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-delos-texto group-hover:text-delos-red transition-colors">{scope.replace('CLIENT_', '').replace('_', ' ')}</h4>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* ETAPA 2: DEPARTAMENTOS */}
                {step === 'department' && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableDepartments.map(dept => (
                      <button key={dept} onClick={() => { setSelectedDept(dept); setStep('roles'); }}
                        className="group p-8 border border-delos-border bg-delos-item/5 hover:border-delos-texto transition-all flex items-center justify-between">
                        <span className="text-2xl font-black uppercase italic tracking-tighter text-delos-subtext group-hover:text-delos-texto transition-colors">{dept}</span>
                        <Binary className="w-5 h-5 text-delos-subtext group-hover:text-delos-red" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* ETAPA 3: ROLES */}
                {step === 'roles' && (
                  <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    {Object.entries(groupedRoles).map(([level, roles]) => (
                      <section key={level} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-delos-red">{level}</span>
                          <div className="h-[1px] flex-1 bg-delos-border" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {roles.map(([key, label]) => {
                            const isSelected = currentRole === key;
                            return (
                              <button key={key} onClick={() => { onSelect(key); onClose(); }}
                                className={`group p-6 border transition-all flex items-center justify-between text-left
                                  ${isSelected ? 'border-delos-red bg-delos-red/10' : 'border-delos-border bg-delos-item/5 hover:border-delos-subtext'}`}>
                                <div>
                                  <p className={`text-base font-black uppercase italic tracking-tight ${isSelected ? 'text-delos-red' : 'text-delos-texto'}`}>{label}</p>
                                  <p className="text-[8px] font-mono text-delos-subtext mt-1 uppercase tracking-widest">Privilege_Key::{key.substring(0, 12)}</p>
                                </div>
                                {isSelected ? <Fingerprint className="text-delos-red" size={18} /> : <div className="w-1 h-1 bg-delos-border group-hover:bg-delos-red" />}
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Footer de Status */}
          <footer className="p-6 border-t border-delos-border bg-black/40 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <Activity size={10} className="text-red-600 animate-pulse" />
                <span className="text-[7px] font-mono text-delos-subtext uppercase tracking-[0.5em]">Nexus_Protocol::{canOperateNexus ? 'Authorized' : 'Locked'}</span>
             </div>
             <span className="text-[8px] font-black text-delos-subtext uppercase tracking-widest">Auth_ID::{user?.id?.substring(0, 12) || "ANON_HOST"}</span>
          </footer>
        </main>
      </motion.div>
    </div>
  );
}