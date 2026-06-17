"use client";

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ShieldAlert, 
  Zap, 
  Binary, 
  Fingerprint, 
  Activity 
} from 'lucide-react';

// Tipagem das Etapas e Scopes
type Step = 'scope' | 'department' | 'roles';

interface ProfilePermissionsProps {
  step: Step;
  setStep: (step: Step) => void;
  canOperateNexus: boolean;
  user: any; // Substitua pelo seu tipo de User
  RoleScope: Record<string, string>;
  availableDepartments: string[];
  groupedRoles: Record<string, [string, string][]>;
  currentRole: string;
  selectedScope: string | null;
  setSelectedScope: (scope: string) => void;
  setSelectedDept: (dept: string) => void;
  onSelect: (roleKey: string) => void;
  onClose: () => void;
  handleBack: () => void;
}

const ProfilePermissions = memo(({
  step,
  setStep,
  canOperateNexus,
  user,
  RoleScope,
  availableDepartments,
  groupedRoles,
  currentRole,
  setSelectedScope,
  setSelectedDept,
  onSelect,
  onClose,
  handleBack
}: ProfilePermissionsProps) => {

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative bg-delos-surface-elevated">
      
      {/* HEADER SISTÊMICO */}
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
          <button 
            onClick={handleBack} 
            className="flex items-center gap-2 px-6 py-3 border border-delos-border text-[10px] font-black uppercase tracking-widest text-delos-texto hover:bg-delos-red/10 transition-all"
          >
            <ChevronLeft size={14} /> Voltar
          </button>
        )}
      </header>

      {/* ÁREA DE CONTEÚDO COM SCROLL */}
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
                    className="group p-4 border border-delos-border bg-delos-item/5 hover:border-delos-red transition-all flex flex-col justify-between h-20 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all text-delos-red"><Zap size={60} /></div>
                    <span className="text-[9px] font-mono font-bold text-delos-subtext uppercase tracking-[0.4em]">Setor</span>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter text-delos-texto group-hover:text-delos-red transition-colors">
                      {scope.replace('CLIENT_', '').replace('_', ' ')}
                    </h4>
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

      {/* FOOTER DE STATUS (NEXUS PROTOCOL) */}
      <footer className="p-6 border-t border-delos-border bg-black/40 flex justify-between items-center">
         <div className="flex items-center gap-4">
            <Activity size={10} className="text-red-600 animate-pulse" />
            <span className="text-[7px] font-mono text-delos-subtext uppercase tracking-[0.5em]">
              Nexus_Protocol::{canOperateNexus ? 'Authorized' : 'Locked'}
            </span>
         </div>
         <span className="text-[8px] font-black text-delos-subtext uppercase tracking-widest">
            Auth_ID::{user?.id?.substring(0, 12) || "ANON_HOST"}
         </span>
      </footer>
    </main>
  );
});

ProfilePermissions.displayName = 'ProfilePermissions';

export default ProfilePermissions;