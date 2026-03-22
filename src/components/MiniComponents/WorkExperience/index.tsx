"use client"
import React, { useEffect } from 'react';
import { Briefcase, Terminal, Loader2 } from 'lucide-react';
import { useExperienceStore } from '@/store/useExperienceStore';
import { useProfile } from '@/hooks/useProfile'; // Ou de onde você tira o profile atual

interface WorkExperienceProps {
  onAddEntry?: () => void; // Mantemos apenas o gatilho para abrir o modal
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ onAddEntry }) => {
  const { profile } = useProfile();
  
  // Consumo direto do Store de Experiências
  const { 
    experiences, 
    loading, 
    fetchExperiences 
  } = useExperienceStore();

  // Sincronização automática baseada no ID do perfil logado
  useEffect(() => {
    if (profile?.id) {
      fetchExperiences(profile.id);
    }
  }, [profile?.id, fetchExperiences]);

  return (
    <div className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5 group transition-all relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--delos-black)] group-hover:bg-[var(--delos-indigo)] group-hover:text-white transition-all border border-black/5 dark:border-white/10">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
        </div>

        <button 
          onClick={onAddEntry}
          className="flex items-center gap-2 px-3 py-1.5 border border-black/10 dark:border-white/10 hover:border-[var(--delos-amber)] hover:text-[var(--delos-amber)] transition-all group/btn"
        >
          <Terminal size={16} className="opacity-40" />
          <span className="text-[12px] font-mono font-black uppercase tracking-widest text-delos-texto">Editar Histórico</span>
        </button>
      </div>

      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 italic">
        Work_History
      </h3>

      {/* Lista de Experiências vinda do Store */}
      <div className="space-y-6">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-indigo-500/20 hover:before:bg-indigo-500 transition-colors"
            >
              <p className="font-black text-xs uppercase tracking-tight text-delos-texto">
                {exp.cargo}
              </p>
              <p className="text-[10px] opacity-40 font-mono uppercase mt-1">
                {exp.empresa} <span className="text-[var(--delos-amber)] opacity-60 ml-2">// {exp.data_entrada?.split('-')[0]}</span>
              </p>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-[10px] font-mono opacity-30 italic">
              No records found in DNA_Career.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default WorkExperience;