"use client";

import { Check, Rocket, Zap, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

const PlanosPage = () => {
  const planos = [
    {
      nome: "Gratuito",
      desc: "Ideal para pequenas empresas e vagas pontuais.",
      preco: "0",
      cor: "gray",
      icon: <Rocket className="w-6 h-6 text-gray-400" />,
      recursos: ["1 vaga ativa por vez", "Recebimento via WhatsApp/E-mail", "Duração de 7 dias", "Suporte via FAQ"],
      btn: "Começar Grátis",
      popular: false
    },
    {
      nome: "Profissional",
      desc: "Para empresas que precisam de triagem inteligente.",
      preco: "97",
      cor: "indigo",
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      recursos: ["Vagas ilimitadas", "Triagem inteligente pela plataforma", "Destaque na busca de vagas", "Dashboard de candidatos", "Suporte prioritário"],
      btn: "Assinar Agora",
      popular: true
    },
    {
      nome: "Enterprise",
      desc: "Soluções customizadas para grandes demandas.",
      preco: "Sob consulta",
      cor: "black",
      icon: <Crown className="w-6 h-6 text-orange-500" />,
      recursos: ["Acesso ao banco de currículos", "Integração via API", "Gerente de conta dedicado", "Cursos exclusivos para funcionários"],
      btn: "Falar com Consultor",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DA PÁGINA */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Escolha o plano ideal para <br /> <span className="text-indigo-600">sua empresa</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">
            Acelere sua contratação com ferramentas de triagem automática e alcance os melhores talentos da região.
          </p>
        </div>

        {/* GRID DE PLANOS */}
        <div className="grid lg:grid-cols-3 gap-8 items-end">
          {planos.map((plano, index) => (
            <div 
              key={index}
              className={`relative bg-white p-8 md:p-10 rounded-[40px] border transition-all duration-300 ${
                plano.popular 
                ? 'border-indigo-600 shadow-2xl shadow-indigo-100 scale-105 z-10' 
                : 'border-gray-100 hover:border-indigo-200 shadow-sm'
              }`}
            >
              {plano.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Mais Popular
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    plano.cor === 'indigo' ? 'bg-indigo-50' : 'bg-gray-50'
                }`}>
                  {plano.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900">{plano.nome}</h3>
                <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">{plano.desc}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {plano.preco !== "Sob consulta" ? `R$ ${plano.preco}` : plano.preco}
                  </span>
                  {plano.preco !== "Sob consulta" && <span className="text-gray-400 font-bold text-sm">/mês</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plano.recursos.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-600">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plano.cor === 'indigo' ? 'text-indigo-600' : 'text-green-500'}`} />
                    {rec}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 group ${
                plano.popular 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                : 'bg-gray-900 text-white hover:bg-indigo-600'
              }`}>
                {plano.btn} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* ÁREA DE CONFIANÇA */}
        <div className="mt-20 p-8 md:p-12 bg-white rounded-[40px] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="bg-green-50 p-4 rounded-3xl text-green-600">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                    <h4 className="text-xl font-black text-gray-900">Segurança em primeiro lugar</h4>
                    <p className="text-sm text-gray-500 font-medium">Pagamento processado de forma segura. Cancele quando quiser, sem letras miúdas.</p>
                </div>
            </div>
            <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">Emp</div>
                    </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                    +500
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PlanosPage;