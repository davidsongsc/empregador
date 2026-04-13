"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Loader2,
    DollarSign,
    MapPin,
    Clock10,
    ChevronRight,
    CheckCircle,
    ShieldCheck,
    MessageSquare,
    Mail, Search,
    Sparkles,
    Terminal,
    Cpu,
    Activity,
    LayoutGrid,
    Workflow
} from 'lucide-react';

import { usePostJob } from '@/hooks/usePostJob';
import { useRoleSearch } from "@/hooks/useRoleSearch";
import { createRole } from '@/services/roles';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/components/Notification';
import { updateJob } from '@/services/jobs';
import { useJobStore } from '@/store/useJobStore';
import { useCategoryOptions } from '@/hooks/useCategoryOptions';
import { useBuscaCep } from '@/hooks/useBuscaCep';
import { useAddressStore } from '@/store/useAddressStore';
import { sendGAEvent } from '@next/third-parties/google';

interface PostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobUid?: string | null;
    activeCompanyId?: string
}

const PostNewJobModal = ({ isOpen, onClose, jobUid, activeCompanyId }: PostJobModalProps) => {
    const { fetchJobById, loading, error } = useJobStore();
    const [vaga, setVaga] = useState<any>(null);
    const { options: categoryOptions, loading: catLoading } = useCategoryOptions(activeCompanyId, isOpen);
    const [selectedCategoryUid, setSelectedCategoryUid] = useState('');

    const { postJob, loading: posting } = usePostJob();
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
    const [addressBlock, setAddressBlock] = useState<boolean>(true);
    const [newRoleCategory, setNewRoleCategory] = useState('Geral');
    const [showCategorySelector, setShowCategorySelector] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const labelClassName = "text-[9px] font-mono font-black uppercase tracking-[0.2em] opacity-50 mb-1.5 block";
    const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-none py-4 px-4 font-bold outline-none transition-all text-base md:text-sm text-[var(--delos-black)] appearance-none";
    const { addresses, fetchAddresses, editAddress, addAddress } = useAddressStore();
    const [step, setStep] = useState(vaga ? 2 : 1);
    const [localAddress, setLocalAddress] = useState<any>(null);
    const { lookup, loading: loadingCep } = useBuscaCep();
    const modalTitle = vaga ? "Editar_Vaga" : "Criar_Vaga";
    const buttonLabel = vaga ? "Proximo" : "Avançar";

    useEffect(() => {
        const carregarVaga = async () => {
            try {
                // Verificação explícita antes de chamar a função
                if (jobUid && activeCompanyId) {
                    const dados = await fetchJobById(jobUid, activeCompanyId);
                    setVaga(dados);
                    console.log("Detalhes da vaga carregados:", dados);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes da vaga:", error);
            }
        };

        if (activeCompanyId && jobUid) {
            carregarVaga();
        }
    }, [activeCompanyId, jobUid, fetchJobById]);
    useEffect(() => {
        if (isOpen) {

            const activeAddr = addresses.find(a => a.is_default) || addresses[0];
            setLocalAddress(activeAddr ? { ...activeAddr } : {
                cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', estado: '', regiao: ''
            });
        }
    }, [isOpen, addresses]);
    useEffect(() => { if (!isOpen) setStep(1); }, [isOpen]);
    useEffect(() => {
        if (isOpen) {
            if (jobUid && vaga) {
                const roleId = vaga.role_id || vaga.role?.id || '';
                setSelectedRoleUid(roleId);
                const roleName = vaga.role_nome || vaga.role?.name || vaga.cargo_fallback || '';
                setRoleSearch(roleName);
                setTituloPersonalizado(vaga.titulo_personalizado || '');
                setSalario(vaga.salario?.toString() || '');
                setLocal(vaga.endereco?.cidade || vaga.local || '');
                setTurno(vaga.turno || '');
                setDescricao(vaga.descricao || '');
                setTipoVaga(vaga.tipo_vaga || 'FREELANCER');
                setContatoOpt(vaga.metodo_contato || 'plataforma');
                setIsActive(vaga.is_active);
                setSelectedCategoryUid(vaga.category_id || '');
                setLocalAddress({
                    cep: vaga.endereco?.cep || '',
                    logradouro: vaga.endereco?.logradouro || '',
                    numero: vaga.endereco?.numero || '',
                    complemento: vaga.endereco?.complemento || '',
                    bairro: vaga.endereco?.bairro || '',
                    cidade: vaga.endereco?.cidade || '',
                    uf: vaga.endereco?.uf || '',
                    estado: vaga.endereco?.estado || '',
                    regiao: vaga.endereco?.regiao || ''
                });
                const reqs = vaga.requisitos?.map((r: any) => typeof r === 'string' ? r : r.description) || [];
                const bens = vaga.beneficios?.map((b: any) => typeof b === 'string' ? b : b.description) || [];

                setRequisitos(reqs);
                setBeneficios(bens);
            }

            else if (!jobUid) {
                setRoleSearch('');
                setSelectedRoleUid('');
                setTituloPersonalizado('');
                setSalario('');
                setLocal('');
                setTurno('6/1 Noturno');
                setDescricao('');
                setTipoVaga('FREELANCER');
                setContatoOpt('plataforma');
                setIsActive(true);
                setRequisitos(['Ensino Médio Completo']);
                setBeneficios(['Vale Transporte', 'Vale Alimentação']);
                setIsCreatingRole(false);
                setShowCategorySelector(false);
                setLocalAddress({
                    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', estado: '', regiao: ''
                });

            }
        }
    }, [isOpen, vaga, jobUid]); // <-- Adicione jobUid aqui

    useEffect(() => {
        const cepLimpo = localAddress?.cep?.replace(/\D/g, "");
        if (cepLimpo?.length === 8) {
            const autoFill = async () => {
                const data = await lookup(cepLimpo);
                if (data) {
                    sendGAEvent('event', 'address_autofill_success', {
                        city: data.localidade,
                        state: data.uf
                    });

                    setLocalAddress((prev: any) => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                        regiao: data.regiao

                    }));
                }
            };
            autoFill();
        }
    }, [localAddress?.cep, lookup]);

    const { results: filteredRoles, loading: rolesSearching } = useRoleSearch(roleSearch);

    const handleSelectRole = (role: any) => {
        setSelectedRoleUid(role.id);
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
            setSelectedRoleUid(newRole.id);
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
        const activeCompanyIdFromStore = useAuthStore.getState().activeCompanyId;

        const payload: any = {
            role_id: selectedRoleUid,
            category_id: selectedCategoryUid,
            titulo_personalizado: tituloPersonalizado,
            company_id: activeCompanyIdFromStore || activeCompanyId,
            salario: salario ? parseFloat(salario) : null,
            turno,
            local_amigavel: local.trim() || null,
            descricao,
            beneficios: beneficios.map(b => ({ description: b })),
            requisitos: requisitos.map(r => ({ description: r })),
            metodo_contato: contatoOpt,
            tipo_vaga: tipoVaga,
            is_active: isActive,
            perguntas: []
        };

        try {
            // 🔥 A MUDANÇA ESTÁ AQUI: Usamos jobUid (prop) em vez de vaga?.id (store)
            if (jobUid) {
                // MODO EDIÇÃO (PATCH)
                const { company_id, ...updatePayload } = payload;

                // Usamos o jobUid que o pai passou para garantir que é a vaga certa
                await updateJob(jobUid, updatePayload);
                toast.success("Unit_Reconfigured");
            } else {
                // MODO CRIAÇÃO (POST)
                // Se jobUid for null (como definido no handleCreate do pai), cai aqui obrigatoriamente
                const newJob = await postJob(payload);
                toast.success("Instance_Deployed");
            }
            const cleanCep = localAddress.cep.replace(/\D/g, "");
            if (cleanCep.length === 8) {
                if (localAddress.id) {
                    // UPDATE EXPLÍCITO
                    editAddress(localAddress.id, localAddress);
                    toast.info("Atualizando localização...");
                } else {
                    // CREATE EXPLÍCITO
                    addAddress(localAddress);
                    toast.info("Registrando novo endereço...");
                }
            }

            onClose();
        } catch (err) {
            console.error("Erro na operação:", err);
            toast.error("Initialization_Error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-delos-surface/10 backdrop-blur-sm p-4 animate-in fade-in duration-1500">
            {/* VESTÍGIO ANALÓGICO INTERNO */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            <div className="bg-delos-surface w-full max-w-4xl max-h-[95vh] border border-delos-surface/5 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden relative animate-in zoom-in-95 duration-300">

                {/* BOTÃO FECHAR */}
                <button onClick={onClose} className="absolute right-6 top-6 p-2 text-delos-grey hover:text-delos-amber z-[110] transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col h-full">
                    {/* HEADER DELOS */}
                    <div className="p-4 border-b border-delos-surface/5 bg-delos-amber backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="w-6 h-6 text-delos-surface" />
                            <span className="text-sm font-black text-delos-surface uppercase tracking-[0.4em]">{modalTitle}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-4xl font-light text-delos-surface tracking-tighter uppercase">Info <span className="font-black">Vaga</span></h1>
                                <p className="text-sm font-mono text-delos-surface mt-1 uppercase tracking-widest italic ">code: {Math.random().toString(16).slice(2, 8).toUpperCase()}</p>
                            </div>
                            <div className="flex gap-2 pb-2 bg-delos-surface/50 p-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`h-1 flex items-center justify-center transition-all duration-700 ${step === s
                                            ? 'w-24 bg-delos-soft shadow-[0_0_10px_#d97706]'
                                            : 'w-12 bg-white/5'
                                            }`}
                                    >
                                        {step === s && <span className='relative top-[-40px] text-sm text-delos-indigo w-4
                                         '>{step}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-12">

                        {/* ETAPA 1: DEFINIÇÃO DE CORE */}
                        {step === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-4 bg-delos-amber" />
                                        <h2 className="text-[11px] font-black text-delos-black uppercase tracking-[0.3em]">Informações Básicas</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-4">


                                        <div className="grid gap-8">
                                            <div className="space-y-2 relative">
                                                <label className="text-[9px] font-black text-delos-black uppercase tracking-widest flex items-center gap-2"><Workflow size={10} className="text-delos-amber" /> Função </label>
                                                <div className="relative group">
                                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${selectedRoleUid ? 'text-delos-amber' : 'text-delos-black'}`} />
                                                    <input
                                                        value={roleSearch}
                                                        onChange={(e) => { setRoleSearch(e.target.value); if (selectedRoleUid) setSelectedRoleUid(''); }}
                                                        placeholder="BUSCAR MATRIZ DE CARGO..."
                                                        className="w-full bg-delos-surface border border-delos-black/25 p-4 pl-12 font-bold text-xs text-delos-black outline-none focus:border-amber-600/50 transition-all uppercase tracking-widest placeholder:text-slate-800"
                                                    />
                                                </div>

                                                {rolesSearching ? (
                                                    <div className="p-4 flex items-center justify-center">
                                                        <Loader2 className="w-4 h-4 animate-spin text-delos-amber" />
                                                    </div>
                                                ) : (
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar border-x border-b border-delos-surface/5 bg-delos-surface mt-2 rounded-b-sm">
                                                        {/* LISTA DE RESULTADOS ENCONTRADOS */}
                                                        {filteredRoles.map(r => (
                                                            <button
                                                                key={r.id}
                                                                onClick={() => handleSelectRole(r)}
                                                                className="w-full px-4 py-2 text-left hover:bg-delos-amber/10 flex justify-between items-center group border-b border-delos-surface/5 last:border-none transition-colors"
                                                            >
                                                                <div>
                                                                    <p className="font-bold text-[15px] text-delos-black uppercase tracking-widest group-hover:text-delos-amber">
                                                                        {r.name}
                                                                    </p>
                                                                    <p className="text-[10px] text-delos-black uppercase font-black tracking-tighter">
                                                                        {r.category}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="w-3 h-3 text-delos-black group-hover:text-delos-amber" />
                                                            </button>
                                                        ))}

                                                        {/* BOTÃO PARA CRIAR NOVO (APARECE SE NÃO HOUVER SELEÇÃO E HOUVER TEXTO) */}
                                                        {roleSearch.length > 2 && !selectedRoleUid && (
                                                            <div className="p-2 bg-delos-amber/5 border-t border-delos-amber/20">
                                                                {!showCategorySelector ? (
                                                                    <button
                                                                        onClick={() => setShowCategorySelector(true)}
                                                                        className="w-full p-4 flex items-center gap-3 group hover:bg-delos-amber/10 transition-all"
                                                                    >
                                                                        <Plus className="w-4 h-4 text-delos-amber group-hover:text-delos-black" />
                                                                        <div className="text-left">
                                                                            <p className="text-[13px] font-black text-delos-black group-hover:text-delos-amber uppercase tracking-widest">
                                                                                Cadastrar Função: "{roleSearch}"
                                                                            </p>
                                                                            <p className="text-[9px] text-slate-500 group-hover:text-black/60 uppercase font-mono">
                                                                                Cargo não encontrado.
                                                                            </p>
                                                                        </div>
                                                                    </button>
                                                                ) : (
                                                                    <div className="p-4 space-y-4 animate-in slide-in-from-top-2">
                                                                        <label className="text-sm font-black text-delos-black uppercase tracking-widest">Categoria da Função </label>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {['Geral', 'Operacional', 'Gestão', 'Técnico'].map((cat) => (
                                                                                <button
                                                                                    key={cat}
                                                                                    onClick={() => setNewRoleCategory(cat)}
                                                                                    className={`p-2 text-sm font-bold uppercase border rounded-sm shadow-sm transition-all ${newRoleCategory === cat ? 'bg-delos-amber border-delos-amber text-delos-black' : 'border-delos-surface/10 text-delos-black/50'}`}
                                                                                >
                                                                                    {cat}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                        <button
                                                                            onClick={handleCreateNewRole}
                                                                            disabled={isCreatingRole}
                                                                            className="w-full bg-delos-amber text-delos-black py-3 font-black text-[9px] uppercase tracking-widest hover:bg-delos-red hover:text-delos-surface transition-all flex items-center justify-center gap-2"
                                                                        >
                                                                            {isCreatingRole ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirmar_Inicialização'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>


                                        </div>
                                        <div className="space-y-2 ">
                                            <label className="text-[9px] font-black text-delos-black uppercase tracking-widest flex items-center gap-2">
                                                <LayoutGrid size={10} className="text-delos-amber" />
                                                Categoria da Vaga
                                            </label>
                                            <div className="relative group">
                                                <select
                                                    value={selectedCategoryUid}
                                                    onChange={(e) => setSelectedCategoryUid(e.target.value)}
                                                    className="w-full bg-delos-surface border border-delos-black/20 p-4 font-bold text-xs text-delos-black outline-none focus:border-delos-amber/50 appearance-none cursor-pointer uppercase tracking-widest"
                                                >
                                                    <option value="">-- SELECIONE A CATEGORIA --</option>
                                                    {categoryOptions.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {/* Seta customizada Delos */}
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-delos-black">
                                                    {catLoading ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} className="rotate-90" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Rótulo para vaga (Opcional) </label>
                                            <input value={tituloPersonalizado} onChange={(e) => setTituloPersonalizado(e.target.value)} placeholder="NOME DA INSTÂNCIA EXIBIDA..." className="w-full bg-delos-surface border border-delos-black/5 p-4 font-bold text-xs text-delos-black outline-none focus:border-amber-600/50 uppercase placeholder:text-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-delos-black/70 uppercase tracking-widest">Tipo de Vaga</label>
                                            <select value={tipoVaga} onChange={(e) => setTipoVaga(e.target.value)} className="w-full bg-delos-surface border border-delos-black/5 p-4 font-bold text-xs text-delos-black outline-none focus:border-amber-600/50 uppercase appearance-none cursor-pointer">
                                                <option value="EFETIVO">Efetivo (CLT)</option>
                                                <option value="PJ">Prestador (PJ)</option>
                                                <option value="FREELANCER">Freelancer</option>
                                                <option value="ESTAGIO">Estágio</option>
                                            </select>
                                        </div>
                                    </div>


                                </section>

                                <button onClick={() => setStep(2)} disabled={!selectedRoleUid} className="w-full bg-delos-black text-delos-surface py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-delos-amber hover:text-delos-black transition-all disabled:opacity-5">
                                    Avançar <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* ETAPA 2: PARÂMETROS DE CAMPO */}
                        {step === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-4 bg-delos-amber" />
                                    <h2 className="text-[11px] font-black text-delos-black uppercase tracking-[0.3em]">Dados da Vaga</h2>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-delos-black/50 uppercase tracking-widest">Paga ou Salario</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-amber" />
                                            <input
                                                type="number"
                                                value={salario} onChange={(e) => setSalario(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-delos-black/60 border border-delos-black 
                                                p-4 pl-12 font-mono text-xs text-delos-surface outline-none 
                                                focus:border-delos-amber" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-delos-black/50 uppercase tracking-widest">Localização</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-amber" />
                                            <input
                                                value={local}
                                                onChange={(e) => setLocal(e.target.value)}
                                                placeholder="Endereço..."
                                                className="w-full bg-delos-black/60 border border-delos-black p-4 pl-12 font-mono text-xs text-delos-surface outline-none focus:border-delos-amber" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Turno/Jornada</label>
                                        <div className="relative">
                                            <Clock10 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-delos-amber" />
                                            <input
                                                value={turno}
                                                onChange={(e) => setTurno(e.target.value)}
                                                placeholder="JORNADA..."
                                                className="w-full bg-delos-black/60 border border-delos-black p-4 pl-12 font-mono text-xs text-delos-surface outline-none focus:border-delos-amber" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Descrição da Vaga</label>
                                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} className="w-full bg-delos-black/60 border border-delos-black p-6 font-mono text-xs text-delos-surface outline-none focus:border-delos-amber resize-none uppercase tracking-tighter" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Diferencial</label>
                                        <div className="flex gap-1">
                                            <input
                                                value={novoRequisito}
                                                onChange={(e) => setNovoRequisito(e.target.value)}
                                                className="flex-1 bg-delos-black/70 border border-delos-surface/10 p-3 text-[10px] font-bold text-delos-surface uppercase"
                                                placeholder="Novo Diferencial..." />
                                            <button
                                                onClick={() => addItem(novoRequisito, setRequisitos, setNovoRequisito, requisitos)}
                                                className="bg-delos-black/70 text-delos-amber px-4 hover:bg-delos-amber hover:text-delos-black transition-all border border-delos-surface/5">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {requisitos.map((r, i) => (
                                                <span key={i} className="bg-delos-black/5 text-delos-black text-[10px] font-black px-2 py-1 border border-delos-surface/10 flex items-center gap-2 tracking-widest uppercase hover:border-delos-amber/40 transition-colors">
                                                    {r} <X className="w-3 h-3 cursor-pointer text-slate-700 hover:text-delos-amber" onClick={() => setRequisitos(requisitos.filter((_, idx) => idx !== i))} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Benefícios</label>
                                        <div className="flex gap-1">
                                            <input value={novoBeneficio} onChange={(e) => setNovoBeneficio(e.target.value)} className="flex-1 bg-delos-black/70 border border-delos-surface/10 p-3 text-[10px] font-bold text-delos-surface uppercase" placeholder="ADD_BENEFIT..." />
                                            <button onClick={() => addItem(novoBeneficio, setBeneficios, setNovoBeneficio, beneficios)} className="bg-delos-black/70 text-delos-amber px-4 hover:bg-delos-amber hover:text-delos-black transition-all border border-delos-surface/5"><Plus size={14} /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {beneficios.map((b, i) => (
                                                <span key={i} className="bg-delos-black/5 text-delos-black text-[10px] font-black px-2 py-1 border border-delos-surface/10 flex items-center gap-2 tracking-widest uppercase hover:border-delos-amber/40 transition-colors">
                                                    {b} <X className="w-3 h-3 cursor-pointer" onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-6">
                                    <button onClick={() => setStep(1)} className="w-1/4 bg-delos-surface border border-delos-black/50 py-4 font-black
                                     text-[9px] uppercase tracking-widest text-delos-black/60 hover:text-delos-amber hover:border-delos-amber hover:bg-delos-amber/10 transition-all italic">Voltar</button>
                                    <button onClick={() => setStep(3)} className="flex-1  border border-delos-black/50 text-delos-surface py-4 font-black text-[10px]
                                     uppercase tracking-[0.3em] bg-delos-black hover:bg-delos-amber hover:text-delos-surface transition-all">{buttonLabel}</button>
                                </div>
                            </div>
                        )}

                        {/* ETAPA 4: CONFIRMAÇÃO E PROGRESSO (OPCIONAL) */}
                        {step === 3 && (
                            <motion.div key="geo" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                <>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-4 bg-delos-amber" />
                                        <h2 className="text-[11px] font-black text-delos-black uppercase tracking-[0.3em]">Localização</h2>
                                    </div>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-4 md:col-span-2 relative">
                                            <label className={labelClassName}>CEP</label>
                                            <input type="text" pattern="\d*" value={localAddress.cep} maxLength={8} onChange={e => setLocalAddress({ ...localAddress, cep: e.target.value })} className={inputClassName} />
                                            {loadingCep && <Loader2 className="absolute right-4 bottom-4 animate-spin w-4 h-4 text-[var(--delos-amber)]" />}
                                        </div>

                                        <div className="col-span-12 md:col-span-8"><label className={labelClassName}>Logradouro</label><input type="text" value={localAddress.logradouro} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, logradouro: e.target.value })} className={inputClassName} /></div>
                                        <div className="col-span-3 md:col-span-2"><label className={labelClassName}>Nº</label><input type="text" value={localAddress.numero} onChange={e => setLocalAddress({ ...localAddress, numero: e.target.value })} className={inputClassName} /></div>
                                        <div className="col-span-9 md:col-span-6"><label className={labelClassName}>Complemento</label><input type="text" value={localAddress.complemento} onChange={e => setLocalAddress({ ...localAddress, complemento: e.target.value })} className={inputClassName} /></div>
                                        <div className="col-span-8 md:col-span-6"><label className={labelClassName}>Bairro</label><input type="text" value={localAddress.bairro} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, bairro: e.target.value })} className={inputClassName} /></div>

                                        <div className="col-span-9 md:col-span-6"><label className={labelClassName}>Cidade</label><input type="text" value={localAddress.cidade} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, cidade: e.target.value })} className={inputClassName} /></div>
                                        <div className="col-span-3 md:col-span-6"><label className={labelClassName}>UF</label><input type="text" maxLength={2} value={localAddress.estado} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, uf: e.target.value.toUpperCase() })} className={`${inputClassName} text-center`} /></div>
                                    </div>
                                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
                                        <Terminal size={14} className="text-indigo-400 mt-1 shrink-0" />
                                        <p className="text-[10px] font-mono text-indigo-400 uppercase leading-relaxed tracking-wider">
                                            Aviso: A alteração de endereço impacta diretamente na recomendação de vagas por proximidade geográfica.
                                        </p>

                                    </div>




                                    <div className="flex gap-2 pt-6">
                                        <button onClick={() => setStep(1)} className="w-1/4 bg-delos-surface border border-delos-black/50 py-4 font-black
                                     text-[9px] uppercase tracking-widest text-delos-black/60 hover:text-delos-amber hover:border-delos-amber hover:bg-delos-amber/10 transition-all italic">Voltar</button>
                                        <button onClick={() => setStep(4)} className="flex-1  border border-delos-black/50 text-delos-surface py-4 font-black text-[10px]
                                     uppercase tracking-[0.3em] bg-delos-black hover:bg-delos-amber hover:text-delos-surface transition-all">{buttonLabel}</button>
                                    </div>
                                </>
                            </motion.div>
                        )}
                        {/* ETAPA 4: CONFIRMAÇÃO E PROGRESSO (OPCIONAL) */}
                        {step === 4 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-right-4">

                                <div className="text-center space-y-2">
                                    <h2 className="text-[14px] font-black text-delos-amber uppercase tracking-[0.5em]">Canal_de_Comunicação</h2>
                                    <p className="text-[11px] text-delos-grey font-mono uppercase tracking-widest">Defina o método de interceptação de candidatos</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-delos-black/5 border border-delos-surface/5 p-1 rounded-sm">
                                    {[
                                        { id: 'email', icon: Mail, label: 'EMAIL', sub: 'Comunicação por E-mail' },
                                        { id: 'whatsapp', icon: MessageSquare, label: 'WHATSAPP', sub: 'Comunicação por WhatsApp' },
                                        { id: 'plataforma', icon: ShieldCheck, label: 'PLATAFORMA', sub: 'Comunicação pela Plataforma' }

                                    ].map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => setContatoOpt(opt.id)}
                                                className={`p-8 text-center transition-all duration-500 relative ${contatoOpt === opt.id
                                                    ? `bg-delos-amber/5 border-y border-amber-600/40`
                                                    : 'bg-delos-black/10 border-y border-transparent hover:bg-white/5'
                                                    }`}
                                            >
                                                {contatoOpt === opt.id && <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-delos-amber shadow-delos-black shadow-sm" />}
                                                <Icon className={`w-8 h-8 mx-auto mb-4 ${contatoOpt === opt.id ? `text-delos-amber` : 'text-delos-grey'}`} />
                                                <h3 className={`font-black text-[13px] uppercase tracking-widest ${contatoOpt === opt.id ? 'text-delos-black' : 'text-delos-grey'}`}>{opt.label}</h3>
                                                <p className="text-[9px] text-delos-grey font-mono uppercase tracking-tighter mt-1">{opt.sub}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* NOVO: SWITCH DE STATUS DA INSTÂNCIA */}
                                <div className="flex items-center justify-between p-4 bg-delos-surface/5 border border-delos-black/15 rounded-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg transition-all shadow-delos-black shadow-sm ${isActive ? 'bg-delos-green/30 text-delos-green' : 'bg-delos-red/30 text-delos-red'}`}>
                                            <Activity size={20} className={isActive ? 'animate-pulse' : ''} />
                                        </div>
                                        <div>
                                            <h3 className="text-[13px] font-black text-delos-black uppercase tracking-widest">Status da Vaga</h3>
                                            <p className="text-[11px] text-slate-500 uppercase font-mono tracking-tighter">
                                                {isActive ? 'Vaga Ativa: Visível na Matriz Global' : 'Vaga Inativa: Oculto para Candidatos'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative w-14 h-7 transition-all duration-500 border ${isActive ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-red-600/20 border-red-500/50'}`}
                                    >
                                        {/* Knob Estilo Industrial */}
                                        <div className={`absolute top-1 bottom-1 w-5 transition-all 
                                            duration-500
                                             ${isActive ? 'left-7 bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'left-1 bg-red-500 shadow-[0_0_10px_#ef4444]'}`}>
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-[1px] h-2 bg-white/30 mx-[1px]" />
                                                <div className="w-[1px] h-2 bg-white/30 mx-[1px]" />
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="pt-2 space-y-4">
                                    <button
                                        onClick={handleFinalizar}
                                        disabled={posting}
                                        className="w-full bg-delos-amber text-delos-black py-6 font-black 
                                        text-xs uppercase tracking-[0.4em] flex items-center 
                                        justify-center gap-4 hover:bg-delos-black hover:text-delos-surface transition-all
                                         shadow-[0_0_30px_rgba(217,119,6,0.2)]"
                                    >
                                        {posting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Salvar <CheckCircle className="w-4 h-4" /></>}
                                    </button>
                                    <button onClick={() => setStep(2)} className="
                                    w-full text-[12px] font-black text-delos-black/70 bg-delos-black/[0.08] py-5
                                     uppercase tracking-widest hover: hover:bg-delos-grey/80
                                      transition-colors text-center italic underline"
                                    >Rever a Vaga
                                    </button>
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div >
        </div >
    );
};

export default React.memo(PostNewJobModal);