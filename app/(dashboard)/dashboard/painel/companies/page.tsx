"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import {
  Building2, Users, Star, CreditCard,
  CheckCircle2, Crown, ArrowLeft, Settings,
  Briefcase, HardHat, ShieldCheck, MapPin,
  ClipboardList, Plus, ExternalLink, TrendingUp, Cpu, Activity, Terminal, Crosshair,
  Fingerprint
} from 'lucide-react';
import { toast } from '@/components/Notification';
import { useAuthStore } from '@/store/useAuthStore';

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
    <main className="min-h-screen bg-[#101010] text-slate-400 font-sans pb-24 selection:bg-amber-600/30">

      {/* VESTÍGIO ANALÓGICO (Scanlines) */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* HEADER HUD */}
      <header className="sticky top-0 z-40 border-b border-white/[0.03] bg-[#141414]/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl justify-between items-center">
          <button onClick={() => router.back()} className="group flex items-center gap-3 text-slate-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] hover:text-amber-500">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Retornar_Sequence</span>
          </button>

          <div className="flex gap-4">
            <button className="hidden sm:flex items-center gap-2 border border-white/5 bg-white/[0.02] px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-amber-600/40 hover:text-amber-500 transition-all">
              <ExternalLink size={12} /> Global_Feed
            </button>
            <button className="flex h-10 w-10 items-center justify-center border border-white/5 bg-white/[0.02] text-slate-700 hover:text-amber-600 hover:border-amber-600/30 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-8xl p-6 sm:p-10 space-y-10">

        {/* DOSSIÊ CARD PRINCIPAL */}
        <section className="relative overflow-hidden border border-white/[0.03] bg-[#141414] shadow-2xl p-8 sm:p-12">
          {/* Luz de fundo sutil */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/[0.03] rounded-full blur-[100px] -mr-32 -mt-32" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center lg:items-end">
            <div className="relative">
              <div className="absolute -inset-2 border border-amber-600/20 shadow-[0_0_15px_rgba(217,119,6,0.1)]" />
              <div className="flex h-36 w-36 items-center justify-center bg-black text-amber-600 border border-white/5 relative overflow-hidden group">
                <Building2 size={64} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <h1 className="text-4xl font-light tracking-tighter uppercase text-white leading-none">
                  {activeCompany.name} <span className="font-black italic opacity-20 text-slate-400">//</span>
                </h1>
                <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[8px] font-black text-emerald-500 tracking-[0.3em] uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  Active_Status
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Localização</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-slate-400">
                    <MapPin size={12} className="text-amber-900" /> RIO_DE_JANEIRO, BR
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">População_Hosts</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-slate-400">
                    <Users size={12} className="text-amber-900" /> {activeCompany.members_count} Units
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Arquitetura</span>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-slate-400">
                    <TrendingUp size={12} className="text-amber-900" /> {activeCompany.departments?.length || 0} Sectors
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 border border-white/5 bg-black/40 px-12 py-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-600/30" />
              <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Unit_Fidelity</span>
              <div className="flex items-center gap-4 text-4xl font-light text-white italic">
                <Crosshair size={24} className="text-amber-600 opacity-50" />
                {activeCompany.average_rate?.toFixed(1) || "0.0"}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-10">

            {/* DEPARTMENTS SECTION */}
            <div className="p-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-white/[0.03]">
              {activeCompany.departments?.map((dept: any) => {

                // CORREÇÃO DE ESCOPO: Definimos o filtro dentro do loop para cada 'dept'
                const linkedMembers = activeCompany.members?.filter((m: any) => {
                  // Verifica se o perfil do membro (ID 7, 8, etc) está na lista de líderes deste departamento
                  return dept.leaders_detail?.some((leader: any) => leader.profile === m.profile);
                });

                return (
                  <div key={dept.id} className="group relative bg-[#141414] p-8 hover:bg-[#161616] transition-all flex flex-col h-[520px]">
                    {/* Indicador de Atividade Lateral */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-amber-600 transition-all shadow-[0_0_10px_#d97706]" />

                    {/* HEADER DO SETOR */}
                    <div className="mb-6 flex items-center justify-between shrink-0">
                      <div className="p-3 bg-black border border-white/5 text-slate-700 group-hover:text-amber-500 group-hover:border-amber-600/20 transition-all">
                        <HardHat size={20} />
                      </div>
                      <div className="text-right">
                        <span className="block text-[7px] font-black text-slate-700 uppercase tracking-[0.4em]">Sector_Hash</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter italic">
                          #{String(dept.id).slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <h4 className="text-xl font-light text-slate-200 uppercase tracking-tight mb-1 group-hover:text-white transition-colors">
                        {dept.name}
                      </h4>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-[1px] w-4 bg-amber-900" />
                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest italic">
                          High_Auth: <span className="text-slate-400 not-italic uppercase">
                            {dept.leaders_detail?.[0]?.profile_name || "N/A"}
                          </span>
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed font-mono tracking-tighter mb-6 line-clamp-2 opacity-80 border-l border-white/5 pl-4 italic">
                        {dept.description || "Diretriz operacional padrão: Processamento de fluxos logísticos."}
                      </p>
                    </div>

                    {/* PAINEL DE UNIDADES VINCULADAS (SCROLLABLE) */}
                    <div className="flex-1 flex flex-col min-h-0 bg-black/40 border border-white/5 p-4 relative group/terminal">
                      <div className="flex items-center justify-between mb-4 sticky top-0 z-10">
                        <span className="text-[7px] font-black text-amber-600/40 uppercase tracking-[0.3em]">Equipe_Unidade</span>
                        <div className="h-[1px] flex-1 ml-4 bg-white/5" />
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {linkedMembers && linkedMembers.length > 0 ? (
                          linkedMembers.map((member: any) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 hover:bg-white/[0.03] border border-transparent hover:border-white/5 group/unit transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-7 w-7 bg-slate-900 border border-white/10 flex items-center justify-center text-[9px] font-black text-slate-600 group-hover/unit:text-amber-500 group-hover/unit:border-amber-600/30 transition-all relative overflow-hidden shrink-0">
                                  {member.profile_name.charAt(0)}
                                  <div className="absolute inset-0 bg-amber-500/5 animate-scan opacity-0 group-hover/unit:opacity-100" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wide group-hover/unit:text-white truncate">
                                    {member.profile_name}
                                  </p>
                                  <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter group-hover/unit:text-amber-600/60 transition-colors">
                                    Protocol::{member.role}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end shrink-0">
                                <div className="w-1 h-1 bg-emerald-500 shadow-[0_0_5px_#10b981] rounded-full animate-pulse" />
                                <span className="text-[6px] font-mono text-slate-800 uppercase mt-1">Online</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-10 py-10 grayscale">
                            <Fingerprint size={32} className="text-slate-500 mb-2" />
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] italic text-center leading-relaxed">
                              Aguardando_Vinculação<br />Local_Scan: Null
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none opacity-60" />
                    </div>

                    {/* FOOTER DO CARD */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[6px] font-black text-slate-700 uppercase tracking-widest">Linked_Units</span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {linkedMembers?.length || 0} / {dept.members_count || 0}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white/5 border border-white/10 text-[8px] font-black text-slate-500 hover:text-white hover:bg-amber-600 hover:border-amber-600 uppercase tracking-[0.2em] transition-all">
                        Inspect_Sector
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MEMBERS LIST */}
            <section className="border border-white/[0.03] bg-[#141414] shadow-xl overflow-hidden">
              <div className="px-8 py-5 border-b border-white/[0.03] bg-white/[0.01]">
                <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  <ShieldCheck className="text-amber-600 opacity-50" size={14} />
                  Registry_Personnel_Index
                </h2>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.01] text-[8px] font-black uppercase tracking-[0.4em] text-slate-700">
                      <th className="px-8 py-5">Profile_ID</th>
                      <th className="px-8 py-5">Auth_Protocol</th>
                      <th className="px-8 py-5">Link_Date</th>
                      <th className="px-8 py-5 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {activeCompany.members?.map((member: any) => (
                      <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-8 bg-black border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-700 uppercase transition-all group-hover:border-amber-600/30 group-hover:text-amber-600">
                              {member.profile_name.charAt(0)}
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">{member.profile_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-0.5 border text-[7px] font-black uppercase tracking-[0.2em] ${member.role === 'RECRUITER' ? 'border-amber-600/30 text-amber-600 bg-amber-600/5' : 'border-slate-800 text-slate-600'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-[10px] font-mono text-slate-600 uppercase italic">
                          {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="text-slate-800 hover:text-white transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* SIDE COLUMN */}
          <div className="lg:col-span-4 space-y-10">

            {/* SUBSCRIPTION DOSSIER */}
            <section className="relative overflow-hidden bg-[#181818] border border-white/5 p-8 shadow-2xl">
              <div className="absolute -right-8 -top-8 rotate-12 text-amber-600/[0.02]">
                <Crown size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <div className="bg-amber-600 p-3 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                    <CreditCard className="text-black" size={20} />
                  </div>
                  <span className="text-[7px] font-black text-amber-600 uppercase tracking-[0.4em] italic border-b border-amber-600/20 pb-1">Operational_License</span>
                </div>

                <h3 className="text-2xl font-light italic tracking-tighter uppercase text-white">{CURRENT_SUBSCRIPTION.planName}</h3>
                <p className="mt-2 text-slate-500 font-mono text-[10px] tracking-widest uppercase">{CURRENT_SUBSCRIPTION.price}</p>

                <ul className="mt-10 space-y-5">
                  {CURRENT_SUBSCRIPTION.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <div className="w-1 h-1 bg-amber-600" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button onClick={() => toast.info("Manual Override em breve")} className="mt-12 w-full bg-white py-4 text-[9px] font-black text-black uppercase tracking-[0.4em] transition-all hover:bg-amber-600 hover:text-white active:scale-95 shadow-2xl">
                  Re-calibrate_Plan
                </button>
              </div>
            </section>

            {/* TELEMETRY */}
            <section className="border border-white/5 bg-[#141414] p-8 space-y-8 shadow-xl">
              <h3 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
                <Activity size={14} className="text-amber-600 animate-pulse" /> Telemetria_Data
              </h3>
              <div className="grid grid-cols-2 gap-[1px] bg-white/5 border border-white/5">
                <div className="bg-[#101010] p-6 text-center group hover:bg-black transition-all">
                  <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Vagas_Deploy</p>
                  <p className="text-3xl font-light text-white italic group-hover:text-amber-600 transition-colors">14</p>
                </div>
                <div className="bg-[#101010] p-6 text-center group hover:bg-black transition-all">
                  <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Inflows</p>
                  <p className="text-3xl font-light text-white italic group-hover:text-amber-600 transition-colors">128</p>
                </div>
              </div>
            </section>

            {/* QUICK OPERATIONS */}
            <section className="border border-white/5 bg-[#141414] p-8 shadow-xl">
              <h3 className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700 mb-8">
                <ClipboardList size={14} className="opacity-20" /> Quick_Actions
              </h3>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-between border border-white/5 bg-black/20 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-amber-500 hover:bg-black group">
                  Deploy_New_Staff <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                </button>
                <button className="flex w-full items-center justify-between border border-white/5 bg-black/20 px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-amber-500 hover:bg-black">
                  Fetch_Audit_Log <Terminal size={14} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* FOOTER HUD */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 px-10 bg-[#0A0A0A] border-t border-white/[0.03] flex justify-between items-center z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[8px] font-mono text-slate-700 uppercase tracking-[0.4em]">
            <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse rounded-full shadow-[0_0_5px_#d97706]" />
            MAINFRAME_LINK: SECURE
          </div>
          <span className="text-[8px] font-mono text-slate-800 uppercase tracking-widest hidden md:block">
            Last_Sync: {new Date().toLocaleTimeString()}
          </span>
        </div>
        <div className="text-[9px] font-mono text-amber-600/30 uppercase tracking-widest italic animate-pulse">
          "These violent delights have violent ends."
        </div>
      </footer>

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