"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/useCompanyStore';
import {
  Building2, Users, Star, CreditCard,
  CheckCircle2, Crown, ArrowLeft, Settings,
  Briefcase, HardHat, ShieldCheck, MapPin,
  ClipboardList, Plus, ExternalLink, TrendingUp
} from 'lucide-react';
import { toast } from '@/components/Notification';
import { useAuthStore } from '@/store/useAuthStore';

export interface CompanyMember {
  id: number;
  profile: number;
  profile_name: string;
  role: string;
  joined_at: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  leaders_detail: CompanyMember[];
  members_count: number;
  created_at: string;
}

export interface CompanyData {
  id: string;
  name: string;
  average_rate: number;
  members_count: number;
  members: CompanyMember[];
  departments: Department[];
  is_active: boolean;
}

const CURRENT_SUBSCRIPTION = {
  planName: "Enterprise Ops",
  price: "R$ 890,00/mês",
  features: ["Gestão de Equipes", "Módulo de Logística", "Relatórios em tempo real"]
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
  console.log("activeCompany:", activeCompany);
  console.log("isHydrated:", activeCompanyId);
  if (!isHydrated || loading) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="animate-pulse font-medium text-slate-500">Sincronizando infraestrutura corporativa...</p>
    </div>
  );

  if (!activeCompanyId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-10 text-center gap-4">
        <Building2 size={48} className="text-slate-300" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">Nenhuma empresa selecionada</h2>
          <p className="text-slate-500">Selecione uma organização para visualizar o painel corporativo.</p>
        </div>
        <button
          onClick={() => router.push('/select-company')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Selecionar Empresa
        </button>
      </div>
    );
  }

  if (!activeCompany) return <div className="p-10 text-center">Erro ao carregar dados da empresa.</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl justify-between items-center">
          <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-600 transition-all font-medium hover:text-indigo-600">
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Voltar ao Dashboard</span>
          </button>
          <div className="flex gap-3">
            <button className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <ExternalLink size={16} /> Ver Vagas Públicas
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-transform active:scale-95">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-200">
              <Building2 size={56} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-900">{activeCompany.name}</h1>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={16} className="text-indigo-500" /> Rio de Janeiro, RJ
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Users size={16} className="text-indigo-500" /> {activeCompany.members_count} Colaboradores
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <TrendingUp size={16} className="text-indigo-500" /> {activeCompany.departments?.length || 0} Setores Ativos
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-3xl bg-slate-50 border border-slate-100 px-8 py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Score</span>
              <div className="flex items-center gap-2 text-3xl font-black text-slate-800">
                <Star size={28} className="fill-amber-400 text-amber-400" />
                {activeCompany.average_rate?.toFixed(1) || "0.0"}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Briefcase className="text-indigo-500" size={22} />
                  Estrutura de Departamentos
                </h2>
                <button className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Plus size={18} /> Novo Setor
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCompany.departments?.map((dept: any) => (
                  <div key={dept.id} className="group relative rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <HardHat size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 font-mono">ID: {String(dept.id).slice(0, 8)}</span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">{dept.name}</h4>

                    <div className="mt-1 flex items-center gap-2">
                      {dept.leaders_detail?.length === 1 ? (
                        <p className="text-sm font-medium text-indigo-600">
                          Líder: <span className="text-slate-700">{dept.leaders_detail[0].profile_name}</span>
                        </p>
                      ) : dept.leaders_detail?.length > 1 ? (
                        <div className="group/tooltip relative cursor-help">
                          <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                            <Crown size={14} className="text-amber-500" />
                            {dept.leaders_detail.length} Líderes selecionados
                          </p>
                          <div className="absolute bottom-full left-0 mb-2 hidden w-48 rounded-lg bg-slate-900 p-2 text-[11px] text-white shadow-xl group-hover/tooltip:block z-50">
                            <p className="mb-1 border-b border-white/10 pb-1 font-bold text-slate-400 uppercase tracking-widest">Liderança:</p>
                            {dept.leaders_detail.map((leader: any) => (
                              <div key={leader.id} className="py-0.5">• {leader.profile_name}</div>
                            ))}
                            <div className="absolute left-4 top-full h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm italic text-slate-400">Sem liderança definida</p>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{dept.description || "Setor focado em operações diretas."}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex -space-x-2">
                        {dept.leaders_detail?.map((leader: any) => (
                          <div key={leader.id} className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-1 ring-slate-200" title={leader.profile_name}>
                            {leader.profile_name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Users size={14} className="text-slate-400" />
                        {dept.members_count} Membros
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <ShieldCheck className="text-indigo-500" size={22} />
                  Quadro de Colaboradores
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-4">Colaborador</th>
                      <th className="px-6 py-4">Função</th>
                      <th className="px-6 py-4">Entrada</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCompany.members?.map((member: any) => (
                      <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                              {member.profile_name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-700">{member.profile_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-tighter ${member.role === 'RECRUITER' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <ExternalLink size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl">
              <div className="absolute -right-10 -top-10 rotate-12 text-white/5">
                <Crown size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xl border border-white/10">
                    <CreditCard className="text-indigo-400" />
                  </div>
                  <span className="rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-black tracking-widest italic uppercase">Enterprise</span>
                </div>

                <h3 className="text-2xl font-black italic tracking-tight">{CURRENT_SUBSCRIPTION.planName}</h3>
                <p className="mt-1 text-indigo-300 font-medium">{CURRENT_SUBSCRIPTION.price}</p>

                <ul className="mt-8 space-y-3">
                  {CURRENT_SUBSCRIPTION.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 size={16} className="text-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button onClick={() => toast.info("Módulo de faturamento em breve")} className="mt-10 w-full rounded-2xl bg-white py-4 text-sm font-black text-slate-900 transition-all hover:bg-slate-100 active:scale-95 shadow-lg shadow-white/5">
                  UPGRADE / GESTÃO
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                <TrendingUp size={16} /> Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vagas Abertas</p>
                  <p className="text-2xl font-black text-slate-800">14</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Candidaturas</p>
                  <p className="text-2xl font-black text-slate-800">128</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 p-6 shadow-sm bg-white">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                <ClipboardList size={16} className="text-indigo-500" /> Operações
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100">
                  Escalar Nova Equipe <Plus size={16} />
                </button>
                <button className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100">
                  Relatório de Produtividade <ExternalLink size={16} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}