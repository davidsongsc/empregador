'use client';
import { Check, Zap, Crown, Users2, HelpCircle, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Start",
      price: "147",
      foco: "Pequeno Operador",
      features: ["Até 2 eventos/mês", "20 dias de escala", "Gestão básica de fixos", "Suporte via Ticket"],
      color: "slate",
      isPopular: false,
    },
    {
      name: "Business",
      price: "347",
      foco: "Produtor Profissional",
      features: ["Eventos/Escalas Ilimitadas", "Exportação Excel/Word/BI", "Moderação de Perfil", "Dashboard de BI"],
      color: "indigo",
      isPopular: true,
    },
    {
      name: "Premium",
      price: "697",
      foco: "Gestão de Pessoas",
      features: ["Recrutador AI (WhatsApp)", "Atendimento Automático", "Confirmação Ativa de Staff", "Prioridade na Rede"],
      color: "purple",
      isPopular: false,
    },
    {
      name: "Partner",
      price: "1.497",
      foco: "Elite / BPO",
      features: ["Mão de obra treinada", "Gestão Full (BPO)", "Taxa variável por diária", "Consultoria Mensal"],
      color: "amber",
      isPopular: false,
    },
  ];

  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header da Tabela */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-gray-900">Escolha o seu nível de jogo</h2>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Seja você um produtor independente ou uma agência nacional, temos a escala certa para sua operação.
          </p>
          
          {/* Toggle Mensal/Anual (Opcional) */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Mensal</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-14 h-7 bg-indigo-600 rounded-full relative p-1 transition-all"
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-all ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>Anual <span className="text-green-500 text-[10px] ml-1">(-20%)</span></span>
          </div>
        </div>

        {/* Cards de Assinatura */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] ${
                plan.isPopular ? 'border-indigo-600 shadow-2xl shadow-indigo-100' : 'border-gray-100'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Star size={10} fill="white" /> O mais escolhido
                </div>
              )}

              <div className="mb-8">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{plan.foco}</p>
                <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-sm font-bold text-gray-400">R$</span>
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 font-medium">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${
                plan.isPopular 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
                : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                Assinar Agora
              </button>
            </div>
          ))}
        </div>

        {/* --- PLANO SOB DEMANDA (O "Wildcard") --- */}
        <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <HelpCircle size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-amber-400 text-[10px] font-black uppercase">
                Para Eventos Únicos
              </div>
              <h2 className="text-3xl font-black italic">Não quer uma assinatura mensal?</h2>
              <p className="text-slate-400 font-medium">
                Conheça o <strong>Plano Sob Demanda</strong>. Ideal para produtores de grandes festivais anuais ou eventos esporádicos. Pague apenas por evento realizado, com todas as ferramentas do Plano Business liberadas.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center min-w-[250px]">
              <p className="text-xs font-bold text-slate-500 uppercase">A partir de</p>
              <p className="text-4xl font-black my-2 text-amber-400">R$ 497</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Por evento (até 50 staff)</p>
              <button className="mt-6 flex items-center justify-center gap-2 text-white font-black group mx-auto">
                Consultar condições <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}