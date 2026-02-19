"use client";

import { 
  User, FileText, Bell, Settings, Clock, 
  ChevronRight, Sparkles, Target, Zap, 
  GraduationCap, TrendingUp 
} from 'lucide-react';
import Link from 'next/link';

const PerfilPage = () => {
  const minhasCandidaturas = [
    { id: 1, cargo: "Frontend Developer", empresa: "TechSoluções", status: "Em Análise", data: "12/02/2026", categoria: "Tecnologia" },
    { id: 2, cargo: "Auxiliar Admin", empresa: "LogiTrans", status: "Entrevista Marcada", data: "10/02/2026", categoria: "Administrativo" },
  ];

  // Mock de interesses baseados no comportamento
  const sugestoesBaseadasEmInteresse = [
    { titulo: "UI/UX Design", motivo: "Baseado em sua vaga de Frontend", icon: <Zap className="w-4 h-4" /> },
    { titulo: "Gestão de Processos", motivo: "Relacionado a Auxiliar Admin", icon: <Target className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* --- COLUNA LATERAL (Info & IA) --- */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Card Usuário */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900">João da Silva</h2>
            <p className="text-sm text-gray-500 font-medium mb-6">Desenvolvedor Frontend</p>
            <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all">
              Editar Perfil
            </button>
          </div>

          {/* Card de Inteligência / Interesses */}
          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <Sparkles className="absolute -right-2 -top-2 w-24 h-24 opacity-10 rotate-12" />
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-300" /> Para Você
            </h3>
            <div className="space-y-4">
              {sugestoesBaseadasEmInteresse.map((item, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 group cursor-pointer hover:bg-white/20 transition-all">
                  <p className="text-[10px] font-black uppercase text-indigo-200 mb-1">{item.motivo}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm flex items-center gap-2">
                       {item.icon} {item.titulo}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currículo */}
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Meu Currículo
            </h3>
            <div className="border-2 border-dashed border-indigo-50 bg-indigo-50/30 rounded-2xl p-6 text-center">
              <p className="text-xs text-gray-500 mb-3 font-bold">curriculo_joao_2026.pdf</p>
              <button className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors">SUBSTITUIR ARQUIVO</button>
            </div>
          </div>
        </aside>

        {/* --- COLUNA PRINCIPAL --- */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Candidaturas */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">Minhas Candidaturas</h2>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full">TOTAL: 02</span>
            </div>
            
            <div className="space-y-4">
              {minhasCandidaturas.map((cand) => (
                <div key={cand.id} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg leading-tight">{cand.cargo}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-indigo-600 font-bold">{cand.empresa}</p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <p className="text-xs text-gray-400 font-medium">Aplicado em {cand.data}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full ${
                      cand.status === "Entrevista Marcada" 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                    }`}>
                      {cand.status}
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas de Carreira & Cursos (IA Sugerindo) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group cursor-pointer hover:border-indigo-600 transition-all">
               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <GraduationCap className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-gray-900 mb-2">Cursos Recomendados</h3>
               <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                 Identificamos que 80% das vagas de <b>Frontend</b> pedem Tailwind CSS. Que tal aprender agora?
               </p>
               <span className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                 Ver cursos <ChevronRight className="w-4 h-4" />
               </span>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group cursor-pointer hover:border-indigo-600 transition-all">
               <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Bell className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-black text-gray-900 mb-2">Alertas Inteligentes</h3>
               <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                 Existem <b>12 novas vagas</b> de tecnologia em sua cidade postadas nas últimas 24 horas.
               </p>
               <span className="text-green-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                 Ativar notificações <ChevronRight className="w-4 h-4" />
               </span>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default PerfilPage;