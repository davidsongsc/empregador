"use client";

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Search, 
  Plus, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Globe,
  Settings,
  ShieldCheck,
  FileSearch,
  Activity,
  Download,
  Sparkles
} from 'lucide-react';

/**
 * --- TIPAGEM E MOCKS ---
 */

interface Company {
  id: string;
  name: string;
  domain: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Pendente' | 'Inativo';
  usersCount: number;
  mrr: number;
  createdAt: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Segurança' | 'Faturação' | 'Sistema' | 'Empresa';
  description: string;
  ip: string;
  severity: 'Baixa' | 'Média' | 'Crítica';
}

const companiesMock: Company[] = [
  { id: '1', name: 'Bar do João', domain: 'bardojoao.com', plan: 'Pro', status: 'Ativo', usersCount: 24, mrr: 299.00, createdAt: '2024-01-15' },
  { id: '2', name: 'Tech Solutions', domain: 'techsol.io', plan: 'Enterprise', status: 'Ativo', usersCount: 156, mrr: 1499.00, createdAt: '2023-11-20' },
  { id: '3', name: 'Eventos Master', domain: 'em.events', plan: 'Basic', status: 'Pendente', usersCount: 5, mrr: 99.00, createdAt: '2024-03-01' },
  { id: '4', name: 'Global Logistics', domain: 'global.log', plan: 'Pro', status: 'Inativo', usersCount: 42, mrr: 0, createdAt: '2023-08-10' },
];

const auditLogsMock: AuditLog[] = [
  { id: 'a1', timestamp: '2024-03-07 10:24:15', user: 'Ricardo Silva', action: 'Upgrade de Plano', category: 'Faturação', description: 'Tech Solutions mudou de Pro para Enterprise', ip: '192.168.1.45', severity: 'Média' },
  { id: 'a2', timestamp: '2024-03-07 09:12:05', user: 'Sistema', action: 'Backup Concluído', category: 'Sistema', description: 'Backup diário realizado com sucesso no S3', ip: '127.0.0.1', severity: 'Baixa' },
  { id: 'a3', timestamp: '2024-03-06 22:45:30', user: 'Desconhecido', action: 'Falha de Login', category: 'Segurança', description: '5 tentativas falhadas para admin@saascore.pt', ip: '45.12.88.2', severity: 'Crítica' },
  { id: 'a4', timestamp: '2024-03-06 15:20:00', user: 'Ana Costa', action: 'Criação de Empresa', category: 'Empresa', description: 'Nova empresa registada: Eventos Master', ip: '185.22.10.4', severity: 'Baixa' },
  { id: 'a5', timestamp: '2024-03-06 14:10:12', user: 'Tiago Ferreira', action: 'Alteração de Permissões', category: 'Segurança', description: 'Nível de acesso de "Gestor" atualizado para "Admin"', ip: '192.168.1.10', severity: 'Média' },
];

/**
 * --- COMPONENTES AUXILIARES ---
 */

const MetricCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-black ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
  </div>
);

/**
 * --- COMPONENTE PRINCIPAL ---
 */
