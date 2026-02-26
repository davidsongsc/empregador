"use client";

import ApplicationDashboard from '@/components/ApplicationDashboard';
import PerfilLoading from '@/components/PerfilLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useMyApplications } from '@/hooks/useMyApplications';
import {
  User, FileText, Bell, Clock, ChevronRight,
  Sparkles, Target, Zap, GraduationCap, TrendingUp,
  Briefcase, LogOut, MapPin
} from 'lucide-react';

const PerfilPage = () => {
  const { user, loading: authLoading, isAuthenticated, logoutUser } = useAuth();
  const { applications, loading: appsLoading, totalCount, approvedCount } = useMyApplications();

  // Bloqueio de acesso e Loading de inicialização
  if (authLoading || appsLoading) return <PerfilLoading />;
  if (!isAuthenticated) return null;

  // Mock de interesses (Podemos tornar dinâmico no futuro conforme o UserProfile)
  const sugestoesIA = [
    { titulo: "UI/UX Design", motivo: "Match com seu perfil Frontend", icon: <Zap className="w-4 h-4" /> },
    { titulo: "Gestão de Processos", motivo: "Alta demanda na sua região", icon: <Target className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* --- COLUNA LATERAL --- */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Card Usuário Premium */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={logoutUser} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Sair">
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
              {user?.profile?.foto ? (
                <img src={user.profile.foto} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>

            <h2 className="text-2xl font-black text-gray-900">{user?.profile?.name || 'Usuário'}</h2>
            <p className="text-sm text-indigo-600 font-bold uppercase tracking-widest mb-2">
              {user?.profile?.ocupation || 'Cargo não definido'}
            </p>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-6 font-medium">
              <MapPin className="w-3 h-3" />
              {user?.profile?.endereco?.cidade || 'Localização não informada'}
            </div>

            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300">
              Editar Perfil
            </button>
          </div>

          {/* Widget IA de Carreira */}
          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <h3 className="font-black text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-300" /> Insights de Carreira
            </h3>
            <div className="space-y-4">
              {sugestoesIA.map((item, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group/item">
                  <p className="text-[10px] font-black uppercase text-indigo-200 mb-1">{item.motivo}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm flex items-center gap-2 italic">
                      {item.icon} {item.titulo}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover/item:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Currículo Estruturado */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Documentos
            </h3>
            <div className="border-2 border-dashed border-indigo-50 bg-indigo-50/30 rounded-2xl p-6 text-center group cursor-pointer hover:bg-indigo-50 transition-colors">
              <div className="bg-white w-10 h-10 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-[10px] text-gray-500 mb-3 font-black uppercase tracking-tighter">Currículo Atualizado 2026</p>
              <button className="text-[10px] font-black text-indigo-600 hover:tracking-widest transition-all uppercase">Substituir PDF</button>
            </div>
          </div>
        </aside>

        {/* --- COLUNA PRINCIPAL --- */}
        <main className="lg:col-span-8 space-y-8">

          {/* Dashboard de Status */}
          <ApplicationDashboard applications={applications} totalCount={totalCount} />

          {/* Cards de Expansão (IA & Notificações) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-indigo-600 transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Cursos recomendados</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Baseado no seu histórico, você teria 90% mais chances com certificação em <b>Metodologias Ágeis</b>.
              </p>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Ver recomendações <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-green-600 transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Alertas ativos</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                Monitorando novas vagas para <b>{user?.profile?.ocupation || 'sua área'}</b> em tempo real.
              </p>
              <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                Configurar Alertas <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerfilPage;