"use client";

import { useState, useEffect, useMemo } from "react";
import { ROLE_LABELS } from "@/constants/roles";
import {
  X, Activity, Lock,
  Fingerprint
} from "lucide-react";
import { ROLE_MAP, RoleScope, RoleDepartment } from "@/enum/permissionEnum";
import { motion } from "framer-motion";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useAuthStore } from "@/store/useAuthStore";
import ProfilePermissions from "@/components/ProfileRestrictions/Permissions";

interface RoleSelectorProps {
  currentRole: string;
  onSelect: (role: string) => void;
  onClose: () => void;
  companyName: string | undefined;
}

export default function RoleSelectorPanel({ currentRole, onSelect, onClose, companyName }: RoleSelectorProps) {
  const { user } = useAuthStore();
  const { high, modules, isSuperAdmin } = useUserPermissions(user?.profile?.role || "");

  const [step, setStep] = useState<'scope' | 'department' | 'roles'>('scope');
  const [selectedScope, setSelectedScope] = useState<RoleScope | null>(null);
  const [selectedDept, setSelectedDept] = useState<RoleDepartment | null>(null);

  const canOperateNexus = modules.admin || high || isSuperAdmin;

  // Trava o scroll e garante foco total
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
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
    // Container ocupa 100% da viewport e fica acima de tudo
    <div className="fixed inset-0 z-[9999] bg-delos-surface flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Background Decorativo Estendido */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--delos-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-border)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-[0.15]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/20 pointer-events-none" />

      {/* BARRA LATERAL (ASIDE) - Full Height */}
      <motion.aside 
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="relative z-10 w-full lg:w-[380px] h-full border-r border-delos-border p-10 flex flex-col justify-between bg-black/60 backdrop-blur-xl"
      >
        <div className="space-y-16">
          {/* Logo / Brand Section */}
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 border border-delos-red flex items-center justify-center relative">
              <Activity className="w-6 h-6 text-delos-red animate-pulse" />
              <div className="absolute inset-0 bg-delos-red/10 animate-ping" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-delos-texto">
                UMFF<span className="text-delos-red">_NEXUS</span>
              </h2>
              <p className="text-[8px] font-mono text-delos-subtext uppercase tracking-[0.6em] mt-1">System_Level_v2.06</p>
            </div>
          </div>

          {/* User / Clearance Section */}
          <div className="space-y-8">
            <div className="p-6 border-l-4 border-delos-red bg-delos-red/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
                  <Fingerprint size={40} />
               </div>
              <p className="text-[10px] font-black uppercase text-delos-red opacity-80 tracking-[0.2em] mb-2">Auth_Identity</p>
              <p className="text-xl font-black uppercase italic tracking-tight text-delos-texto">{user?.profile?.name || "HOST_UNKNOWN"}</p>
              {!canOperateNexus && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-widest bg-red-500/10 p-2 border border-red-500/20">
                  <Lock size={12} /> Restricted_Clearance
                </div>
              )}
            </div>

            <div className="p-6 border-l-4 border-delos-border bg-white/[0.03] space-y-2">
              <p className="text-[10px] font-black uppercase text-delos-subtext tracking-[0.2em]">Context_Sync</p>
              <p className="text-sm font-bold uppercase text-delos-texto italic opacity-70">{companyName || "GLOBAL_ROOT"}</p>
            </div>
          </div>
        </div>

        {/* Botão de Fechar fixado na base do Aside */}
        <div className="space-y-4">
          <button 
            onClick={onClose} 
            className="w-full py-5 border border-white/10 flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group duration-500"
          >
            <X size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[12px] font-black uppercase tracking-[0.3em]">Terminate_Session</span>
          </button>
          <div className="text-center">
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.8em]">End_Of_Line</span>
          </div>
        </div>
      </motion.aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL - Full Screen */}
      <div className="relative z-10 flex-1 h-full overflow-hidden">
        <ProfilePermissions
          step={step}
          setStep={setStep}
          canOperateNexus={canOperateNexus}
          user={user}
          RoleScope={RoleScope}
          availableDepartments={availableDepartments}
          groupedRoles={groupedRoles}
          currentRole={currentRole}
          selectedScope={selectedScope}
          setSelectedScope={(scope) => setSelectedScope(scope as RoleScope)}
          setSelectedDept={(dept) => setSelectedDept(dept as RoleDepartment)}
          onSelect={onSelect}
          onClose={onClose}
          handleBack={handleBack}
        />
      </div>

    </div>
  );
}