export default function SaaSAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'people' | 'billing' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros de busca para empresas
  const filteredCompanies = useMemo(() => {
    return companiesMock.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Filtros de busca para auditoria
  const filteredLogs = useMemo(() => {
    return auditLogsMock.filter(log => 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 hidden lg:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">SaaS<span className="text-indigo-600">Core</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'companies', label: 'Empresas', icon: Building2 },
            { id: 'people', label: 'Pessoas', icon: Users },
            { id: 'billing', label: 'Assinaturas', icon: CreditCard },
            { id: 'audit', label: 'Auditoria', icon: FileSearch },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
            <Settings className="w-5 h-5" />
            Definições
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-grow p-8 lg:p-12 max-h-screen overflow-y-auto custom-scrollbar">
        
        {/* CABEÇALHO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              {activeTab === 'overview' && "Dashboard Admin"}
              {activeTab === 'companies' && "Gestão de Empresas"}
              {activeTab === 'people' && "Diretório de Pessoas"}
              {activeTab === 'billing' && "Faturamento SaaS"}
              {activeTab === 'audit' && "Registos de Auditoria"}
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {activeTab === 'audit' ? "Monitorize todas as atividades e eventos críticos do sistema." : "Bem-vindo ao centro operacional do seu ecossistema."}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder={activeTab === 'audit' ? "Procurar utilizador ou ação..." : "Procurar empresa..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>
            {activeTab === 'audit' ? (
              <button className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" /> <span className="hidden md:inline font-black text-[10px] uppercase tracking-widest">Exportar</span>
              </button>
            ) : (
              <button className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* VISÃO GERAL - MÉTRICAS */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="MRR Atual" value="€ 24.590" trend={12.5} icon={TrendingUp} color="bg-emerald-500" />
              <MetricCard title="Empresas Ativas" value="142" trend={8.2} icon={Building2} color="bg-indigo-500" />
              <MetricCard title="Total de Usuários" value="3.842" trend={24.1} icon={Users} color="bg-violet-500" />
              <MetricCard title="Novas Assinaturas" value="28" trend={-2.4} icon={CheckCircle2} color="bg-amber-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* LISTA RÁPIDA DE EMPRESAS */}
              <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" /> Empresas Recentes
                  </h3>
                  <button onClick={() => setActiveTab('companies')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Ver todas</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/10">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Empresa</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Plano</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">MRR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCompanies.slice(0, 4).map((company) => (
                        <tr key={company.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">
                                {company.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{company.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                  <Globe className="w-3 h-3" /> {company.domain}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                              company.plan === 'Enterprise' ? 'bg-indigo-100 text-indigo-600' :
                              company.plan === 'Pro' ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {company.plan}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex justify-center">
                              {company.status === 'Ativo' ? (
                                <div className="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                              ) : company.status === 'Pendente' ? (
                                <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg"><Clock className="w-4 h-4" /></div>
                              ) : (
                                <div className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-slate-900 text-sm italic">
                            € {company.mrr.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ATIVIDADES RECENTES */}
              <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                <Sparkles className="absolute -right-10 -top-10 w-48 h-48 opacity-10 rotate-12" />
                <h3 className="font-black text-lg mb-8 uppercase tracking-widest italic text-indigo-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> SaaS Insights
                </h3>
                <div className="space-y-6">
                  {[
                    { text: "Novo upgrade de plano na Tech Solutions", time: "Há 2 horas", icon: <CheckCircle2 className="text-emerald-400" /> },
                    { text: "Assinatura pendente: Eventos Master", time: "Há 5 horas", icon: <Clock className="text-amber-400" /> },
                    { text: "Backup do sistema concluído com sucesso", time: "Há 1 dia", icon: <Globe className="text-indigo-400" /> },
                    { text: "Taxa de Churn reduziu 1.2% este mês", time: "Insight Mensal", icon: <TrendingUp className="text-emerald-400" /> },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div>
                        <p className="text-sm font-bold text-slate-200">{item.text}</p>
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-10 bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                  Gerar Relatório Full
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECÇÃO DE AUDITORIA */}
        {activeTab === 'audit' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* FILTROS RÁPIDOS */}
            <div className="flex flex-wrap gap-3">
              {['Todos', 'Segurança', 'Faturação', 'Sistema', 'Empresa'].map((filter) => (
                <button 
                  key={filter}
                  className="bg-white border border-slate-100 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/10">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Evento / Data</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Utilizador</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ação</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Severidade</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              log.category === 'Segurança' ? 'bg-rose-50 text-rose-500' :
                              log.category === 'Faturação' ? 'bg-emerald-50 text-emerald-500' :
                              log.category === 'Sistema' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {log.category === 'Segurança' ? <ShieldCheck className="w-4 h-4" /> :
                               log.category === 'Faturação' ? <CreditCard className="w-4 h-4" /> :
                               log.category === 'Sistema' ? <Activity className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{log.description}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.timestamp}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 italic">
                               {log.user.charAt(0)}
                             </div>
                             <span className="font-bold text-xs text-slate-600">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-3 py-1 bg-slate-50 rounded-lg">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                log.severity === 'Crítica' ? 'bg-rose-500 animate-pulse' :
                                log.severity === 'Média' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                log.severity === 'Crítica' ? 'text-rose-500' :
                                log.severity === 'Média' ? 'text-amber-500' : 'text-emerald-500'
                              }`}>
                                {log.severity}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <code className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            {log.ip}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-slate-50/30 border-t border-slate-50 text-center">
                 <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors">Carregar mais registos históricos</button>
              </div>
            </div>
          </div>
        )}

        {/* MENSAGEM DE PLACEHOLDER PARA OUTRAS ABAS */}
        {activeTab !== 'overview' && activeTab !== 'audit' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center mb-6 shadow-xl shadow-slate-100 rotate-6">
               <Building2 className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Módulo em Desenvolvimento</h2>
            <p className="text-slate-400 font-bold max-w-sm text-center mt-2">
              A secção de <span className="text-indigo-600 uppercase">{activeTab}</span> está a ser sincronizada com os seus modelos de dados.
            </p>
            <button 
              onClick={() => setActiveTab('overview')}
              className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] group"
            >
              Voltar ao Início <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}

      </main>
    </div>
  );
}