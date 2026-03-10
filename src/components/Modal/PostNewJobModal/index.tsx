"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus, X, Loader2, DollarSign, MapPin,
    Clock10, ChevronRight, CheckCircle, ShieldCheck,
    MessageSquare, Mail, Search, Sparkles, Terminal, Cpu,
    Activity
} from 'lucide-react';
import { usePostJob } from '@/hooks/usePostJob';
import { useRoles } from '@/hooks/useRoles';
import { createRole } from '@/services/roles';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/components/Notification';
import { updateJob } from '@/services/jobs';

interface PostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobToEdit?: any;
}

const PostNewJobModal = ({ isOpen, onClose, jobToEdit }: PostJobModalProps) => {
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const { postJob, loading: posting } = usePostJob();
    const { roles, loading: loadingRoles } = useRoles();
    const [tipoVaga, setTipoVaga] = useState('FREELANCER');
    const [roleSearch, setRoleSearch] = useState('');
    const [selectedRoleUid, setSelectedRoleUid] = useState('');
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [tituloPersonalizado, setTituloPersonalizado] = useState('');
    const [salario, setSalario] = useState('');
    const [local, setLocal] = useState('');
    const [turno, setTurno] = useState('6/1 Noturno');
    const [descricao, setDescricao] = useState('');
    const [contatoOpt, setContatoOpt] = useState('plataforma');
    const [beneficios, setBeneficios] = useState<string[]>(['Vale Transporte', 'Vale Alimentação']);
    const [novoBeneficio, setNovoBeneficio] = useState('');
    const [requisitos, setRequisitos] = useState<string[]>(['Ensino Médio Completo']);
    const [novoRequisito, setNovoRequisito] = useState('');
    const [newRoleCategory, setNewRoleCategory] = useState('Geral');
    const [showCategorySelector, setShowCategorySelector] = useState(false);
    const [isActive, setIsActive] = useState(true);
    useEffect(() => { if (!isOpen) setStep(1); }, [isOpen]);
    useEffect(() => {
        if (isOpen && jobToEdit) {
            // MODO EDIÇÃO: Mapeia os dados da API para o formulário
            setSelectedRoleUid(jobToEdit.role_details?.uid || '');
            setRoleSearch(jobToEdit.role_details?.name || '');
            setTituloPersonalizado(jobToEdit.titulo_personalizado || '');
            setSalario(jobToEdit.salario?.toString() || '');
            setLocal(jobToEdit.endereco?.cidade || jobToEdit.local || '');
            setTurno(jobToEdit.turno || '');
            setDescricao(jobToEdit.descricao || '');
            setTipoVaga(jobToEdit.tipo_vaga || 'FREELANCER');
            setContatoOpt(jobToEdit.metodo_contato || 'plataforma');
            setIsActive(jobToEdit.is_active );
            
            // Sanitização de arrays (Benefícios e Requisitos)
            // Se o backend enviar objetos [{description: '...'}], extraímos apenas a string
            const reqs = jobToEdit.requisitos?.map((r: any) => typeof r === 'string' ? r : r.description) || [];
            const bens = jobToEdit.beneficios?.map((b: any) => typeof b === 'string' ? b : b.description) || [];

            setRequisitos(reqs);
            setBeneficios(bens);
        } else if (isOpen && !jobToEdit) {
            // MODO CRIAÇÃO: Reset de todos os campos para o padrão Delos
            setRoleSearch('');
            setSelectedRoleUid('');
            setTituloPersonalizado('');
            setSalario('');
            setDescricao('');
            setIsCreatingRole(false)

            // ... resetar os demais estados
        }
    }, [isOpen, jobToEdit]);

    const modalTitle = jobToEdit ? "Editar_Vaga" : "Criar_Vaga";
    const buttonLabel = jobToEdit ? "Proximo" : "Avançar";

    const filteredRoles = useMemo(() => {
        if (!roleSearch || selectedRoleUid) return [];
        return roles.filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase())).slice(0, 5);
    }, [roles, roleSearch, selectedRoleUid]);

    const handleSelectRole = (role: any) => {
        setSelectedRoleUid(role.uid);
        setRoleSearch(role.name);
    };

    const handleCreateNewRole = async () => {
        if (!showCategorySelector) {
            setShowCategorySelector(true);
            return;
        }
        setIsCreatingRole(true);
        try {
            const newRole = await createRole({ name: roleSearch, category: newRoleCategory });
            setSelectedRoleUid(newRole.uid);
            setRoleSearch(newRole.name);
            setShowCategorySelector(false);
            toast.success("Definition_Created");
        } catch (err) {
            toast.error("Initialization_Error");
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
            company: user?.profile?.empresas?.[0]?.id || "",
            salario: salario ? parseFloat(salario) : null,
            turno,
            endereco: local.trim() ? { cidade: local } : null,
            descricao,
            beneficios: beneficios.map(b => ({ description: b })),
            requisitos: requisitos.map(r => ({ description: r })),
            metodo_contato: contatoOpt,
            tipo_vaga: tipoVaga,
            is_active: isActive,
            perguntas: []

        };

        try {
            if (jobToEdit?.uid) {
                // Chamada de PATCH para Edição
                await updateJob(jobToEdit.uid, payload);
                toast.success("Unit_Reconfigured");
            } else {
                // Chamada de POST para Criação
                await postJob(payload);
                toast.success("Instance_Deployed");
            }
            onClose();
        } catch (err) {
            toast.error("Protocol_Execution_Failed");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
            {/* VESTÍGIO ANALÓGICO INTERNO */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            <div className="bg-[#101010] w-full max-w-4xl max-h-[95vh] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden relative animate-in zoom-in-95 duration-300">

                {/* BOTÃO FECHAR */}
                <button onClick={onClose} className="absolute right-6 top-6 p-2 text-slate-600 hover:text-amber-600 z-[110] transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col h-full">
                    {/* HEADER DELOS */}
                    <div className="p-8 border-b border-white/5 bg-[#141414]">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="w-4 h-4 text-amber-600" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{modalTitle}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-light text-white tracking-tighter uppercase">Configurar <span className="font-black">Instância</span></h1>
                                <p className="text-[10px] font-mono text-slate-600 mt-1 uppercase tracking-widest italic">Protocol_ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</p>
                            </div>
                            <div className="flex gap-2 pb-2">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className={`h-1 transition-all duration-700 ${step === s ? 'w-12 bg-amber-600 shadow-[0_0_10px_#d97706]' : 'w-4 bg-white/5'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-12">

                        {/* ETAPA 1: DEFINIÇÃO DE CORE */}
                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                                <section>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-1 h-4 bg-amber-600" />
                                        <h2 className="text-[11px] font-black text-slate-200 uppercase tracking-[0.3em]">Mapeamento_Base</h2>
                                    </div>

                                    <div className="grid gap-8">
                                        <div className="space-y-2 relative">
                                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Identificador de Cargo (Core_Definition)</label>
                                            <div className="relative group">
                                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${selectedRoleUid ? 'text-amber-500' : 'text-slate-800'}`} />
                                                <input
                                                    value={roleSearch}
                                                    onChange={(e) => { setRoleSearch(e.target.value); if (selectedRoleUid) setSelectedRoleUid(''); }}
                                                    placeholder="BUSCAR MATRIZ DE CARGO..."
                                                    className="w-full bg-[#161616] border border-white/5 p-4 pl-12 font-bold text-xs text-white outline-none focus:border-amber-600/50 transition-all uppercase tracking-widest placeholder:text-slate-800"
                                                />
                                            </div>

                                            {roleSearch && !selectedRoleUid && (
                                                <div className="absolute z-30 w-full mt-1 bg-[#1A1A1A] border border-white/10 shadow-2xl overflow-hidden">
                                                    {!showCategorySelector ? (
                                                        <>
                                                            {filteredRoles.map(r => (
                                                                <button key={r.uid} onClick={() => handleSelectRole(r)} className="w-full p-4 text-left hover:bg-amber-600/10 flex justify-between items-center group border-b border-white/5 last:border-none transition-colors">
                                                                    <div>
                                                                        <p className="font-bold text-[10px] text-slate-200 uppercase tracking-widest group-hover:text-amber-500">{r.name}</p>
                                                                        <p className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">{r.category}</p>
                                                                    </div>
                                                                    <ChevronRight className="w-3 h-3 text-slate-800 group-hover:text-amber-600" />
                                                                </button>
                                                            ))}
                                                            <button onClick={handleCreateNewRole} className="w-full p-4 text-left bg-amber-600 text-black flex items-center justify-between hover:bg-amber-500 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <Plus size={14} strokeWidth={3} />
                                                                    <span className="font-black text-[9px] uppercase tracking-widest">Compilar "{roleSearch}"</span>
                                                                </div>
                                                                <Sparkles className="w-3 h-3 opacity-50" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="p-4 space-y-4 bg-[#141414]">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Set_Category: <span className="text-amber-600">{roleSearch}</span></p>
                                                                <button onClick={() => setShowCategorySelector(false)}><X className="w-3 h-3 text-slate-600" /></button>
                                                            </div>
                                                            <select value={newRoleCategory} onChange={(e) => setNewRoleCategory(e.target.value)} className="w-full bg-black border border-white/10 p-3 font-bold text-[10px] text-slate-300 outline-none focus:border-amber-600 uppercase tracking-widest appearance-none">
                                                                {["Geral", "Administrativo", "Tecnologia", "Manutenção", "Vendas", "Operacional", "Saúde", "Marketing", "Financeiro", "RH", "Educação", "Outros"].map(opt => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                            <button onClick={handleCreateNewRole} disabled={isCreatingRole} className="w-full bg-amber-600 text-black py-3 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                                {isCreatingRole ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmar_Compilação"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Rótulo de Interface (Display_Title)</label>
                                                <input value={tituloPersonalizado} onChange={(e) => setTituloPersonalizado(e.target.value)} placeholder="NOME DA INSTÂNCIA EXIBIDA..." className="w-full bg-[#161616] border border-white/5 p-4 font-bold text-xs text-white outline-none focus:border-amber-600/50 uppercase placeholder:text-slate-800" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Tipo de Alocação</label>
                                                <select value={tipoVaga} onChange={(e) => setTipoVaga(e.target.value)} className="w-full bg-[#161616] border border-white/5 p-4 font-bold text-xs text-white outline-none focus:border-amber-600/50 uppercase appearance-none cursor-pointer">
                                                    <option value="EFETIVO">Efetivo (CLT)</option>
                                                    <option value="PJ">Prestador (PJ)</option>
                                                    <option value="FREELANCER">Freelancer</option>
                                                    <option value="ESTAGIO">Estágio</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <button onClick={() => setStep(2)} disabled={!selectedRoleUid} className="w-full bg-white text-black py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-amber-600 hover:text-white transition-all disabled:opacity-5">
                                    Avançar <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* ETAPA 2: PARÂMETROS DE CAMPO */}
                        {step === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Recurso_Mensal</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                                            <input type="number" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="0.00" className="w-full bg-[#161616] border border-white/5 p-4 pl-12 font-mono text-xs text-white outline-none focus:border-amber-600/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Setor_Geográfico</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                            <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="COORDENADAS..." className="w-full bg-[#161616] border border-white/5 p-4 pl-12 font-bold text-xs text-white outline-none uppercase" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Ciclo_Operacional</label>
                                        <div className="relative">
                                            <Clock10 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                            <input value={turno} onChange={(e) => setTurno(e.target.value)} placeholder="JORNADA..." className="w-full bg-[#161616] border border-white/5 p-4 pl-12 font-bold text-xs text-white outline-none uppercase" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Dossiê de Unidade (Description)</label>
                                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} className="w-full bg-[#161616] border border-white/5 p-6 font-mono text-xs text-slate-400 outline-none focus:border-amber-600/50 resize-none uppercase tracking-tighter" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Requisitos_Técnicos</label>
                                        <div className="flex gap-1">
                                            <input value={novoRequisito} onChange={(e) => setNovoRequisito(e.target.value)} className="flex-1 bg-black border border-white/10 p-3 text-[10px] font-bold text-white uppercase" placeholder="ADD_REQ..." />
                                            <button onClick={() => addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)} className="bg-[#161616] text-amber-600 px-4 hover:bg-amber-600 hover:text-black transition-all border border-white/5"><Plus size={14} /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {requisitos.map((r, i) => (
                                                <span key={i} className="bg-white/5 text-slate-400 text-[8px] font-black px-2 py-1 border border-white/10 flex items-center gap-2 tracking-widest uppercase hover:border-amber-600/40 transition-colors">
                                                    {r} <X className="w-3 h-3 cursor-pointer text-slate-700 hover:text-amber-600" onClick={() => setRequisitos(requisitos.filter((_, idx) => idx !== i))} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Benefícios_Integrados</label>
                                        <div className="flex gap-1">
                                            <input value={novoBeneficio} onChange={(e) => setNovoBeneficio(e.target.value)} className="flex-1 bg-black border border-white/10 p-3 text-[10px] font-bold text-white uppercase" placeholder="ADD_BENEFIT..." />
                                            <button onClick={() => addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)} className="bg-[#161616] text-amber-600 px-4 hover:bg-amber-600 hover:text-black transition-all border border-white/5"><Plus size={14} /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {beneficios.map((b, i) => (
                                                <span key={i} className="bg-amber-600/5 text-amber-600/60 text-[8px] font-black px-2 py-1 border border-amber-600/10 flex items-center gap-2 tracking-widest uppercase">
                                                    {b} <X className="w-3 h-3 cursor-pointer" onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-6">
                                    <button onClick={() => setStep(1)} className="w-1/4 bg-[#141414] border border-white/5 py-4 font-black text-[9px] uppercase tracking-widest text-slate-600 hover:text-white transition-all italic">Previous</button>
                                    <button onClick={() => setStep(3)} className="flex-1 bg-white text-black py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-amber-600 hover:text-white transition-all">{buttonLabel}</button>
                                </div>
                            </div>
                        )}

                        {/* ETAPA 3: PROTOCOLO DE CONTATO */}
                        {step === 3 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">

                                <div className="text-center space-y-2">
                                    <h2 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.5em]">Canal_de_Comunicação</h2>
                                    <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Defina o método de interceptação de candidatos</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white/5 border border-white/5 p-1">
                                    {[
                                        { id: 'plataforma', icon: ShieldCheck, label: 'DELOS_LINK', sub: 'Internal_Panel' },
                                        { id: 'whatsapp', icon: MessageSquare, label: 'COMMS_APP', sub: 'Direct_Contact' },
                                        { id: 'email', icon: Mail, label: 'DATA_STREAM', sub: 'Queue_Process' },
                                    ].map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => setContatoOpt(opt.id)}
                                                className={`p-8 text-center transition-all duration-500 relative ${contatoOpt === opt.id
                                                    ? `bg-[#161616] border-y border-amber-600/40`
                                                    : 'bg-[#0D0D0D] border-y border-transparent hover:bg-white/5'
                                                    }`}
                                            >
                                                {contatoOpt === opt.id && <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-amber-600 shadow-[0_0_10px_#d97706]" />}
                                                <Icon className={`w-6 h-6 mx-auto mb-4 ${contatoOpt === opt.id ? `text-amber-500` : 'text-slate-800'}`} />
                                                <h3 className={`font-black text-[10px] uppercase tracking-widest ${contatoOpt === opt.id ? 'text-white' : 'text-slate-600'}`}>{opt.label}</h3>
                                                <p className="text-[7px] text-slate-700 font-mono uppercase tracking-tighter mt-1">{opt.sub}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* NOVO: SWITCH DE STATUS DA INSTÂNCIA */}
                                <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg transition-all ${isActive ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-500'}`}>
                                            <Activity size={20} className={isActive ? 'animate-pulse' : ''} />
                                        </div>
                                        <div>
                                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Status da Vaga</h3>
                                            <p className="text-[8px] text-slate-500 uppercase font-mono tracking-tighter">
                                                {isActive ? 'Publicado: Visível na Matriz Global' : 'Offline: Oculto para Candidatos'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative w-14 h-7 transition-all duration-500 border ${isActive ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-red-600/20 border-red-500/50'}`}
                                    >
                                        {/* Knob Estilo Industrial */}
                                        <div className={`absolute top-1 bottom-1 w-5 transition-all duration-500 ${isActive ? 'left-7 bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'left-1 bg-red-500 shadow-[0_0_10px_#ef4444]'}`}>
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-[1px] h-2 bg-white/30 mx-[1px]" />
                                                <div className="w-[1px] h-2 bg-white/30 mx-[1px]" />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="pt-10 space-y-4">
                                    <button
                                        onClick={handleFinalizar}
                                        disabled={posting}
                                        className="w-full bg-amber-600 text-black py-6 font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-white transition-all shadow-[0_0_30px_rgba(217,119,6,0.2)]"
                                    >
                                        {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Salvar <CheckCircle className="w-4 h-4" /></>}
                                    </button>
                                    <button onClick={() => setStep(2)} className="w-full text-[8px] font-black text-slate-700 uppercase tracking-widest hover:text-slate-400 transition-colors text-center italic underline">Review_Parameters</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PostNewJobModal);