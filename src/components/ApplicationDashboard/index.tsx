import { Briefcase, Activity, ShieldCheck } from "lucide-react";
import ApplicationItem from "@/components/ApplicationItem";

const ApplicationDashboard = ({ applications, totalCount }: { applications: any[], totalCount: number }) => {
    return (
        <div 
            style={{ 
                backgroundColor: 'var(--delos-surface)', 
                color: 'var(--delos-black)',
                borderColor: 'var(--delos-border)' 
            }}
            className="p-8 md:p-12 rounded-sm border shadow-2xl transition-all duration-500 relative overflow-hidden"
        >
            {/* Elemento Decorativo: Grid de fundo sutil */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-10 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-[var(--delos-amber)] animate-pulse rounded-full" />
                        <span className="text-[10px] font-mono font-black tracking-[0.4em] opacity-40 uppercase">
                            Monitoring_System::v3.0
                        </span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                        Atividades_<span className="text-[var(--delos-grey)]">Recentes</span>
                    </h2>
                    <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.2em]">
                        Rastreamento de protocolos de recrutamento ativos
                    </p>
                </div>

                {/* Contador Estilo Display Digital */}
                <div className="flex items-center gap-6 border-l border-[var(--delos-border)] pl-8">
                    <div className="text-right">
                        <p className="text-[8px] font-mono font-black opacity-30 uppercase tracking-[0.3em] mb-1">Total_Records</p>
                        <span 
                            style={{ color: 'var(--delos-indigo)' }}
                            className="text-6xl font-black leading-none tracking-tighter"
                        >
                            {totalCount.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <Activity className="w-8 h-8 opacity-10 text-[var(--delos-indigo)]" />
                </div>
            </div>

            {/* Container da Lista */}
            <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between px-5 py-2 border-b border-[var(--delos-border)] mb-4 opacity-30">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Curriculos enviados</span>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Status_Operacional</span>
                </div>

                {applications.length > 0 ? (
                    <div className="grid gap-3">
                        {applications.map((cand) => (
                            <ApplicationItem key={cand.id} cand={cand} />
                        ))}
                    </div>
                ) : (
                    <div 
                        style={{ 
                            backgroundColor: 'rgba(var(--delos-grey), 0.02)',
                            borderColor: 'var(--delos-border)' 
                        }}
                        className="text-center py-24 rounded-sm border transition-colors flex flex-col items-center justify-center"
                    >
                        <ShieldCheck 
                            className="w-16 h-16 mb-6 opacity-10" 
                            style={{ color: 'var(--delos-amber)' }}
                        />
                        <p className="opacity-40 font-mono text-[9px] uppercase tracking-[0.5em] mb-6">
                            Nenhum protocolo ativo detectado no perímetro
                        </p>
                        <button 
                            style={{ 
                                borderColor: 'var(--delos-amber)',
                                color: 'var(--delos-amber)'
                            }}
                            className="px-8 py-3 border text-[10px] font-black hover:bg-[var(--delos-amber)] hover:text-white transition-all uppercase tracking-[0.3em]"
                        >
                            Inicializar Busca
                        </button>
                    </div>
                )}
            </div>

            {/* Rodapé do Bloco */}
            <div className="mt-12 pt-6 border-t border-[var(--delos-border)] flex justify-between items-center opacity-20 relative z-10">
                <span className="text-[7px] font-mono uppercase tracking-[0.4em]">Auth::Verified_Access</span>
                <div className="flex gap-2">
                    <div className="w-1 h-1 bg-[var(--delos-grey)] rounded-full" />
                    <div className="w-1 h-1 bg-[var(--delos-grey)] rounded-full" />
                    <div className="w-1 h-1 bg-[var(--delos-grey)] rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default ApplicationDashboard;