"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import {
  Cpu, Activity, Terminal
} from 'lucide-react';
import { toast } from '@/components/Notification';
import { useAuthStore } from '@/store/useAuthStore';
import { FooterHUD } from '@/components/Footer/System';
import { QuickActions } from '@/components/MiniComponents/QuickActions';
import { TelemetryData } from '@/components/MiniComponents/TelemetryData';
import { SubscriptionDossier } from '@/components/MiniComponents/SubscriptionDossier';
import { PersonnelIndex } from '@/components/MiniComponents/PersonnelIndex';
import { DepartmentGrid } from '@/components/MiniComponents/DepartmentGrid';
import { CompanyDossier } from '@/components/MiniComponents/CompanyDossier';

const CURRENT_SUBSCRIPTION = {
  planName: "Enterprise Ops",
  price: "R$ 890,00/mês",
  features: [
    "Gestão de Equipes de Hosts",
    "Módulo de Logística Nexus",
    "Telemetria em Tempo Real"
  ]
};

export default function CompanyProfilePage() {
  const router = useRouter();
  const { activeCompanyId, isHydrated } = useAuthStore();
  const { activeCompany, fetchCompanyDetails, loading } = useCompanyStore();
  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const openSectorDetails = (id: string) => {
    setInspectingId(id);
  };
  useEffect(() => {
    if (isHydrated && activeCompanyId) {
      fetchCompanyDetails(activeCompanyId);
    }
  }, [activeCompanyId, isHydrated, fetchCompanyDetails]);


  if (!isHydrated || loading) return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[#101010]">
      <div className="relative">
        <Cpu className="h-12 w-12 text-amber-600 animate-spin opacity-20" />
        <Activity className="absolute inset-0 h-12 w-12 text-amber-600 animate-pulse" />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-600/40 italic">Iniciando Protocolo de Acesso...</p>
    </div>
  );

  if (!activeCompanyId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#101010] p-10 text-center gap-8">
        <div className="p-8 border border-white/5 bg-[#141414] shadow-2xl">
          <Terminal size={48} className="text-slate-800 mx-auto mb-4" />
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white">Domínio Não Identificado</h2>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-2 italic">Acesse o mainframe para vincular uma unidade.</p>
        </div>
        <button
          onClick={() => router.push('/select-company')}
          className="bg-white text-black px-10 py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-amber-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          Retornar ao Login
        </button>
      </div>
    );
  }

  if (!activeCompany) return <div className="p-10 text-center text-rose-600 font-mono text-[10px] uppercase tracking-widest">Protocol_Error: Connection Timed Out.</div>;

  return (
    <main className="min-h-screen bg-[#101010] text-slate-400 font-sans pb-12 selection:bg-amber-600/30">

      {/* VESTÍGIO ANALÓGICO (Scanlines) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="mx-auto max-w-8xl p-6 sm:p-2 space-y-10">

        {/* DOSSIÊ CARD PRINCIPAL */}


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">


          <div className="lg:col-span-6 space-y-10">
            <CompanyDossier activeCompany={activeCompany} />
          </div>
          {/* SIDE COLUMN */}
          <div className="lg:col-span-3 space-y-10">
            <TelemetryData
              stats={{
                jobs_deployed: activeCompany?.active_jobs_count || 14,
                inflows: activeCompany?.total_applications || 128
              }}
            />
          </div>

          <div className="lg:col-span-3 space-y-10">

            <QuickActions
              onDeployStaff={() => toast.info("Manual Override em breve")}
              onFetchAudit={() => toast.info("Manual Override em breve")}
            />
          </div>
          <div className="lg:col-span-6 space-y-10">
            <PersonnelIndex
              members={activeCompany?.members || []}
              onInspectMember={(id) => console.log(`Inspecionando unidade: ${id}`)}
            />
          </div>
          <div className="lg:col-span-6 space-y-10">

            <SubscriptionDossier
              planName={activeCompany?.subscription?.plan_name || "Nexus_Trial"}
              price={activeCompany?.subscription?.price_formatted || "0,00 / MO"}
              features={[
                "Unlimited_Deployments",
                "Staff_Hierarchy_Control",
                "Telemetry_Realtime_Sync",
                "Audit_Log_Retention_30D"
              ]}
            />

          </div>
          <DepartmentGrid
            departments={activeCompany?.departments}
            onInspect={(id: string) => openSectorDetails(id)}
            className='col-span-1 md:col-span-6 lg:col-span-12 space-y-10'
          />
        </div>
      </div>

      <FooterHUD />

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 6s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d97706; }
      `}</style>
    </main>
  );
}