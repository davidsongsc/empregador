import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, MapPinned, Loader2, Save, Terminal, Fingerprint, Database, Globe } from 'lucide-react';

// --- Interfaces (Mantidas) ---
interface Address {
    cep: string; logradouro: string; numero: string;
    complemento: string; bairro: string; cidade: string; estado: string;
}

interface ProfileFormData {
    name: string; last_name: string; data_nascimento: string;
    ocupation: string; email: string; bio: string; endereco: Address;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: ProfileFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    handleSave: (e: React.FormEvent) => void;
    isSaving: boolean;
}

type TabID = 'identity' | 'geo';

export const EditProfileModal = ({
    isOpen, onClose, formData, setFormData, handleSave, isSaving,
}: EditProfileModalProps) => {
    const [activeTab, setActiveTab] = useState<TabID>('identity');

    const updateAddress = (field: keyof Address, value: string) => {
        setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, [field]: value }
        }));
    };

    // Classes responsivas: padding menor no mobile, fonte ajustada
    const inputClassName = "w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[var(--delos-amber)] rounded-sm py-3 px-4 font-bold outline-none transition-all text-sm";
    const labelClassName = "text-[7px] md:text-[8px] font-mono font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40 mb-1 block";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 dark:bg-black/95 backdrop-blur-md"
                    />

                    {/* Modal Container: h-full no mobile para evitar scrolls duplos estranhos */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }}
                        className="w-full max-w-4xl h-[92vh] md:h-[650px] rounded-t-[20px] md:rounded-sm shadow-2xl relative z-10 overflow-hidden border-t md:border border-white/10 flex flex-col"
                    >
                        {/* HEADER: Ajustado para mobile */}
                        <div className="p-4 md:p-6 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/5 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div style={{ backgroundColor: 'var(--delos-amber)', color: 'white' }} className="p-2 rounded-sm">
                                    <Fingerprint className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm md:text-xl font-black uppercase italic tracking-tighter">Editar_Perfil</h2>
                                    <span className="hidden md:block text-[7px] font-mono uppercase tracking-[0.4em] opacity-40">Administrative_Override</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* TABS: Mais altas no mobile para facilitar o clique (touch target) */}
                        <div className="flex border-b border-black/5 dark:border-white/5">
                            <button
                                onClick={() => setActiveTab('identity')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'identity' ? 'border-[var(--delos-amber)] text-[var(--delos-amber)]' : 'border-transparent opacity-40'}`}
                            >
                                <Database size={12} /> Dados
                            </button>
                            <button
                                onClick={() => setActiveTab('geo')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'geo' ? 'border-[var(--delos-amber)] text-[var(--delos-amber)]' : 'border-transparent opacity-40'}`}
                            >
                                <Globe size={12} /> Endereço
                            </button>
                        </div>

                        {/* FORM CONTENT */}
                        <form onSubmit={handleSave} className="flex-1 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'identity' ? (
                                        <motion.div
                                            key="identity"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6 md:space-y-8"
                                        >
                                            {/* Grid Mobile: 1 coluna | Desktop: 3 colunas */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                                <div className="space-y-1">
                                                    <label className={labelClassName}>Nome</label>
                                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClassName} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClassName}>Sobrenome</label>
                                                    <input type="text" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} className={inputClassName} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClassName}>Data_Nascimento</label>
                                                    <input type="date" value={formData.data_nascimento} onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })} className={inputClassName} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="space-y-1">
                                                    <label className={labelClassName}>Profissão</label>
                                                    <input type="text" value={formData.ocupation} onChange={e => setFormData({ ...formData, ocupation: e.target.value })} className={inputClassName} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClassName}>Email</label>
                                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClassName} />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className={labelClassName}>Resumo profissional (Bio)</label>
                                                <textarea rows={4} md-rows={6} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className={`${inputClassName} resize-none`} />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="geo"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">
                                                <div className="col-span-2 md:col-span-4">
                                                    <label className={labelClassName}>Protocolo_CEP</label>
                                                    <input type="text" value={formData.endereco.cep} onChange={e => updateAddress('cep', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-2 md:col-span-8">
                                                    <label className={labelClassName}>Logradouro</label>
                                                    <input type="text" value={formData.endereco.logradouro} onChange={e => updateAddress('logradouro', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-1 md:col-span-3">
                                                    <label className={labelClassName}>Ponto_ID (Nº)</label>
                                                    <input type="text" value={formData.endereco.numero} onChange={e => updateAddress('numero', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-1 md:col-span-9">
                                                    <label className={labelClassName}>Complemento</label>
                                                    <input type="text" value={formData.endereco.complemento} onChange={e => updateAddress('complemento', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-2 md:col-span-5">
                                                    <label className={labelClassName}>Bairro</label>
                                                    <input type="text" value={formData.endereco.bairro} onChange={e => updateAddress('bairro', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-1 md:col-span-5">
                                                    <label className={labelClassName}>Cidade</label>
                                                    <input type="text" value={formData.endereco.cidade} onChange={e => updateAddress('cidade', e.target.value)} className={inputClassName} />
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className={labelClassName}>UF</label>
                                                    <input type="text" maxLength={2} value={formData.endereco.estado} onChange={e => updateAddress('estado', e.target.value.toUpperCase())} className={`${inputClassName} text-center font-mono`} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* FOOTER: Fixo embaixo no mobile */}
                            <div className="p-4 md:p-6 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
                                    className="w-full py-4 md:py-4 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-30 active:scale-[0.98]"
                                >
                                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? "Processando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};