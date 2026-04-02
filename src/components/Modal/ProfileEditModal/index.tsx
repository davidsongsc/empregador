"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save, Terminal, Fingerprint, Database, Globe } from 'lucide-react';

import { useBuscaCep } from '@/hooks/useBuscaCep';
import { useProfile } from '@/hooks/useProfile';
import { useAddressStore } from '@/store/useAddressStore';
import { updateAddress, createAddress } from '@/services/addressService';
import { toast } from '@/components/Notification';
import { sendGAEvent } from '@next/third-parties/google';

type TabID = 'identity' | 'geo';

export const EditProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { profile, saveProfile, isSaving } = useProfile();
    const { addresses, fetchAddresses,  editAddress, addAddress } = useAddressStore();
    const { lookup, loading: loadingCep } = useBuscaCep();
    const [activeTab, setActiveTab] = useState<TabID>('identity');
    const [addressBlock, setAddressBlock] = useState<boolean>(true);
    const [localProfile, setLocalProfile] = useState<any>(null);
    const [localAddress, setLocalAddress] = useState<any>(null);

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

                    }));
                }
            };
            autoFill();
        }
    }, [localAddress?.cep, lookup]);

    const handleTabChange = (tab: TabID) => {
        setActiveTab(tab);
        sendGAEvent('event', 'modal_navigation', {
            modal_name: 'edit_profile',
            target_tab: tab
        });
    };

    const handleInternalSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tasks = [];
            tasks.push(saveProfile(localProfile));
            const cleanCep = localAddress.cep.replace(/\D/g, "");
            if (cleanCep.length === 8) {
                if (localAddress.id) {
                    // UPDATE EXPLÍCITO
                    tasks.push(editAddress(localAddress.id, localAddress));
                    toast.info("Atualizando localização...");
                } else {
                    // CREATE EXPLÍCITO
                    tasks.push(addAddress(localAddress));
                    toast.info("Registrando novo endereço...");
                }
            }

            await Promise.all(tasks);

            sendGAEvent('event', 'profile_update_complete', {
                has_bio: !!localProfile.bio,
                occupation: localProfile.ocupation || 'generalist',
                city: localAddress.cidade
            });

            toast.success("Sincronização com a matriz concluída.");
            if (profile?.usuario_id) fetchAddresses(profile.usuario_id);
            onClose();
        } catch (err) {
            sendGAEvent('event', 'profile_update_error', { error: 'sync_failure' });
            toast.error("Falha na transmissão dos dados.");
        }
    };

    if (!isOpen || !localProfile || !localAddress) return null;

    const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-none py-4 px-4 font-bold outline-none transition-all text-base md:text-sm text-[var(--delos-black)] appearance-none";
    const labelClassName = "text-[9px] font-mono font-black uppercase tracking-[0.2em] opacity-50 mb-1.5 block";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    style={{ backgroundColor: 'var(--delos-surface)' }}
                    className="w-full max-w-4xl h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-[32px] md:rounded-none shadow-2xl relative z-10 overflow-hidden flex flex-col border-t border-white/10"
                >
                    <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mt-4 mb-2 md:hidden" />

                    <div className="px-6 py-4 md:p-8 border-b border-black/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex p-2 bg-[var(--delos-black)] text-[var(--delos-amber)]">
                                <Fingerprint size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-none">Ajustar Informações do Perfil</h2>
                                <p className="text-[8px] font-mono uppercase tracking-[0.3em] opacity-40 mt-1.5">Chave: {profile?.usuario_id?.slice(0, 8)}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-black/5 md:bg-transparent rounded-full hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="px-6 py-2 md:px-8 flex gap-2">
                        <button
                            onClick={() => handleTabChange('identity')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'identity' ? 'bg-[var(--delos-black)] text-[var(--delos-amber)]' : 'text-black/30 hover:bg-black/5'}`}
                        >
                            <Database size={14} /> Identidade
                        </button>
                        <button
                            onClick={() => handleTabChange('geo')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'geo' ? 'bg-[var(--delos-black)] text-[var(--delos-amber)]' : 'text-black/30 hover:bg-black/5'}`}
                        >
                            <Globe size={14} /> Localização
                        </button>
                    </div>

                    <form onSubmit={handleInternalSave} className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 space-y-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'identity' ? (
                                    <motion.div key="id" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div><label className={labelClassName}>Primeiro_Nome</label><input type="text" value={localProfile.name} onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })} className={inputClassName} /></div>
                                            <div><label className={labelClassName}>Sobrenome</label><input type="text" value={localProfile.last_name} onChange={e => setLocalProfile({ ...localProfile, last_name: e.target.value })} className={inputClassName} /></div>
                                            <div ><label className={labelClassName}>Ocupação_Profissional</label><input type="text" value={localProfile.ocupation} onChange={e => setLocalProfile({ ...localProfile, ocupation: e.target.value })} className={inputClassName} /></div>
                                            <div><label className={labelClassName}>Nascimento</label><input type="date" value={localProfile.data_nascimento} onChange={e => setLocalProfile({ ...localProfile, data_nascimento: e.target.value })} className={inputClassName} /></div>

                                            <div className={labelClassName}><label className={labelClassName}>Email_Contato_Externo</label><input type="email" value={localProfile.email_contato} onChange={e => setLocalProfile({ ...localProfile, email_contato: e.target.value })} className={inputClassName} /></div>
                                            <div className={labelClassName}><label className={labelClassName}>Whatsapp Contato</label><input type="number" maxLength={11} value={localProfile.phone} onChange={e => setLocalProfile({ ...localProfile, phone: e.target.value })} className={inputClassName} /></div>
                                        </div>
                                        <div>
                                            <label className={labelClassName}>Biografia_Resumo</label>
                                            <textarea rows={4} value={localProfile.bio} onChange={e => setLocalProfile({ ...localProfile, bio: e.target.value })} className={`${inputClassName} resize-none h-32 md:h-24`} />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="geo" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-4 md:col-span-2 relative">
                                                <label className={labelClassName}>CEP</label>
                                                <input type="text" pattern="\d*" value={localAddress.cep} maxLength={8} onChange={e => setLocalAddress({ ...localAddress, cep: e.target.value })} className={inputClassName} />
                                                {loadingCep && <Loader2 className="absolute right-4 bottom-4 animate-spin w-4 h-4 text-[var(--delos-amber)]" />}
                                            </div>
                                            <div className="col-span-8 md:col-span-4"><label className={labelClassName}>Bairro</label><input type="text" value={localAddress.bairro} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, bairro: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-12 md:col-span-4"><label className={labelClassName}>Logradouro</label><input type="text" value={localAddress.logradouro} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, logradouro: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-3 md:col-span-2"><label className={labelClassName}>Nº</label><input type="text" value={localAddress.numero} onChange={e => setLocalAddress({ ...localAddress, numero: e.target.value })} className={inputClassName} /></div>

                                            <div className="col-span-9 md:col-span-6"><label className={labelClassName}>Complemento</label><input type="text" value={localAddress.complemento} onChange={e => setLocalAddress({ ...localAddress, complemento: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-9 md:col-span-5"><label className={labelClassName}>Cidade</label><input type="text" value={localAddress.cidade} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, cidade: e.target.value })} className={inputClassName} /></div>
                                            <div className="col-span-3 md:col-span-1"><label className={labelClassName}>UF</label><input type="text" maxLength={2} value={localAddress.estado} disabled={addressBlock} onChange={e => setLocalAddress({ ...localAddress, estado: e.target.value.toUpperCase() })} className={`${inputClassName} text-center`} /></div>
                                        </div>
                                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
                                            <Terminal size={14} className="text-indigo-400 mt-1 shrink-0" />
                                            <p className="text-[10px] font-mono text-indigo-400 uppercase leading-relaxed tracking-wider">
                                                Aviso: A alteração de endereço impacta diretamente na recomendação de vagas por proximidade geográfica.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-6 md:px-12 md:py-8 bg-white md:bg-black/5 border-t border-black/5">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-[var(--delos-black)] text-[var(--delos-surface)] py-5 rounded-none font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-[var(--delos-amber)] hover:text-black transition-all active:scale-95 disabled:opacity-30 shadow-2xl"
                            >
                                {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {isSaving ? "TRANSMITINDO_DADOS..." : "CONFIRMAR_ALTERAÇÕES"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};