'use client';
import { useEffect } from 'react';
import { useEventStore } from '@/store/useEventStore';
import { Calendar, Globe, DollarSign, Users, Loader2, Briefcase, ChevronRight } from 'lucide-react';

export const ScheduleCard = ({ scheduleUid }: { scheduleUid: string }) => {
    const { fetchScheduleDetails, schedulesCache, publishVagas } = useEventStore();
    const schedule = schedulesCache[scheduleUid];

    useEffect(() => {
        if (!schedule || !schedule.chamada) {
            // No FreelaCerto, garantimos o carregamento profundo
            fetchScheduleDetails(scheduleUid);
        }
    }, [scheduleUid, schedule, fetchScheduleDetails]);

    if (!schedule) {
        return (
            <div className="bg-delos-surface border border-delos-border p-5 flex items-center justify-center h-32">
                <Loader2 className="animate-spin text-delos-amber opacity-20" size={24} />
            </div>
        );
    }

    return (
        <div className="bg-delos-surface border border-delos-border p-5 hover:border-delos-amber/50 transition-all group font-mono">
            {/* HEADER: Ação e Status */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-delos-amber font-bold text-lg uppercase tracking-tighter">{schedule.chamada}</h3>
                    <span className="text-[10px] text-delos-grey block mt-1 tracking-widest">ID: {schedule.uid.slice(0, 8)}...</span>
                </div>

                <button
                    onClick={() => publishVagas(schedule.uid)}
                    className={`text-[10px] font-bold px-3 py-1 border flex items-center gap-2 transition-all ${
                        schedule.is_published
                            ? 'border-delos-indigo text-delos-indigo bg-delos-indigo/10'
                            : 'border-delos-grey text-delos-grey hover:border-delos-amber hover:text-delos-amber'
                    }`}
                >
                    <Globe size={12} />
                    {schedule.is_published ? 'SYNCED' : 'PUBLISH'}
                </button>
            </div>

            {/* TABULAR INLINE: REQUIREMENTS (Cargos e Custos) */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Briefcase size={14} className="text-delos-indigo" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Staff_Requirements</span>
                </div>

                <div className="border border-delos-border/30 bg-delos-black/20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-delos-border/30 bg-delos-black/40 text-[9px] text-delos-grey uppercase">
                                <th className="p-2 font-bold">Role</th>
                                <th className="p-2 font-bold text-center">Qty</th>
                                <th className="p-2 font-bold text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-delos-border/10">
                            {schedule.requirements?.map((req: any) => (
                                <tr key={req.uid} className="hover:bg-delos-indigo/5 transition-colors">
                                    <td className="p-2 text-[11px] text-white uppercase">
                                        {req.role_name}
                                    </td>
                                    <td className="p-2 text-[11px] text-white text-center font-mono">
                                        {req.quantity}
                                    </td>
                                    <td className="p-2 text-[11px] text-delos-amber text-right font-mono">
                                        R$ {Number(req.total_cost_calculated).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SEÇÃO DE ALOCAÇÕES: Caso existam (Assignments) */}
            {schedule.assignments && (
                <div className="mb-6 border-t border-delos-border/20 pt-4">
                    <div className="flex flex-wrap gap-2">
                        {schedule.assignments.map((ass: any) => (
                            <div key={ass.uid} className="flex items-center gap-2 bg-delos-black/60 border border-delos-border p-1 px-2">
                                <div className={`w-1 h-1 rounded-full ${ass.check_in ? 'bg-delos-indigo' : 'bg-delos-grey'}`} />
                                <span className="text-[9px] text-white/70 uppercase">{ass.profile_name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FOOTER: Métricas Consolidadas */}
            <div className="grid grid-cols-3 gap-4 border-t border-delos-border/50 pt-4 bg-delos-black/10 -mx-5 -mb-5 p-5">
                <div className="space-y-1">
                    <span className="text-[9px] block uppercase text-delos-grey">Total_Staff</span>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-delos-grey" />
                        <span className="text-sm font-bold text-white">{schedule.total_staff} PAX</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[9px] block uppercase text-delos-grey">Total_Budget</span>
                    <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-delos-grey" />
                        <span className="text-sm font-bold text-delos-amber">R$ {Number(schedule.total_cost).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-1 text-right">
                    <span className="text-[9px] block uppercase text-delos-grey text-right">Operation_Time</span>
                    <span className="text-[11px] font-bold text-white uppercase block">
                        {schedule.start_time.split('T')[1].slice(0, 5)}h
                    </span>
                </div>
            </div>
        </div>
    );
};