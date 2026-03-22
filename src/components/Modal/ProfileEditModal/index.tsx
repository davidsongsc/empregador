"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, Terminal, Fingerprint, Database, Globe } from 'lucide-react';

// Hooks e Services
import { useBuscaCep } from '@/hooks/useBuscaCep';
import { useProfile } from '@/hooks/useProfile';
import { useAddressStore } from '@/store/useAddressStore';
import { updateAddress, createAddress } from '@/services/addressService';
import { toast } from '@/components/Notification';

type TabID = 'identity' | 'geo';

export const EditProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { profile, saveProfile, isSaving } = useProfile();
    const { addresses, fetchAddresses } = useAddressStore();
    const { lookup, loading: loadingCep } = useBuscaCep();
    const [activeTab, setActiveTab] = useState<TabID>('identity');

    // Estados de Rascunho (Local Draft)
    const [localProfile, setLocalProfile] = useState<any>(null);
    const [localAddress, setLocalAddress] = useState<any>(null);

    // Sincronização de Boot (Somente quando o modal abre)
    useEffect(() => {
        if (isOpen && profile) {
            setLocalProfile({ ...profile });

            const activeAddr = addresses.find(a => a.is_default) || addresses[0];
            setLocalAddress(activeAddr ? { ...activeAddr } : {
                cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: ''
            });
        }
    }, [isOpen, profile, addresses]);

    useEffect(() => {
        const cepLimpo = localAddress?.cep?.replace(/\D/g, "");

        if (cepLimpo?.length === 8) {
            const autoFill = async () => {
                const data = await lookup(cepLimpo);
                if (data) {
                    setLocalAddress((prev: any) => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    }));
                }
            };
            autoFill();
        }
    }, [localAddress?.cep, lookup]);
    const handleInternalSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tasks = [];

            // Task A: Perfil
            tasks.push(saveProfile(localProfile));

            // Task B: Endereço (Lógica de Upsert)
            if (localAddress.cep.replace(/\D/g, "").length === 8) {
                if (localAddress.id) {
                    tasks.push(updateAddress(localAddress.id, localAddress));
                } else {
                    tasks.push(createAddress(localAddress));
                }
            }

            await Promise.all(tasks);
            toast.success("Dados salvos com sucesso.");

            // Refresh Store de Endereços
            if (profile?.usuario_id) fetchAddresses(profile.usuario_id);

            onClose();
        } catch (err) {
            toast.error("Erro na sincronização dos dados.");
        }
    };

    if (!isOpen || !localProfile || !localAddress) return null;

    const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-sm py-3 px-4 font-bold outline-none transition-all text-sm text-[var(--delos-black)]";
    const labelClassName = "text-[7px] md:text-[14px] font-mono font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 mb-1 block";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />

                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} style={{ backgroundColor: 'var(--delos-surface)' }} className="w-full max-w-4xl h-[92vh] md:h-[650px] rounded-t-[20px] md:rounded-sm shadow-2xl relative z-10 overflow-hidden border-t md:border border-white/10 flex flex-col">

                    {/* HEADER */}
                    <div className="p-4 md:p-6 border-b border-black/10 flex justify-between items-center bg-black/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-sm bg-[var(--delos-amber)] text-white"><Fingerprint size={20} /></div>
                            <div>
                                <h2 className="text-sm md:text-xl font-black uppercase italic tracking-tighter">Dados do perfil e Localização</h2>
                                <span className="text-[7px] font-mono uppercase tracking-[0.4em] opacity-40">Candidato</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:text-red-500 transition-colors"><X size={24} /></button>
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-black/5">
                        <button onClick={() => setActiveTab('identity')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === 'identity' ? 'border-[var(--delos-amber)] text-[var(--delos-amber)]' : 'border-transparent opacity-40'}`}>
                            <Database size={12} /> Dados do Perfil
                        </button>
                        <button onClick={() => setActiveTab('geo')} className={`flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === 'geo' ? 'border-[var(--delos-amber)] text-[var(--delos-amber)]' : 'border-transparent opacity-40'}`}>
                            <Globe size={12} /> Localização
                        </button>
                    </div>

                    <form onSubmit={handleInternalSave} className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-5 md:p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'identity' ? (
                                    <motion.div key="id" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div><label className={labelClassName}>Nome</label><input type="text" value={localProfile.name} onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })} className={inputClassName} /></div>
                                            <div><label className={labelClassName}>Sobrenome</label><input type="text" value={localProfile.last_name} onChange={e => setLocalProfile({ ...localProfile, last_name: e.target.value })} className={inputClassName} /></div>
                                            <div><label className={labelClassName}>Nascimento</label><input type="date" value={localProfile.data_nascimento} onChange={e => setLocalProfile({ ...localProfile, data_nascimento: e.target.value })} className={inputClassName} /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className={labelClassName}>Profissão</label><input type="text" value={localProfile.ocupation} onChange={e => setLocalProfile({ ...localProfile, ocupation: e.target.value })} className={inputClassName} /></div>
                                            <div><label className={labelClassName}>Email Contato</label><input type="email" value={localProfile.email_contato} onChange={e => setLocalProfile({ ...localProfile, email_contato: e.target.value })} className={inputClassName} /></div>
                                        </div>
                                        <div><label className={labelClassName}>Bio(resumo)</label><textarea rows={4} value={localProfile.bio} onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })} className={`${inputClassName} resize-none`} /></div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="geo" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                                            <div className="col-span-2 md:col-span-4"><label className={labelClassName}>CEP</label><input type="text" value={localAddress.cep} onChange={e => setLocalAddress({ ...localAddress, cep: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-2 md:col-span-8"><label className={labelClassName}>Rua</label><input type="text" value={localAddress.logradouro} onChange={e => setLocalAddress({ ...localAddress, logradouro: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-1 md:col-span-3"><label className={labelClassName}>Nº</label><input type="text" value={localAddress.numero} onChange={e => setLocalAddress({ ...localAddress, numero: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-1 md:col-span-9"><label className={labelClassName}>Complemento</label><input type="text" value={localAddress.complemento} onChange={e => setLocalAddress({ ...localAddress, complemento: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-2 md:col-span-5"><label className={labelClassName}>Bairro</label><input type="text" value={localAddress.bairro} onChange={e => setLocalAddress({ ...localAddress, bairro: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-1 md:col-span-5"><label className={labelClassName}>Cidade</label><input type="text" value={localAddress.cidade} onChange={e => setLocalAddress({ ...localAddress, cidade: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-1 md:col-span-2"><label className={labelClassName}>UF</label><input type="text" maxLength={2} value={localAddress.estado} onChange={e => setLocalAddress({ ...localAddress, estado: e.target.value.toUpperCase() })} className={`${inputClassName} text-center`} /></div>
                                        </div>{/* Indicador de carregamento sutil dentro do input */}
                                        {loadingCep && (
                                            <div className="absolute right-3 bottom-3">
                                                <Loader2 className="animate-spin w-4 h-4 text-[var(--delos-amber)]" />
                                            </div>
                                        )}
                                        <div className="mt-8 p-4 border border-indigo-500/20 bg-indigo-500/5"><p className="text-[9px] font-mono text-indigo-400 uppercase"><Terminal className="inline w-3 h-3 mr-2" /> Alterações de GPS requerem autorização de nível 2.</p></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-4 md:p-6 border-t border-black/10 bg-black/5">
                            <button type="submit" disabled={isSaving} style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }} className="w-full py-4 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-30 active:scale-95 shadow-xl">
                                {isSaving ? <Loader2 className="animate-spin w-4 h-8" /> : <Save className="w-4 h-8" />}
                                {isSaving ? "Sincronizando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};