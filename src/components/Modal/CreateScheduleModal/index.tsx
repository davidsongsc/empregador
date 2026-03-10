"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, Clock, MapPin, Loader2, ChevronDown } from "lucide-react";
import { eventService } from "@/services/eventService";
import { toast } from "@/components/Notification";
import { useEventStore } from "@/store/useEventStore";
import { EventSchedule } from "@/interfaces/events"; // Ajuste o caminho conforme seu projeto
interface CreateScheduleFormData {
  event: string;
  chamada: string;
  address: string;
  start_time: string;
  end_time: string;
  is_published: boolean;
}
interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventUid?: string; // Caso você já esteja dentro de um evento específico
}

export default function CreateScheduleModal({ isOpen, onClose, selectedEventUid }: CreateScheduleModalProps) {
  // Pegamos apenas o necessário da Store refatorada
  const events = useEventStore((s) => s.events);
  const fetchEvents = useEventStore((s) => s.fetchEvents);
  const loading = useEventStore((s) => s.loading);

  const hasFetchedOnce = useRef(false);

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<CreateScheduleFormData>({
    defaultValues: {
      event: selectedEventUid || "",
      chamada: "",
      address: "",
      start_time: "",
      end_time: "",
      is_published: false,
    }
  });

  useEffect(() => {
    if (isOpen && !selectedEventUid) {
      if (events.length === 0 && !hasFetchedOnce.current) {
        fetchEvents();
        hasFetchedOnce.current = true;
      }
    }
    if (!isOpen) hasFetchedOnce.current = false;
  }, [isOpen, events.length, selectedEventUid]);

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    try {
      // O service agora chama a rota /eventos/schedules/
      await eventService.createSchedule(data);

      toast.success("Escala programada com sucesso!");

      // Se tiver uma função de refresh na página pai, chame-a aqui
      // ou use fetchEvents() se quiser atualizar a lista global

      onClose();
      reset();
    } catch (err) {
      toast.error("Erro ao salvar escala. Verifique os campos.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-100">

        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-xl tracking-tight leading-none">Programar Data</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Nova Escala de Trabalho</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all active:scale-90">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

          {/* SELETO DE EVENTO (Apenas se não vier via props) */}
          {!selectedEventUid && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evento Relacionado</label>
              <div className="relative group">
                <select
                  {...register("event", { required: "Selecione um evento" })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none appearance-none font-bold text-slate-700"
                >
                  <option value="">Selecione o evento principal...</option>
                  {events.map((ev) => (
                    <option key={ev.uid} value={ev.uid}>{ev.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título da Escala / Chamada</label>
            <input
              {...register("chamada", { required: "Campo obrigatório" })}
              placeholder="Ex: Noite de Gala - Staff Bar"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
            />
          </div>

          {/* NOVO CAMPO: ENDEREÇO (Requisito do seu Serializer) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Local / Endereço</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("address")}
                placeholder="Ex: Arena Stadium, Portão 2"
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-medium text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Início</label>
              <input
                type="datetime-local"
                {...register("start_time", { required: true })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fim</label>
              <input
                type="datetime-local"
                {...register("end_time", { required: true })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-slate-900 rounded-[24px] shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-xl">
              <input
                type="checkbox"
                id="is_published"
                {...register("is_published")}
                className="w-5 h-5 accent-indigo-500 rounded-lg cursor-pointer"
              />
            </div>
            <label htmlFor="is_published" className="text-[11px] font-bold text-slate-300 cursor-pointer leading-tight uppercase tracking-wider">
              Publicar requisitos no portal de vagas imediatamente?
            </label>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Programação"}
          </button>
        </form>
      </div>
    </div>
  );
}