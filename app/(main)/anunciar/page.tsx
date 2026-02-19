"use client";

import { useState } from 'react';
import { 
  Briefcase, MapPin, DollarSign, Clock, AlignLeft, 
  CheckCircle, Rocket, Plus, MessageSquare, Mail, ShieldCheck, X
} from 'lucide-react';

const PostJobPage = () => {
  const [beneficios, setBeneficios] = useState(['Vale Transporte', 'Vale Alimentação', 'Plano de Saúde']);
  const [novoBeneficio, setNovoBeneficio] = useState('');
  const [contatoOpt, setContatoOpt] = useState('plataforma'); // plataforma, whatsapp, email

  const addBeneficio = () => {
    if (novoBeneficio && !beneficios.includes(novoBeneficio)) {
      setBeneficios([...beneficios, novoBeneficio]);
      setNovoBeneficio('');
    }
  };

  const removeBeneficio = (index: number) => {
    setBeneficios(beneficios.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Rocket className="w-4 h-4" /> Recrutamento Inteligente
          </div>
          <h1 className="text-4xl font-black text-gray-900">Publique sua vaga</h1>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-12">
          
          {/* SEÇÃO 1: DADOS BÁSICOS (Como a anterior) */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div> Informações da Vaga
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Título do Cargo</label>
                <input type="text" placeholder="Ex: Vendedor" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Salário (Opcional)</label>
                <input type="number" placeholder="Ex: 2000" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-50 font-medium transition-all" />
              </div>
            </div>
          </section>

          {/* SEÇÃO 2: BENEFÍCIOS (Interativo) */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> Benefícios Oferecidos
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {beneficios.map((ben, index) => (
                <span key={index} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in zoom-in-50 duration-200">
                  {ben}
                  <button onClick={() => removeBeneficio(index)} className="hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input 
                type="text" 
                value={novoBeneficio}
                onChange={(e) => setNovoBeneficio(e.target.value)}
                placeholder="Adicionar outro benefício..."
                className="flex-1 bg-gray-50 border-none rounded-2xl py-3 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm"
              />
              <button 
                type="button"
                onClick={addBeneficio}
                className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </section>

          {/* SEÇÃO 3: MÉTODO DE RECEBIMENTO (Estratégico) */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div> Como deseja receber candidatos?
              </h2>
              <p className="text-sm text-gray-400 font-medium pl-4">Escolha o canal de triagem para esta vaga.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Opção 1: Plataforma (Recomendado) */}
              <div 
                onClick={() => setContatoOpt('plataforma')}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${
                  contatoOpt === 'plataforma' ? 'border-indigo-600 bg-indigo-50/50 shadow-lg' : 'border-gray-100 hover:border-indigo-200'
                }`}
              >
                <ShieldCheck className={`w-8 h-8 mb-4 ${contatoOpt === 'plataforma' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <h3 className="font-black text-gray-900 text-sm mb-1">Via Plataforma</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Nós filtramos para você</p>
              </div>

              {/* Opção 2: WhatsApp */}
              <div 
                onClick={() => setContatoOpt('whatsapp')}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${
                  contatoOpt === 'whatsapp' ? 'border-green-500 bg-green-50/50 shadow-lg' : 'border-gray-100 hover:border-green-200'
                }`}
              >
                <MessageSquare className={`w-8 h-8 mb-4 ${contatoOpt === 'whatsapp' ? 'text-green-500' : 'text-gray-400'}`} />
                <h3 className="font-black text-gray-900 text-sm mb-1">WhatsApp Direto</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Receba mensagens instantâneas</p>
              </div>

              {/* Opção 3: E-mail */}
              <div 
                onClick={() => setContatoOpt('email')}
                className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${
                  contatoOpt === 'email' ? 'border-gray-900 bg-gray-50 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Mail className={`w-8 h-8 mb-4 ${contatoOpt === 'email' ? 'text-gray-900' : 'text-gray-400'}`} />
                <h3 className="font-black text-gray-900 text-sm mb-1">E-mail Direto</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase leading-tight">Candidaturas na sua caixa de entrada</p>
              </div>
            </div>

            {/* Inputs condicionais baseados na escolha */}
            <div className="animate-in slide-in-from-top-4 duration-300">
              {contatoOpt === 'whatsapp' && (
                <input type="tel" placeholder="Número do WhatsApp com DDD" className="w-full bg-gray-50 border-2 border-green-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-green-50 font-medium" />
              )}
              {contatoOpt === 'email' && (
                <input type="email" placeholder="E-mail para receber currículos" className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-gray-100 font-medium" />
              )}
              {contatoOpt === 'plataforma' && (
                <div className="bg-indigo-600 text-white p-6 rounded-3xl flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Ótima escolha!</p>
                    <p className="text-xs text-indigo-100">Organizaremos os candidatos no seu Dashboard e notificaremos apenas perfis que batem com sua vaga.</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <button className="w-full bg-gray-900 text-white py-6 rounded-[32px] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3">
            Finalizar e Anunciar <CheckCircle className="w-6 h-6" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default PostJobPage;