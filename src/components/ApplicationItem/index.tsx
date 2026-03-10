import { STATUS_CONFIG } from '@/data/statusLabels';
import { Briefcase, Clock, ChevronRight, Zap } from 'lucide-react';

const ApplicationItem = ({ cand }: { cand: any }) => {
    const config = STATUS_CONFIG[cand.status] || { 
        label: 'PENDENTE', 
        color: 'text-slate-500 border-slate-500/20',
        glow: 'bg-slate-500/40' 
    };

    return (
        <div 
            style={{ 
                backgroundColor: 'rgba(var(--delos-grey), 0.05)',
                borderColor: 'var(--delos-border)' 
            }}
            className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 border transition-all duration-500 hover:bg-[var(--delos-surface)]"
        >
            {/* Indicador de Status Lateral (Aceleração de Host) */}
            <div 
                className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 opacity-20 group-hover:opacity-100 ${config.bg}`} 
            />

            <div className="flex items-center gap-6 z-10">
                {/* Avatar/Icon com visual de Scanner */}
                <div 
                    style={{ borderColor: 'var(--delos-border)' }}
                    className="w-14 h-14 bg-black/5 dark:bg-white/5 border flex items-center justify-center text-[var(--delos-amber)] transition-all duration-500 group-hover:border-[var(--delos-amber)]/40"
                >
                    <Briefcase size={20} strokeWidth={1.5} />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--delos-amber)' }} className="text-[8px] font-mono font-bold tracking-[0.2em] opacity-60">
                            HOST_UNIT::{cand.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Zap size={8} style={{ color: 'var(--delos-amber)' }} className="animate-pulse" />
                    </div>
                    
                    <h4 style={{ color: 'var(--delos-black)' }} className="font-black text-sm uppercase tracking-widest leading-none italic">
                        {cand.cargo}
                    </h4>
                    
                    <div className="flex items-center gap-3">
                        <p style={{ color: 'var(--delos-indigo)' }} className="text-[10px] font-black uppercase tracking-tighter">
                            {cand.empresa_nome}
                        </p>
                        <div className="flex items-center gap-1 text-[9px] font-mono opacity-40" style={{ color: 'var(--delos-black)' }}>
                            <Clock size={10} /> {cand.data_aplicacao}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 relative z-10">
                {/* Status Wrapper */}
                <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[7px] font-mono opacity-30 uppercase tracking-[0.3em]" style={{ color: 'var(--delos-black)' }}>
                        System_Response
                    </span>
                    <span 
                        className={`text-[9px] font-black uppercase px-4 py-1.5 border tracking-[0.2em] transition-all ${config.color} bg-transparent`}
                    >
                        {cand.status_display || config.label}
                    </span>
                </div>

                {/* Botão de Ação Minimalista */}
                <button 
                    style={{ 
                        borderColor: 'var(--delos-border)',
                        color: 'var(--delos-black)' 
                    }}
                    className="w-10 h-10 flex items-center justify-center border hover:bg-[var(--delos-black)] hover:text-[var(--delos-surface)] transition-all duration-300 group-hover:rotate-90"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ApplicationItem;