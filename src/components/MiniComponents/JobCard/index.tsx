import React, { memo } from 'react';
import { Target, ChevronRight, Building2, Lock, MapPin } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface JobCardProps {
  type: 'category' | 'job';
  data: any;
  onAction: (item: any) => void;
  index?: number;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      // Fazemos o cast 'as any' ou garantimos a assinatura do cubic-bezier
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: {
    scale: 0.98
  }
};

const JobCard = memo(({ type, data, onAction, index = 0 }: JobCardProps) => {

  // --- MODO CATEGORIA (Clusters de Vagas) ---
  if (type === 'category') {
    const count = data.total_jobs ?? 0;

    return (
      <motion.div
        custom={index}
        initial="hidden" animate="visible" whileHover="hover" whileTap="tap"
        variants={cardVariants}
        onClick={() => onAction(data)}
        className="group bg-delos-surface p-3 rounded-[14px] border border-delos-border hover:border-delos-amber/50 transition-all cursor-pointer flex flex-col justify-between min-h-[250px] relative overflow-hidden shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-delos-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex justify-between items-start relative z-10">
          <div className="p-2 bg-white border border-delos-border rounded-lg group-hover:bg-delos-black group-hover:text-white transition-colors">
            <Target className="w-5 h-5" />
          </div>
          <motion.div className="bg-delos-black text-delos-surface px-4 py-1 rounded text-[18px] font-black italic tracking-tighter group-hover:bg-delos-amber transition-colors">
            {count} {count === 1 ? 'VAGA' : 'VAGAS'}
          </motion.div>
        </div>

        <div className="mt-4 relative z-10">
          <span className="text-[8px] font-bold text-delos-grey uppercase tracking-widest opacity-60 block">Explorar segmento</span>
          <h3 className="text-xl md:text-2xl font-black text-delos-black uppercase italic leading-tight group-hover:text-delos-amber line-clamp-2">
            {data.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-delos-border mt-4 relative z-10">
          <span className="text-[8px] font-black text-delos-grey uppercase italic">Acessar_Dados</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-delos-black group-hover:text-delos-amber" />
        </div>
      </motion.div>
    );
  }

  // --- MODO INDIVIDUAL (Job/Vaga) ---
  const job = data;

  return (
    <motion.div
      custom={index}
      initial="hidden" animate="visible" whileHover="hover" whileTap="tap"
      variants={cardVariants}
      className="bg-white p-5 rounded-[24px] border border-delos-border hover:border-delos-amber transition-all shadow-sm flex flex-col justify-between min-h-[280px] group relative"
    >
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest bg-delos-grey-light px-2 py-0.5 rounded text-delos-grey">
            {job.tipo_vaga}
          </span>
          {Number(job.salario) > 0 && (
            <span className="text-[12px] font-black bg-delos-success/10 text-delos-success px-2 py-0.5 rounded italic">
              R$ {Number(job.salario).toLocaleString('pt-BR')}
            </span>
          )}
        </div>

        <h3 className="font-black text-lg md:text-xl text-delos-black uppercase italic tracking-tighter leading-tight group-hover:text-delos-amber transition-colors mb-4 line-clamp-2">
          {job.cargo_nome || job.cargo_fallback}
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            {job.empresa_nome ? (
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-delos-subtext">
                <Building2 className="w-3.5 h-3.5 text-delos-amber" />
                <span className="truncate">{job.empresa_nome}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-delos-red bg-delos-red/5 px-2 py-0.5 rounded text-[8px] font-black uppercase italic">
                <Lock className="w-3 h-3" /> Acesso_Restrito
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-delos-grey uppercase tracking-tight italic">
            <MapPin className="w-3.5 h-3.5" />
            {job.local_amigavel}
          </div>
        </div>
      </div>

      <motion.button
        onClick={() => onAction(job)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full py-4 bg-delos-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-delos-amber transition-all flex items-center justify-center gap-2 group/btn"
      >
        Candidatar-se
        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}, (prev, next) => {
  // Comparação otimizada: evita re-render se o ID e o título não mudarem
  return (
    prev.type === next.type &&
    prev.data.id === next.data.id &&
    prev.data.cargo_exibicao === next.data.cargo_exibicao &&
    prev.data.total_jobs === next.data.total_jobs
  );
});

JobCard.displayName = 'JobCard';
export default JobCard;