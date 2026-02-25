"use client";

import { useState } from 'react';
import {
  Briefcase, MapPin, DollarSign, Clock, AlignLeft,
  CheckCircle, Rocket, Plus, MessageSquare, Mail, ShieldCheck, X, Loader2, Building2
} from 'lucide-react';
import { usePostJob } from '@/hooks/usePostJob';
import Link from 'next/link';

const PostJobPage = () => {
  const { postJob, loading, error } = usePostJob();

  // Estados dos Campos Principais
  const [cargo, setCargo] = useState('');
  const [salario, setSalario] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [local, setLocal] = useState('');
  const [turno, setTurno] = useState('Presencial');
  const [descricao, setDescricao] = useState('');

  // Listas Dinâmicas
  const [beneficios, setBeneficios] = useState<string[]>(['Vale Transporte', 'Vale Alimentação']);
  const [novoBeneficio, setNovoBeneficio] = useState('');
  const [requisitos, setRequisitos] = useState<string[]>(['Ensino Médio Completo']);
  const [novoRequisito, setNovoRequisito] = useState('');

  const [contatoOpt, setContatoOpt] = useState('plataforma');

  // Funções Auxiliares para Listas
  const addItem = (item: string, setList: any, setInput: any, list: string[]) => {
    if (item && !list.includes(item)) {
      setList([...list, item]);
      setInput('');
    }
  };

  const removeItem = (index: number, setList: any, list: string[]) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleFinalizar = async () => {
    // Formatação para o Django Serializer
    const payload = {
      cargo,
      salario: salario ? parseFloat(salario) : null,
      turno,
      empresa,
      local,
      descricao,
      // Transformando strings em objetos exigidos pelo Django
      beneficios: beneficios.map(b => ({ description: b })),
      requisitos: requisitos.map(r => ({ description: r })),
      perguntas: [] // Pode ser expandido futuramente
    };

    await postJob(payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
      <div className="">
        <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <section className="space-y-12">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <Rocket className="w-4 h-4" /> Recrutamento Inteligente
              </div>
              <h1 className="text-4xl font-black text-gray-900">Publique sua vaga</h1>
              {error && (
                <p className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold animate-shake">
                  {error}
                </p>
              )}
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm space-y-12">

              {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
              <section className="space-y-6 flex flex-col md:flex-row md:items-start md:gap-12">


                <button className="ml-auto text-sm text-indigo-600 font-bold hover:underline">
                  <Link href="/anunciar-mais">Agente de IA</Link>
                </button>
                <button className="ml-auto text-sm text-indigo-600 font-bold hover:underline">
                  <Link href="/postar-varias-vagas">Postar Varias Vagas</Link>
                </button>
              </section>
            </div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-600 rounded-full"></div> Informações da Vaga
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Título do Cargo</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
                  <input
                    value={cargo} onChange={(e) => setCargo(e.target.value)}
                    type="text" placeholder="Ex: Desenvolvedor"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
                  <input
                    value={empresa} onChange={(e) => setEmpresa(e.target.value)}
                    type="text" placeholder="Nome da sua empresa"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
                  <input
                    value={local} onChange={(e) => setLocal(e.target.value)}
                    type="text" placeholder="Cidade - UF"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Salário (Mensal)</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-4 text-gray-400 w-5 h-5" />
                  <input
                    value={salario} onChange={(e) => setSalario(e.target.value)}
                    type="number" placeholder="Opcional"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-green-50 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Descrição Detalhada</label>
              <textarea
                value={descricao} onChange={(e) => setDescricao(e.target.value)}
                rows={4} placeholder="Descreva as principais atividades da função..."
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all resize-none"
              ></textarea>
            </div>
          </section >

          {/* SEÇÃO 2: REQUISITOS & BENEFÍCIOS */}
          < div className="grid md:grid-cols-2 gap-12" >
            <section className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div> Requisitos
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={novoRequisito} onChange={(e) => setNovoRequisito(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)}
                    placeholder="Adicionar requisito..."
                    className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium"
                  />
                  <button onClick={() => addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)} className="bg-indigo-600 text-white p-2 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requisitos.map((r, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                      {r} <X className="w-3 h-3 cursor-pointer" onClick={() => removeItem(i, setRequisitos, requisitos)} />
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div> Benefícios
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={novoBeneficio} onChange={(e) => setNovoBeneficio(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)}
                    placeholder="Adicionar benefício..."
                    className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-medium"
                  />
                  <button onClick={() => addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)} className="bg-orange-500 text-white p-2 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {beneficios.map((b, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                      {b} <X className="w-3 h-3 cursor-pointer" onClick={() => removeItem(i, setBeneficios, beneficios)} />
                    </span>
                  ))}
                </div>
              </div>
            </section>


            {/* SEÇÃO 3: CONTATO */}
            <section className="space-y-6" >
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div> Recebimento de Currículos
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: 'plataforma', icon: ShieldCheck, label: 'Plataforma', sub: 'Filtro automático', color: 'indigo' },
                  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', sub: 'Direto e rápido', color: 'green' },
                  { id: 'email', icon: Mail, label: 'E-mail', sub: 'Fluxo tradicional', color: 'gray' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setContatoOpt(opt.id)}
                    className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all ${contatoOpt === opt.id ? `border-${opt.color}-600 bg-${opt.color}-50` : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <opt.icon className={`w-8 h-8 mb-4 ${contatoOpt === opt.id ? `text-${opt.color}-600` : 'text-gray-300'}`} />
                    <h3 className="font-black text-gray-900 text-sm mb-1">{opt.label}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{opt.sub}</p>
                  </div>
                ))}
              </div>


              <button
                onClick={handleFinalizar}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-6 rounded-[32px] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Publicar Vaga Agora <CheckCircle className="w-6 h-6" /></>
                )}
              </button>
            </section>
          </div >
        </div >
      </div >
    </div>
  );
};

export default PostJobPage;