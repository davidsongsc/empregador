"use client";

import { 
  Building2, 
  Headset, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Globe
} from 'lucide-react';
import Link from 'next/link';

const SuporteCorporativo = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* --- HEADER --- */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
            <Building2 className="w-3 h-3" /> Exclusivo para Empresas
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
            Suporte Estratégico para <br /> <span className="text-indigo-600">seu Recrutamento.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Atendimento especializado para ajudar sua empresa a encontrar os melhores talentos e otimizar seus processos seletivos.
          </p>
        </section>

        {/* --- CARDS DE SERVIÇOS DE SUPORTE --- */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Integração Técnica",
              desc: "Ajuda na configuração da sua conta empresa e integração de vagas.",
              icon: <Zap className="w-6 h-6" />,
              color: "text-amber-500",
              bg: "bg-amber-50"
            },
            {
              title: "Triagem Especializada",
              desc: "Consultoria sobre como usar nossos filtros para achar perfis raros.",
              icon: <ShieldCheck className="w-6 h-6" />,
              color: "text-green-500",
              bg: "bg-green-50"
            },
            {
              title: "Suporte em Faturamento",
              desc: "Dúvidas sobre notas fiscais, planos corporativos e pagamentos.",
              icon: <FileText className="w-6 h-6" />,
              color: "text-indigo-600",
              bg: "bg-indigo-50"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* --- SEÇÃO DE CONTATO DIRETO --- */}
        <section className="grid lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Formulário */}
          <div className="bg-white p-8 md:p-12 rounded-[50px] border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Fale com um Especialista</h2>
            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <input type="text" placeholder="Seu Nome" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium" />
                <input type="text" placeholder="Nome da Empresa" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium" />
              </div>
              <input type="email" placeholder="E-mail Corporativo" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium" />
              <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium appearance-none text-gray-400">
                <option value="">Assunto do Contato</option>
                <option value="plano">Upgrade de Plano</option>
                <option value="tecnico">Problema Técnico</option>
                <option value="comercial">Parceria Comercial</option>
              </select>
              <textarea rows={4} placeholder="Como podemos ajudar sua empresa hoje?" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium resize-none"></textarea>
              <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                Enviar Solicitação <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Canais Rápidos */}
          <div className="flex flex-col justify-between gap-6">
            <div className="bg-gray-900 rounded-[50px] p-10 text-white relative overflow-hidden flex-1">
              <Globe className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Headset className="text-indigo-400" /> Canais Diretos
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="text-indigo-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-300 uppercase">WhatsApp Corporativo</p>
                    <p className="font-bold text-lg">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Headset className="text-indigo-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-300 uppercase">Central de Voz</p>
                    <p className="font-bold text-lg">0800 123 4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-[40px] p-8 border border-indigo-100">
              <h4 className="font-black text-indigo-900 mb-2">Horário de Atendimento</h4>
              <p className="text-sm text-indigo-700 font-medium">
                Segunda a Sexta, das 08h às 18h. <br />
                Para planos Enterprise, atendimento 24/7.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SuporteCorporativo;