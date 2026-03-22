"use client";
import React, { useEffect, useState, useMemo } from 'react';
import {
    X, Plus, Trash2, Save, GraduationCap,
    BookOpen, Calendar, Loader2, AlertCircle, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEducationStore } from '@/store/useEducationStore';
import { toast } from '@/components/Notification';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // O profileId não é estritamente necessário para o POST/PATCH no seu backend atual,
    // pois ele pega o usuário pelo token, mas mantemos para consistência de interface se necessário.
    profileId?: string;
}

export const EducationManagerModal = ({ isOpen, onClose, profileId }: Props) => {
    const {
        educations, loading, fetchEducations,
        addEducation, updateEducation, deleteEducation, totalCount
    } = useEducationStore();

    // Estado local para manipulação de UX (Editable List)
    const [localEdus, setLocalEdus] = useState<any[]>([]);

    // 1. SINCRONIZAÇÃO INICIAL (Leitura do Store/IDB)
    useEffect(() => {
        if (isOpen) {
            // Chama o fetch inteligente (lê IDB primeiro, depois valida ETag)
            fetchEducations();
        }
    }, [isOpen, fetchEducations]);

    // 2. REIDRATAÇÃO DO ESTADO LOCAL
    useEffect(() => {
        // Quando as educations mudam no store (via fetch ou sync), atualizamos a UI
        setLocalEdus(educations);
    }, [educations]);

    const handleAddNew = () => {
        const newEntry = {
            id: undefined, // Crucial para o sync diferenciar POST de PATCH
            curso: "",
            instituicao: "",
            data_inicio: "",
            data_fim: null,
            cursando_atualmente: false,
            descricao: ""
        };
        // Adiciona no topo para visibilidade imediata
        setLocalEdus([newEntry, ...localEdus]);
    };

    const handleSyncRow = async (index: number) => {
        const edu = localEdus[index];

        if (!edu.curso || !edu.instituicao) return;

        try {
            const payload = {
                tipo: edu.tipo || "GRADUATION", 

                instituicao: edu.instituicao,
                curso: edu.curso,
                nivel: edu.nivel || "Ensino Superior",
                data_inicio: edu.data_inicio,

                data_conclusao: edu.cursando_atualmente ? null : (edu.data_conclusao || null),

                descricao: edu.descricao || "",
                url_evidencia: edu.url_evidencia || null,

                profile_id: profileId || undefined
            };

            if (edu.id) {
                await updateEducation(edu.id, payload);
            } else {
                await addEducation(payload);
            }
            toast.success("Dados do Curso sincronizados.");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Erro ao sincronizar Curso.");
        }
    };

    const handleDelete = async (id: string, index: number) => {
        if (!id) {
            // Se não tem ID, removemos apenas do estado local do modal
            const newArr = localEdus.filter((_, i) => i !== index); // <-- Corrigido para localEdus
            setLocalEdus(newArr);
            return;
        }

        try {
            await deleteEducation(id);
            // O store já atualiza a lista global e o totalCount
        } catch (err) {
            console.error("Erro ao deletar registro.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-delos-black/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-delos-surface w-full max-w-4xl max-h-[90vh] border border-delos-border shadow-2xl flex flex-col overflow-hidden font-mono"
                >
                    {/* Header estilo Terminal Westworld */}
                    <div className="p-6 border-b border-delos-border bg-delos-black/20 flex justify-between items-center relative">
                        <div className="absolute top-0 left-0 p-1.5 bg-delos-amber text-black text-[7px] font-black uppercase tracking-widest">
                            Unit::Academic_Logs
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <GraduationCap className="text-delos-amber" size={20} />
                            <div>
                                <h2 className="text-delos-texto text-lg font-black uppercase italic tracking-tighter">DNA_Career::Education_Manager</h2>
                                <p className="text-[8px] text-delos-subtext uppercase tracking-[0.2em]">Gestão de Histórico Acadêmico</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 px-4 py-2 bg-delos-amber text-black text-[10px] font-black uppercase tracking-widest hover:bg-delos-amber/80 transition-all shadow-lg active:scale-95"
                            >
                                <Plus size={14} /> Injetar_Formação
                            </button>
                            <button onClick={onClose} className="text-delos-subtext hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                    </div>

                    {/* Body - Editable List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar min-h-[300px]">
                        {loading && localEdus.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                <Loader2 size={30} className="animate-spin mb-4 text-delos-indigo" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Sincronizando Terminal Acadêmico...</span>
                            </div>
                        ) : localEdus.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-delos-border rounded-sm opacity-40">
                                <BookOpen size={30} className="mx-auto mb-4 opacity-20" />
                                <p className="text-[10px] font-mono uppercase tracking-widest">Nenhum registro acadêmico encontrado.</p>
                                <p className="text-[8px] font-mono uppercase tracking-widest mt-1">Clique em 'Injetar_Formação' para iniciar.</p>
                            </div>
                        ) : (
                            localEdus.map((edu, idx) => (
                                <div key={edu.id || `new-edu-${idx}`} className={`p-5 border transition-all duration-300 relative ${!edu.id ? 'border-delos-amber/40 bg-delos-amber/5' : 'border-delos-border bg-delos-black/5'}`}>

                                    {!edu.id && (
                                        <div className="absolute -top-2 -left-2 bg-delos-amber text-black text-[7px] font-mono font-bold px-2 py-0.5 uppercase tracking-tighter">
                                            New_Entry::Draft
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Campos de Dados */}
                                        <div className="space-y-4 md:col-span-2 text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black opacity-40 tracking-widest text-delos-texto">Curso / Certificação</label>
                                                    <input
                                                        className="w-full bg-black/20 border border-white/10 p-2 text-xs font-bold outline-none focus:border-delos-amber transition-colors text-delos-texto"
                                                        value={edu.curso}
                                                        placeholder="Ex: Engenharia_de_Software"
                                                        onChange={(e) => {
                                                            const newArr = [...localEdus];
                                                            newArr[idx].curso = e.target.value;
                                                            setLocalEdus(newArr);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black opacity-40 tracking-widest text-delos-texto">Instituição</label>
                                                    <input
                                                        className="w-full bg-black/20 border border-white/10 p-2 text-xs font-bold outline-none focus:border-delos-amber transition-colors text-delos-texto"
                                                        value={edu.instituicao}
                                                        placeholder="Ex: MIT_Corp"
                                                        onChange={(e) => {
                                                            const newArr = [...localEdus];
                                                            newArr[idx].instituicao = e.target.value;
                                                            setLocalEdus(newArr);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Datas de Início e Fim */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black opacity-40 tracking-widest text-delos-texto">Início</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-black/20 border border-white/10 p-2 text-[10px] font-bold outline-none text-delos-texto"
                                                        value={edu.data_inicio}
                                                        onChange={(e) => {
                                                            const newArr = [...localEdus];
                                                            newArr[idx].data_inicio = e.target.value;
                                                            setLocalEdus(newArr);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase font-black opacity-40 tracking-widest text-delos-texto">Conclusão</label>
                                                    <input
                                                        type="date"
                                                        disabled={edu.cursando_atualmente}
                                                        className={`w-full bg-black/20 border border-white/10 p-2 text-[10px] font-bold outline-none text-delos-texto ${edu.cursando_atualmente ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                        value={edu.cursando_atualmente ? "" : (edu.data_fim || "")}
                                                        onChange={(e) => {
                                                            const newArr = [...localEdus];
                                                            newArr[idx].data_fim = e.target.value;
                                                            setLocalEdus(newArr);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-end pb-2">
                                                    <label className="flex items-center gap-2 cursor-pointer group/check">
                                                        <input
                                                            type="checkbox"
                                                            checked={edu.cursando_atualmente}
                                                            onChange={(e) => {
                                                                const newArr = [...localEdus];
                                                                newArr[idx].cursando_atualmente = e.target.checked;
                                                                // Se marcar cursando, limpa a data de fim para o sync
                                                                if (e.target.checked) newArr[idx].data_fim = null;
                                                                setLocalEdus(newArr);
                                                            }}
                                                            className="w-3.5 h-3.5 bg-transparent border-white/20 text-delos-amber focus:ring-0 rounded-none"
                                                        />
                                                        <span className={`text-[8px] uppercase font-black tracking-widest ${edu.cursando_atualmente ? 'text-delos-amber' : 'opacity-60 text-delos-subtext'}`}>
                                                            Status::Cursando
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] uppercase font-black opacity-40 tracking-widest text-delos-texto">Tipo</label>
                                                <select
                                                    className="w-full bg-black/20 border border-white/10 p-2 text-xs font-bold outline-none focus:border-delos-amber text-delos-texto"
                                                    value={edu.tipo || "GRADUATION"}
                                                    onChange={(e) => {
                                                        const newArr = [...localEdus];
                                                        newArr[idx].tipo = e.target.value;
                                                        setLocalEdus(newArr);
                                                    }}
                                                >
                                                    <option value="GRADUATION">Graduação</option>
                                                    <option value="POST_GRADUATION">Pós-Graduação</option>
                                                    <option value="CERTIFICATION">Certificação</option>
                                                    <option value="COURSE">Curso Livre</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Actions - Sincronizar e Deletar */}
                                        <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                            <button
                                                onClick={() => handleSyncRow(idx)}
                                                disabled={loading}
                                                className="flex-1 flex items-center justify-center gap-2 bg-delos-black border border-delos-amber/40 text-delos-amber text-[9px] font-black uppercase py-2.5 hover:bg-delos-amber hover:text-black transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-[0.97]"
                                            >
                                                {loading && !edu.id ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                                Sincronizar_Dados
                                            </button>
                                            <button
                                                onClick={() => handleDelete(edu.id, idx)}
                                                disabled={loading}
                                                className="flex items-center justify-center bg-red-950/20 border border-red-900/30 text-red-500 p-2.5 hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 active:scale-[0.97]"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-delos-black/40 border-t border-delos-border flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[8px] text-delos-subtext">
                            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-delos-amber animate-pulse' : 'bg-green-500'}`} />
                            <span>Conexão::Terminal_Academico_Ativa</span>
                            <span className="opacity-40">// Sync_Mode::ETag_Delta</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-delos-subtext font-mono">
                            <Terminal size={10} className="text-delos-indigo" />
                            TOTAL_RECORDS:: {totalCount}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};