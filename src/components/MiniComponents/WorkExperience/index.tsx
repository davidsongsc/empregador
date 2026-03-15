import React from 'react';
import { Briefcase } from 'lucide-react';

interface Experience {
  id: string | number;
  cargo: string;
  empresa: string;
  data_entrada: string;
}

interface WorkExperienceProps {
  experiences?: Experience[];
  onAddEntry?: () => void;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ experiences, onAddEntry }) => {
  return (
    <div className="bg-white dark:bg-[#080808] p-8 rounded-sm border border-black/5 dark:border-white/5 group transition-all">
      {/* Header do Componente */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-10 h-10 bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--delos-black)] group-hover:bg-[var(--delos-indigo)] group-hover:text-white transition-all border border-black/5 dark:border-white/10">
          <Briefcase className="w-4 h-4" />
        </div>
        
        <button 
          onClick={onAddEntry}
          className="text-[8px] font-mono font-black text-[var(--delos-indigo)] uppercase tracking-[0.3em] hover:underline"
        >
          Add_Entry+
        </button>
      </div>

      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 italic">
        Work_History
      </h3>

      {/* Lista de Experiências */}
      <div className="space-y-6">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <div 
              key={exp.id} 
              className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-indigo-500/20 hover:before:bg-indigo-500 transition-colors"
            >
              <p className="font-black text-xs uppercase tracking-tight">
                {exp.cargo}
              </p>
              <p className="text-[10px] opacity-40 font-mono uppercase mt-1">
                {exp.empresa} // {exp.data_entrada?.split('-')[0]}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[10px] font-mono opacity-30 italic">
            No records found in database.
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkExperience;