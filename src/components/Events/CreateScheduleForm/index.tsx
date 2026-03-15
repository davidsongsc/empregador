'use client';
import React, { useState, useEffect } from 'react';
import { useEventStore } from '@/store/useEventStore';
import { eventService } from '@/services/eventService';
import { toast } from '@/components/Notification';
import { Zap, Clock, MapPin, Terminal } from 'lucide-react';
import { Button } from '@/components/MiniComponents/Button';

interface Props {
    eventUid: string;
    onSuccess?: () => void;
}

export const CreateScheduleForm = ({ eventUid, onSuccess }: Props) => {
    const { fetchScheduleDetails } = useEventStore(); // Para revalidar após criar
    const [loading, setLoading] = useState(false);
    console.log("eventUid", eventUid);
    const [formData, setFormData] = useState({
        event: eventUid,
        chamada: '',
        start_time: '',
        end_time: '',
        address: '', // UUID do endereço
    });

    // Predição DELOS: Ao definir início, sugere fim +8h (Padrão Staff)
    useEffect(() => {
        if (formData.start_time && !formData.end_time) {
            const start = new Date(formData.start_time);
            const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
            setFormData(prev => ({ ...prev, end_time: end.toISOString().slice(0, 16) }));
        }
    }, [formData.start_time]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // O PAYLOAD PRECISA DO CAMPO 'event' (UUID do Evento Pai)
            const payload = {
                event: eventUid, // <--- ESTA É A CHAVE QUE FALTA NO SEU JSON
                chamada: formData.chamada,
                start_time: formData.start_time,
                end_time: formData.end_time,
                address: formData.address || null
            };

            // Verifique se o seu service está recebendo este payload completo
            const response = await eventService.createSchedule(payload);

            if (response && response.uid) {
                toast.success("ESCALA_REGISTRADA_NO_MAINFRAME");
                onSuccess?.();
            }
        } catch (err) {
            toast.error("ERRO_AO_SINCRONIZAR_ESCALA");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-delos-surface border border-delos-border p-6 font-mono">
            <div className="flex items-center gap-2 mb-6 border-b border-delos-border pb-4">
                <Zap size={18} className="text-delos-amber" />
                <span className="text-xs font-bold text-delos-amber uppercase tracking-widest">New_Operational_Inline</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome da Chamada */}
                <div className="space-y-2">
                    <label className="text-[10px] text-delos-grey uppercase">Call_Sign (Chamada)</label>
                    <input
                        required
                        className="w-full bg-delos-black/40 border border-delos-border p-3 text-white text-sm focus:border-delos-amber outline-none transition-all placeholder:text-delos-grey/20"
                        placeholder="Ex: EQUIPE_BAR_SEXTA"
                        value={formData.chamada}
                        onChange={e => setFormData({ ...formData, chamada: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Início */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-delos-grey uppercase flex items-center gap-2">
                            <Clock size={12} /> Start_Time
                        </label>
                        <input
                            required
                            type="datetime-local"
                            className="w-full bg-delos-black/40 border border-delos-border p-2 text-xs text-delos-amber outline-none"
                            value={formData.start_time}
                            onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                        />
                    </div>

                    {/* Fim */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-delos-grey uppercase flex items-center gap-2">
                            <Clock size={12} /> End_Time
                        </label>
                        <input
                            required
                            type="datetime-local"
                            className="w-full bg-delos-black/40 border border-delos-border p-2 text-xs text-delos-amber outline-none"
                            value={formData.end_time}
                            onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                        />
                    </div>
                </div>

                {/* Localização (Address) */}
                <div className="space-y-2">
                    <label className="text-[10px] text-delos-grey uppercase flex items-center gap-2">
                        <MapPin size={12} /> Address_UID (Opcional)
                    </label>
                    <input
                        className="w-full bg-delos-black/40 border border-delos-border p-3 text-white/50 text-xs focus:border-delos-indigo outline-none transition-all"
                        placeholder="[UUID_ADDRESS_REFERENCE]"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full bg-delos-amber text-delos-black font-bold uppercase py-3 hover:bg-white transition-all shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                    >
                        EXECUTE_INLINE_SYNC
                    </Button>
                </div>
            </form>
        </div>
    );
};