'use client';
import React, { useState, useEffect } from 'react';
import { useEventStore } from '@/store/useEventStore';
import { Button } from '@/components/MiniComponents/Button';
import { X, Terminal, Zap, Layers, AlignLeft } from 'lucide-react';

export const CreateEventModal = ({ onClose }: { onClose: () => void }) => {
    const { createEventStructure, loading } = useEventStore();

    const [formData, setFormData] = useState({
        // Campos do Model Event
        name: '',
        description: '',
        // Campos do Model EventSchedule (O "Inline")
        chamada: '',
        start_time: '',
        end_time: '',
    });

    // Lógica de Predição de Jornada (+8h)
    useEffect(() => {
        if (formData.start_time) {
            const startDate = new Date(formData.start_time);
            const endDate = new Date(startDate.getTime() + 8 * 60 * 60 * 1000);
            const formatISO = (d: Date) => d.toISOString().slice(0, 16);
            setFormData(prev => ({ ...prev, end_time: formatISO(endDate) }));
        }
    }, [formData.start_time]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await createEventStructure(formData);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-delos-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-delos-surface border border-delos-border rounded-none shadow-[0_0_50px_-12px_rgba(251,191,36,0.1)] max-w-xl w-full overflow-hidden">
                
                <form onSubmit={handleSubmit}>
                    {/* HEADER: Terminal Style */}
                    <div className="p-4 bg-delos-black/40 border-b border-delos-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Terminal size={18} className="text-delos-amber" />
                            <span className="text-delos-amber text-xs font-bold tracking-widest uppercase">System.Initialize: Event_Root</span>
                        </div>
                        <button type="button" onClick={onClose} className="text-delos-grey hover:text-delos-red transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        
                        {/* SEÇÃO 01: EVENTO (MODEL BASE) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Layers size={14} className="text-delos-indigo" />
                                <span className="text-[10px] text-delos-grey uppercase tracking-widest font-bold">Event_Identity_Parameters</span>
                                <div className="h-[1px] flex-1 bg-delos-border/30" />
                            </div>
                            
                            <div className="space-y-4">
                                <input
                                    required
                                    className="w-full bg-delos-black/20 border border-delos-border p-3 text-delos-indigo placeholder:text-delos-grey/30 text-sm focus:border-delos-indigo outline-none transition-all"
                                    placeholder="[NAME: Identificador do Evento]"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                
                                <div className="relative">
                                    <AlignLeft size={14} className="absolute left-3 top-3 text-delos-grey/40" />
                                    <textarea
                                        rows={3}
                                        className="w-full bg-delos-black/20 border border-delos-border p-3 pl-10 text-white/70 placeholder:text-delos-grey/30 text-sm focus:border-delos-indigo outline-none transition-all resize-none"
                                        placeholder="[DESCRIPTION: Detalhes internos do evento...]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 02: ESCALA (MODEL INLINE) */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <Zap size={14} className="text-delos-amber" />
                                <span className="text-[10px] text-delos-grey uppercase tracking-widest font-bold">Initial_Schedule_Inline</span>
                                <div className="h-[1px] flex-1 bg-delos-border/30" />
                            </div>

                            <input
                                required
                                className="w-full bg-delos-black/20 border border-delos-border p-3 text-delos-amber/80 placeholder:text-delos-grey/30 text-sm focus:border-delos-amber outline-none transition-all"
                                placeholder="[CALL_SIGN: ex: Escala de Inauguração]"
                                value={formData.chamada}
                                onChange={(e) => setFormData({ ...formData, chamada: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] text-delos-grey uppercase">Timestamp_Start</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full bg-delos-black/20 border border-delos-border p-2 text-[11px] text-white/70 focus:text-delos-amber transition-all outline-none"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] text-delos-grey uppercase">Timestamp_End (+8h Auto)</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full bg-delos-black/20 border border-delos-border p-2 text-[11px] text-white/70 focus:text-delos-amber transition-all outline-none"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="p-6 bg-delos-black/20 border-t border-delos-border flex gap-4">
                        <Button 
                            type="button" 
                            className="flex-1 rounded-none border-delos-grey/30 text-delos-grey hover:bg-delos-red/10 hover:text-delos-red transition-all" 
                            variant="outline" 
                            onClick={onClose}
                        >
                            ABORT_BUILD
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1 rounded-none bg-delos-amber text-delos-black hover:bg-white transition-all font-bold tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.1)]" 
                            variant="primary" 
                            loading={loading}
                        >
                            EXECUTE_SYNC
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};