"use client";

import { useState } from 'react';
import { 
  Search, HelpCircle, MessageCircle, FileQuestion, 
  ChevronDown, LifeBuoy, BookOpen, ShieldCheck, Mail 
} from 'lucide-react';

const AjudaPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      pergunta: "Como faço para cadastrar meu currículo?",
      resposta: "Basta acessar seu Perfil e clicar em 'Meu Currículo'. Você pode enviar um arquivo PDF ou preencher suas informações manualmente para que as empresas te encontrem."
    },
    {
      id: 2,
      pergunta: "O serviço é gratuito para trabalhadores?",
      resposta: "Sim! A Área do Trabalhador é 100% gratuita para candidatos. Nosso objetivo é facilitar sua entrada no mercado de trabalho."
    },
    {
      id: 3,
      pergunta: "Como as empresas entram em contato comigo?",
      resposta: "Quando uma empresa se interessa pelo seu perfil, ela pode te enviar uma mensagem interna ou entrar em contato via e-mail/telefone fornecidos no seu cadastro."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* --- HEADER DA CENTRAL DE AJUDA --- */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <LifeBuoy className="w-4 h-4" /> Central de Suporte
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">Como podemos <span className="text-indigo-600">ajudar?</span></h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Digite sua dúvida (ex: como editar perfil...)"
              className="w-full bg-white border-none shadow-xl shadow-indigo-100/50 rounded-[32px] py-6 pl-14 pr-6 outline-none text-lg focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>
        </section>

        {/* --- CARDS DE CATEGORIA --- */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Guias Práticos</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Tutoriais passo a passo de como usar todas as ferramentas do site.</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
            <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all text-green-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Privacidade</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Entenda como protegemos seus dados e quem pode ver seu currículo.</p>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:border-indigo-200 transition-all group cursor-pointer">
            <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all text-orange-600">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Canais de Contato</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Fale diretamente com nossa equipe de suporte e atendimento.</p>
          </div>
        </section>

        {/* --- SEÇÃO DE FAQ (ACORDEÃO) --- */}
        <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gray-900 text-white p-2 rounded-xl">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-gray-50 last:border-none">
                <button 
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full py-6 flex justify-between items-center text-left group"
                >
                  <span className={`font-bold transition-colors ${openFaq === faq.id ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                    {faq.pergunta}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    {faq.resposta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- RODAPÉ DE SUPORTE --- */}
        <section className="bg-indigo-600 rounded-[40px] p-10 text-center text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Mail className="w-32 h-32" />
          </div>
          <h2 className="text-3xl font-black z-10 relative">Ainda precisa de ajuda?</h2>
          <p className="text-indigo-100 font-medium z-10 relative">Nossa equipe responde em menos de 24 horas úteis.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center z-10 relative">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Enviar E-mail
            </button>
            <button className="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-400 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" /> Chat via WhatsApp
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AjudaPage;