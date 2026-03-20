"use client";
import React, { useEffect, useState } from 'react';
import { 
  X, Plus, Trash2, Save, Database, 
  Briefcase, Calendar, Loader2, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '@/store/useExperienceStore';
import { toast } from '@/components/Notification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
}

export const ExperienceManagerModal = ({ isOpen, onClose, profileId }: Props) => {
  const { 
    experiences, loading, fetchExperiences, 
    addExperience, updateExperience, deleteExperience 
  } = useExperienceStore();

  const [localExps, setLocalExps] = useState<any[]>([]);

  // 1. Sincronização Inicial
  useEffect(() => {
    if (isOpen && profileId) {
      fetchExperiences(profileId, true);
    }
  }, [isOpen, profileId]);

  // 2. Mapeamento para Estado Local (Editable UI)
  useEffect(() => {
    setLocalExps(experiences);
  }, [experiences]);

  const handleAddNew = () => {
    const newEntry = {
      empresa: "",
      cargo: "",
      data_entrada: "",
      data_saida: null,
      atualmente_trabalhando: false,
      descricao: ""
    };
    setLocalExps([newEntry, ...localExps]);
  };

  const handleSyncRow = async (index: number) => {
    const exp = localExps[index];
    if (!exp.empresa || !exp.cargo || !exp.data_entrada) {
      toast.error("Campos obrigatórios: Empresa, Cargo e Entrada.");
      return;
    }

    try {
      const payload = {
        ...exp,
        data_saida: exp.atualmente_trabalhando ? null : (exp.data_saida || null),
        profile_id: profileId
      };

      if (exp.id) {
        await updateExperience(exp.id, payload);
        toast.success("Registro atualizado.");
      } else {
        await addExperience(payload);
        toast.success("Novo registro sincronizado.");
      }
    } catch (err) {
      toast.error("Falha na sincronização com o Terminal.");
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
          {/* Header */}
          <div className="p-6 border-b border-delos-border bg-delos-black/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Database className="text-delos-amber" size={20} />
              <div>
                <h2 className="text-delos-texto text-lg font-black uppercase italic tracking-tighter">DNA_Career::Experience_Manager</h2>
                <p className="text-[8px] text-delos-subtext uppercase tracking-[0.2em]">Gestão de Histórico Profissional</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-delos-amber text-black text-[10px] font-black uppercase tracking-widest hover:bg-delos-amber/80 transition-all"
              >
                <Plus size={14} /> Injetar_Dados
              </button>
              <button onClick={onClose} className="text-delos-subtext hover:text-white"><X size={20} /></button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {loading && localExps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Loader2 size={30} className="animate-spin mb-4" />
                <span className="text-[10px] uppercase tracking-widest font-black">Sincronizando Terminal...</span>
              </div>
            ) : (
              localExps.map((exp, idx) => (
                <div key={exp.id || `new-${idx}`} className={`p-5 border transition-all ${!exp.id ? 'border-delos-amber/40 bg-delos-amber/5' : 'border-delos-border bg-delos-black/5'}`}>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Empresa & Cargo */}
                    <div className="space-y-4 md:col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black opacity-40">Empresa</label>
                          <input 
                            className="w-full bg-black/20 border border-white/10 p-2 text-xs font-bold outline-none focus:border-delos-amber"
                            value={exp.empresa}
                            onChange={(e) => {
                              const newArr = [...localExps];
                              newArr[idx].empresa = e.target.value;
                              setLocalExps(newArr);
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black opacity-40">Cargo</label>
                          <input 
                            className="w-full bg-black/20 border border-white/10 p-2 text-xs font-bold outline-none focus:border-delos-amber"
                            value={exp.cargo}
                            onChange={(e) => {
                              const newArr = [...localExps];
                              newArr[idx].cargo = e.target.value;
                              setLocalExps(newArr);
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Datas */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black opacity-40">Entrada</label>
                          <input 
                            type="date"
                            className="w-full bg-black/20 border border-white/10 p-2 text-[10px] font-bold outline-none"
                            value={exp.data_entrada}
                            onChange={(e) => {
                              const newArr = [...localExps];
                              newArr[idx].data_entrada = e.target.value;
                              setLocalExps(newArr);
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-black opacity-40">Saída</label>
                          <input 
                            type="date"
                            disabled={exp.atualmente_trabalhando}
                            className={`w-full bg-black/20 border border-white/10 p-2 text-[10px] font-bold outline-none ${exp.atualmente_trabalhando ? 'opacity-20' : ''}`}
                            value={exp.atualmente_trabalhando ? "" : (exp.data_saida || "")}
                            onChange={(e) => {
                              const newArr = [...localExps];
                              newArr[idx].data_saida = e.target.value;
                              setLocalExps(newArr);
                            }}
                          />
                        </div>
                        <div className="flex items-end pb-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={exp.atualmente_trabalhando}
                              onChange={(e) => {
                                const newArr = [...localExps];
                                newArr[idx].atualmente_trabalhando = e.target.checked;
                                if (e.target.checked) newArr[idx].data_saida = null;
                                setLocalExps(newArr);
                              }}
                              className="w-3 h-3 bg-transparent border-white/20 text-delos-amber focus:ring-0"
                            />
                            <span className="text-[8px] uppercase font-black opacity-60">Atual</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                      <button 
                        onClick={() => handleSyncRow(idx)}
                        className="flex-1 flex items-center justify-center gap-2 bg-delos-black border border-delos-amber/40 text-delos-amber text-[9px] font-black uppercase py-2 hover:bg-delos-amber hover:text-black transition-all"
                      >
                        <Save size={12} /> Sincronizar
                      </button>
                      <button 
                        onClick={() => exp.id && deleteExperience(exp.id)}
                        className="flex items-center justify-center bg-red-950/20 border border-red-900/30 text-red-500 p-2 hover:bg-red-600 hover:text-white transition-all"
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
              <div className="w-1.5 h-1.5 bg-delos-amber rounded-full animate-pulse" />
              <span>Conexão::Terminal_Ativa</span>
            </div>
            <span className="text-[8px] text-delos-subtext font-mono">TOTAL_RECORDS: {experiences.length}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};