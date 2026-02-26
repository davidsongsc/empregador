"use client";

import { useState, useMemo } from 'react';
import {
  Briefcase, MapPin, DollarSign, Rocket, Plus, X,
  Loader2, Building2, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, ShieldCheck, MessageSquare,
  Mail, Search, Sparkles
} from 'lucide-react';
import { usePostJob } from '@/hooks/usePostJob';
import { useRoles } from '@/hooks/useRoles';
import { createRole } from '@/services/roles'; // Importar o service de criação
import Link from 'next/link';



const PostJobPage = () => {
  const [step, setStep] = useState(1);
  const { postJob, loading: posting } = usePostJob();
  const { roles, loading: loadingRoles } = useRoles();
  const [tipoVaga, setTipoVaga] = useState('EFETIVO');
  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRoleUid, setSelectedRoleUid] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  // Estados dos Campos
  const [tituloPersonalizado, setTituloPersonalizado] = useState('');
  const [salario, setSalario] = useState('');
  const [companyUid, setCompanyUid] = useState('');
  const [local, setLocal] = useState('');
  const [turno, setTurno] = useState('Presencial');
  const [descricao, setDescricao] = useState('');
  const [contatoOpt, setContatoOpt] = useState('plataforma');

  // Listas Dinâmicas
  const [beneficios, setBeneficios] = useState<string[]>(['Vale Transporte', 'Vale Alimentação']);
  const [novoBeneficio, setNovoBeneficio] = useState('');
  const [requisitos, setRequisitos] = useState<string[]>(['Ensino Médio Completo']);
  const [novoRequisito, setNovoRequisito] = useState('');

  // Lógica de Filtragem do Autocomplete
  const filteredRoles = useMemo(() => {
    if (!roleSearch || selectedRoleUid) return [];
    return roles.filter(r =>
      r.name.toLowerCase().includes(roleSearch.toLowerCase())
    ).slice(0, 5);
  }, [roles, roleSearch, selectedRoleUid]);

  const handleSelectRole = (role: any) => {
    setSelectedRoleUid(role.uid);
    setRoleSearch(role.name);
  };

  const handleCreateNewRole = async () => {
    setIsCreatingRole(true);
    try {
      const newRole = await createRole(roleSearch);
      setSelectedRoleUid(newRole.uid);
      setRoleSearch(newRole.name);
    } catch (err) {
      alert("Erro ao criar cargo. Tente selecionar um existente.");
    } finally {
      setIsCreatingRole(false);
    }
  };

  const addItem = (item: string, setList: any, setInput: any, list: string[]) => {
    if (item.trim() && !list.includes(item)) {
      setList([...list, item.trim()]);
      setInput('');
    }
  };

  const handleFinalizar = async () => {
    const payload = {
      role: selectedRoleUid,
      titulo_personalizado: tituloPersonalizado,
      company: companyUid,
      salario: salario ? parseFloat(salario) : null,
      turno,
      endereco: local.trim() ? { cidade: local } : null,
      descricao,
      beneficios: beneficios.map(b => ({ description: b })),
      requisitos: requisitos.map(r => ({ description: r })),
      metodo_contato: contatoOpt,
      perguntas: []
    };
    await postJob(payload);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Rocket className="w-4 h-4" /> Recrutamento Inteligente
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Postar Vaga</h1>

          <div className="flex items-center justify-center gap-3 pt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-indigo-600' : 'w-4 bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-14 rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 relative">

          {/* ETAPA 1: CLASSIFICAÇÃO */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Classificação</h2>
                <p className="text-gray-400 text-sm font-medium">Defina o cargo base para o algoritmo de match.</p>
              </div>

              <div className="grid md:grid-cols-1 gap-8">
                {/* AUTOCOMPLETE DE CARGO PADRONIZADO */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cargo Padronizado (Busque ou Crie)</label>
                  <div className="relative">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${selectedRoleUid ? 'text-green-500' : 'text-gray-300'}`} />
                    <input
                      value={roleSearch}
                      onChange={(e) => {
                        setRoleSearch(e.target.value);
                        if (selectedRoleUid) setSelectedRoleUid('');
                      }}
                      placeholder="Ex: Vendedor, Desenvolvedor..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-bold text-gray-900 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    />
                    {loadingRoles && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-300" />}
                  </div>

                  {/* Dropdown de Sugestões */}
                  {roleSearch && !selectedRoleUid && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                      {filteredRoles.map(r => (
                        <button
                          key={r.uid}
                          onClick={() => handleSelectRole(r)}
                          className="w-full p-5 text-left hover:bg-indigo-50 flex justify-between items-center group transition-colors border-b border-gray-50 last:border-none"
                        >
                          <div>
                            <p className="font-bold text-gray-800">{r.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-black">{r.category}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-600" />
                        </button>
                      ))}

                      {/* Opção de Criar se não houver match exato */}
                      <button
                        onClick={handleCreateNewRole}
                        disabled={isCreatingRole}
                        className="w-full p-5 text-left bg-indigo-600 text-white flex items-center justify-between hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isCreatingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          <span className="font-bold text-sm">Criar "{roleSearch}" como novo cargo</span>
                        </div>
                        <Sparkles className="w-4 h-4 opacity-50" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Título de Exibição (O que o candidato verá)</label>
                    <input value={tituloPersonalizado} onChange={(e) => setTituloPersonalizado(e.target.value)} placeholder="Ex: Vendedor de Loja (Shopping)" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">UID da Empresa</label>
                    <input value={companyUid} onChange={(e) => setCompanyUid(e.target.value)} placeholder="Cole o ID da empresa" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-mono text-[10px] font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Contratação</label>
                <select
                  value={tipoVaga}
                  onChange={(e) => setTipoVaga(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer"
                >
                  <option value="EFETIVO">Efetivo (CLT)</option>
                  <option value="PJ">Prestador de Serviços (PJ)</option>
                  <option value="FREELANCER">Freelancer</option>
                  <option value="TEMPORARIO">Temporário</option>
                  <option value="ESTAGIO">Estágio</option>
                </select>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedRoleUid }
                className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all disabled:opacity-20 shadow-xl"
              >
                Próxima Etapa <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ETAPA 2: CONTEÚDO */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Sobre a Oportunidade</h2>
                <p className="text-gray-400 text-sm font-medium">Descreva o salário, local e as atividades.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Salário Mensal</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                    <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="A combinar" className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-black outline-none focus:ring-4 focus:ring-green-50 transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cidade / UF</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                    <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex: Rio de Janeiro - RJ" className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-bold outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Descrição</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={6} className="w-full bg-gray-50 border-none rounded-[32px] py-6 px-8 font-medium outline-none focus:ring-4 focus:ring-indigo-50 transition-all resize-none text-sm" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Requisitos</label>
                  <div className="flex gap-2">
                    <input value={novoRequisito} onChange={(e) => setNovoRequisito(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)} className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold" placeholder="Adicionar..." />
                    <button onClick={() => addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)} className="bg-gray-900 text-white px-3 rounded-xl hover:bg-indigo-600 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {requisitos.map((r, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2">
                        {r} <X className="w-3 h-3 cursor-pointer" onClick={() => setRequisitos(requisitos.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Benefícios</label>
                  <div className="flex gap-2">
                    <input value={novoBeneficio} onChange={(e) => setNovoBeneficio(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)} className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-xs font-bold" placeholder="Adicionar..." />
                    <button onClick={() => addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)} className="bg-gray-900 text-white px-4 rounded-xl hover:bg-green-600 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {beneficios.map((b, i) => (
                      <span key={i} className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-2">
                        {b} <X className="w-3 h-3 cursor-pointer" onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/3 border border-gray-100 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all">Voltar</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-gray-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Próximo Passo</button>
              </div>
            </div>
          )}

          {/* ETAPA 3: CONTATO E FINALIZAÇÃO */}
          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black text-gray-900">Método de Recebimento</h2>
                <p className="text-gray-400 text-sm font-medium">Escolha como quer gerenciar os candidatos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'plataforma', icon: ShieldCheck, label: 'Plataforma', sub: 'Painel Interno', color: 'indigo' },
                  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', sub: 'Contato Direto', color: 'green' },
                  { id: 'email', icon: Mail, label: 'E-mail', sub: 'Fila por E-mail', color: 'gray' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setContatoOpt(opt.id)}
                    className={`p-6 rounded-[32px] border-2 text-left transition-all duration-300 ${contatoOpt === opt.id
                      ? `border-${opt.color}-600 bg-${opt.color}-50 shadow-inner`
                      : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                      }`}
                  >
                    <opt.icon className={`w-8 h-8 mb-4 ${contatoOpt === opt.id ? `text-${opt.color}-600` : 'text-gray-300'}`} />
                    <h3 className="font-black text-gray-900 text-sm">{opt.label}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{opt.sub}</p>
                  </button>
                ))}
              </div>

              <div className="pt-6 space-y-4">
                <button
                  onClick={handleFinalizar}
                  disabled={posting}
                  className="w-full bg-gray-900 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100"
                >
                  {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Publicar Vaga Agora <CheckCircle className="w-5 h-5" /></>}
                </button>
                <button onClick={() => setStep(2)} className="w-full text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">Revisar Detalhes</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PostJobPage;