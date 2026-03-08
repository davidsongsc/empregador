"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import {
  Building2, Users, Star, CreditCard,
  CheckCircle2, Crown, ArrowLeft, Settings,
  Briefcase, HardHat, ShieldCheck, MapPin,
  ClipboardList, Plus, ExternalLink, TrendingUp, Cpu, Activity
} from 'lucide-react';
import { toast } from '@/components/Notification';
import { useAuthStore } from '@/store/useAuthStore';
const CURRENT_SUBSCRIPTION = {
  planName: "Enterprise Ops",
  price: "R$ 890,00/mês",
  features: [
    "Gestão de Equipes",
    "Módulo de Logística",
    "Relatórios em tempo real"
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
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#080808]">
      <Cpu className="h-10 w-10 text-amber-600 animate-spin" />
      <p className="animate-pulse font-mono text-[10px] uppercase tracking-[0.4em] text-amber-600/60">Sincronizando infraestrutura Delos...</p>
    </div>
  );

  if (!activeCompanyId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#080808] p-10 text-center gap-6">
        <div className="relative p-6 border border-white/5 bg-white/[0.02]">
          <Building2 size={48} className="text-slate-800" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Organização não identificada</h2>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-2">Selecione uma empresa para acessar o terminal.</p>
        </div>
        <button
          onClick={() => router.push('/select-company')}
          className="border border-amber-600 text-amber-600 px-8 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 hover:text-black transition-all"
        >
          Acessar Terminal
        </button>
      </div>
    );
  }

  if (!activeCompany) return <div className="p-10 text-center text-rose-500 font-mono text-xs uppercase">Erro de comunicação com o host corporativo.</div>;

  return (
    <main className="min-h-screen bg-[#080808] text-slate-400 font-sans pb-20 selection:bg-amber-500/30">

      {/* HUD HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0A0A0A]/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl justify-between items-center">
          <button onClick={() => router.back()} className="group flex items-center gap-3 text-slate-500 transition-all font-black text-[10px] uppercase tracking-widest hover:text-amber-500">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Retornar ao Painel</span>
          </button>

          <div className="flex gap-3">
            <button className="hidden sm:flex items-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-amber-600/50 hover:text-amber-500 transition-all">
              <ExternalLink size={14} /> Vagas Públicas
            </button>
            <button className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.02] text-slate-400 hover:text-amber-600 hover:border-amber-600 transition-all active:scale-95">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-8 space-y-8">

        {/* COMPANY DOSSIER CARD */}
        <section className="relative overflow-hidden border border-white/5 bg-[#0D0D0D] p-10">
          {/* Efeito decorativo de fundo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[120px] -mr-40 -mt-40" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center lg:items-end">
            <div className="relative group">
              <div className="absolute inset-0 border border-amber-600/30 group-hover:border-amber-600 transition-colors -m-2" />
              <div className="flex h-32 w-32 items-center justify-center bg-slate-900 text-amber-600 border border-white/10 relative overflow-hidden">
                <Building2 size={56} strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent h-full w-full animate-scan pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-white leading-none">{activeCompany.name}</h1>
                <span className="flex items-center gap-2 border border-emerald-900/30 px-3 py-1 text-[9px] font-black text-emerald-500 tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operacional
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-slate-600">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={14} className="text-amber-900" /> Rio de Janeiro, RJ
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <Users size={14} className="text-amber-900" /> {activeCompany.members_count} Unidades
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <TrendingUp size={14} className="text-amber-900" /> {activeCompany.departments?.length || 0} Setores
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 border border-white/10 bg-white/[0.01] px-10 py-6">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">Corp Rating</span>
              <div className="flex items-center gap-3 text-3xl font-black text-white">
                <Star size={24} className="fill-amber-600 text-amber-600" />
                {activeCompany.average_rate?.toFixed(1) || "0.0"}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-8">

            {/* DEPARTMENTS SECTION */}
            <section className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-6">
                <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  <Briefcase className="text-amber-600" size={16} />
                  Arquitetura de Departamentos
                </h2>
                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-500 transition-colors">
                  <Plus size={14} strokeWidth={3} /> Inserir Setor
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                {activeCompany.departments?.map((dept: any) => (
                  <div key={dept.id} className="group relative bg-[#0A0A0A] p-6 hover:bg-white/[0.02] transition-all">
                    <div className="absolute left-0 top-6 bottom-6 w-[1px] bg-amber-900/30 group-hover:bg-amber-600 transition-all" />

                    <div className="mb-6 flex items-center justify-between">
                      <div className="border border-white/10 p-2 text-slate-600 group-hover:text-amber-600 group-hover:border-amber-900/50 transition-all">
                        <HardHat size={20} />
                      </div>
                      <span className="text-[8px] font-mono text-slate-800 uppercase tracking-widest">Hash_{String(dept.id).slice(0, 6)}</span>
                    </div>

                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">{dept.name}</h4>

                    <div className="mt-1">
                      {dept.leaders_detail?.length > 0 ? (
                        <p className="text-[10px] font-bold text-amber-900 uppercase tracking-tighter">
                          Liderança: <span className="text-slate-500">{dept.leaders_detail[0].profile_name}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] italic text-slate-800 uppercase">Sem comando definido</p>
                      )}
                    </div>

                    <p className="mt-4 text-[11px] text-slate-600 leading-relaxed font-light italic border-l border-white/5 pl-4 line-clamp-2">
                      {dept.description || "Setor focado em operações diretas e logística estratégica."}
                    </p>

                    <div className="mt-8 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        {dept.leaders_detail?.map((leader: any) => (
                          <div key={leader.id} className="h-6 w-6 border border-[#0A0A0A] bg-slate-900 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase tracking-tighter ring-1 ring-white/5">
                            {leader.profile_name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-700 uppercase tracking-widest">
                        <Users size={12} /> {dept.members_count} Unidades
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MEMBERS TABLE */}
            <section className="border border-white/5 bg-[#0A0A0A] overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white">
                  <ShieldCheck className="text-amber-600" size={16} />
                  Quadro de Hosts Ativos
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.01] text-[9px] font-black uppercase tracking-[0.3em] text-slate-700">
                      <th className="px-8 py-5">Unidade / Perfil</th>
                      <th className="px-8 py-5">Protocolo (Role)</th>
                      <th className="px-8 py-5">Ativação</th>
                      <th className="px-8 py-5 text-right">Acesso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeCompany.members?.map((member: any) => (
                      <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-8 bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase transition-all group-hover:border-amber-900/50 group-hover:text-amber-600">
                              {member.profile_name.charAt(0)}
                            </div>
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{member.profile_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest ${member.role === 'RECRUITER' ? 'border-amber-900/30 text-amber-600' : 'border-slate-800 text-slate-500'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                          {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-slate-700 hover:text-amber-600 transition-colors">
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
          <div className="lg:col-span-4 space-y-8">

            {/* SUBSCRIPTION CARD */}
            <section className="relative overflow-hidden bg-[#0D0D0D] border border-amber-900/20 p-8 text-white">
              <div className="absolute -right-6 -top-6 rotate-12 text-amber-600/[0.03]">
                <Crown size={160} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="border border-amber-600/30 bg-amber-600/10 p-2.5">
                    <CreditCard className="text-amber-600" size={20} />
                  </div>
                  <span className="px-3 py-1 border border-amber-600 text-amber-600 text-[8px] font-black tracking-[0.3em] italic uppercase">Enterprise Ops</span>
                </div>

                <h3 className="text-xl font-black italic tracking-widest uppercase">{CURRENT_SUBSCRIPTION.planName}</h3>
                <p className="mt-2 text-amber-600/60 font-mono text-xs tracking-widest">{CURRENT_SUBSCRIPTION.price}</p>

                <ul className="mt-8 space-y-4">
                  {CURRENT_SUBSCRIPTION.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-amber-900" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button onClick={() => toast.info("Manual Override em breve")} className="mt-12 w-full bg-amber-600 py-4 text-[10px] font-black text-black uppercase tracking-[0.3em] transition-all hover:bg-amber-500 active:scale-95 shadow-[0_0_20px_rgba(217,119,6,0.15)]">
                  Upgrade / Protocolos
                </button>
              </div>
            </section>

            {/* QUICK STATS */}
            <section className="border border-white/5 bg-[#0A0A0A] p-8 space-y-8">
              <h3 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
                <Activity size={14} /> Telemetria de Dados
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] p-5 border border-white/5">
                  <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Vagas Abertas</p>
                  <p className="text-2xl font-black text-white italic">14</p>
                </div>
                <div className="bg-white/[0.02] p-5 border border-white/5">
                  <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Candidaturas</p>
                  <p className="text-2xl font-black text-white italic">128</p>
                </div>
              </div>
            </section>

            {/* OPERATIONS */}
            <section className="border border-white/5 bg-[#0A0A0A] p-8">
              <h3 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 mb-6">
                <ClipboardList size={14} className="text-amber-900" /> Operações
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button className="flex w-full items-center justify-between border border-white/5 bg-white/[0.02] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:text-amber-600 hover:border-amber-900/30">
                  Escalar Nova Equipe <Plus size={14} />
                </button>
                <button className="flex w-full items-center justify-between border border-white/5 bg-white/[0.02] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:text-amber-600 hover:border-amber-900/30">
                  Relatório de Produtividade <ExternalLink size={14} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* FOOTER HUD */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-8 bg-[#050505] border-t border-white/5 flex justify-between items-center z-30">
        <div className="flex items-center gap-4 text-[8px] font-mono text-slate-800 uppercase tracking-[0.4em]">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse rounded-full" />
            CORE_SYSTEM_REDUNDANT
          </span>
        </div>
        <div className="text-[8px] font-mono text-slate-800 italic opacity-40">
          "Evolution is not a graceful process."
        </div>
      </footer>

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </main>
  );
}