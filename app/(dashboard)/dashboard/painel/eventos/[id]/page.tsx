"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import {
    Users, Save, Plus, Trash2,
    Clock, AlertTriangle, Loader2, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/Notification";
import { useEventStore } from "@/store/useEventStore";

export default function ScheduleAdminPage() {
    const params = useParams();
    
    // IMPORTANTE: Se a pasta for [uid], use params.uid. 
    // No seu JSON, o ID da escala é: 019cb917-ca4b-7c36-adb9-74295ec5e7ee
    const scheduleUid = params?.uid as string; 
    
    const { activeEvent, fetchEventDetails, loading } = useEventStore();
    const [hasLoaded, setHasLoaded] = useState(false);

    const { register, control, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            chamada: "",
            is_published: false,
            address: "",
            requirements: [] as any[]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "requirements"
    });

    // 1. GATILHO: Busca o evento. 
    // Nota: Como o Django filtra por proprietário, o fetchEventDetails(uid) 
    // deve ser chamado com o UID do EVENTO ou da ESCALA dependendo da sua rota.
    useEffect(() => {
        if (scheduleUid) {
            fetchEventDetails(scheduleUid).then(() => {
                setHasLoaded(true);
            });
        }
    }, [scheduleUid, fetchEventDetails]);

    // 2. SINCRONIZAÇÃO: Mapeia o JSON aninhado para o Form
    useEffect(() => {
        if (activeEvent && activeEvent.schedules) {
            // No seu JSON, o scheduleUid está dentro de activeEvent.schedules
            const schedule = activeEvent.schedules.find((s: any) => s.uid === scheduleUid);

            if (schedule) {
                reset({
                    chamada: schedule.chamada || "",
                    is_published: schedule.is_published || false,
                    address: schedule.address || "",
                    // Mapeia os requisitos vindos da API
                    requirements: schedule.requirements?.map((req: any) => ({
                        uid: req.uid,
                        role: req.role,
                        role_name: req.role_name,
                        quantity: req.quantity,
                        remuneration: req.remuneration
                    })) || []
                });
            }
        }
    }, [activeEvent, scheduleUid, reset]);

    const watchRequirements = watch("requirements") || [];

    // 3. CÁLCULOS: Reflete o total_cost: "2990.00" do seu JSON em tempo real
    const totals = useMemo(() => {
        const cost = watchRequirements.reduce((acc, curr) =>
            acc + (Number(curr.quantity || 0) * Number(curr.remuneration || 0)), 0);
        const staff = watchRequirements.reduce((acc, curr) =>
            acc + Number(curr.quantity || 0), 0);
        return { cost, staff };
    }, [watchRequirements]);

    if (loading && !hasLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest text-center">
                    Sincronizando com Django...<br/>
                    <span className="text-slate-400 text-[8px] font-bold">Verificando: {scheduleUid}</span>
                </p>
            </div>
        );
    }

    const onSubmit = async (data: any) => {
        try {
            // O Django espera que os requisitos sejam enviados com o UID se já existirem
            console.log("Payload para Django:", data);
            toast.success("Alterações prontas para sincronizar!");
        } catch (err) {
            toast.error("Erro ao processar formulário.");
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* BREADCRUMB */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Link href="/painel/eventos" className="hover:text-indigo-600 transition-colors">Eventos</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 font-black uppercase">{activeEvent?.name || "Evento"}</span>
            </nav>

            {/* HEADER COM DADOS DO JSON */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">
                        {watch("chamada") || "Escala sem nome"}
                    </h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">
                        Empresa: {activeEvent?.owner_company_name || "---"}
                    </p>
                </div>

                <div className="flex gap-8">
                    <div className="text-right border-r pr-8 border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Custo da Escala</p>
                        <p className="text-2xl font-black text-emerald-600">
                            R$ {totals.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff Necessário</p>
                        <p className="text-2xl font-black text-slate-900">{totals.staff} <span className="text-xs text-slate-400 uppercase font-bold">Pessoas</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-600" />
                                <h2 className="font-black text-slate-900 uppercase text-xs tracking-widest">Requisitos (Inlines)</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ role_name: "Novo Cargo", quantity: 1, remuneration: 0 })}
                                className="flex items-center gap-2 text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/30 border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Qtd</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cache (R$)</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-right tracking-widest">Total</th>
                                        <th className="p-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6">
                                                <input
                                                    {...register(`requirements.${index}.role_name`)}
                                                    className="w-full bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-indigo-500 text-slate-700"
                                                />
                                            </td>
                                            <td className="p-6 text-center">
                                                <input
                                                    type="number"
                                                    {...register(`requirements.${index}.quantity`)}
                                                    className="w-14 text-center bg-slate-100 rounded-lg py-1 font-black text-slate-900"
                                                />
                                            </td>
                                            <td className="p-6">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`requirements.${index}.remuneration`)}
                                                    className="w-24 bg-transparent font-bold outline-none border-b border-transparent focus:border-indigo-500 text-slate-700"
                                                />
                                            </td>
                                            <td className="p-6 text-right font-black text-slate-900 text-sm">
                                                R$ {(watchRequirements[index]?.quantity * watchRequirements[index]?.remuneration || 0).toFixed(2)}
                                            </td>
                                            <td className="p-6">
                                                <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR OPERACIONAL */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl shadow-slate-200">
                        <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Publicação</h3>
                        </div>
                        
                        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                           <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" {...register("is_published")} className="w-5 h-5 accent-indigo-500 rounded-lg" />
                              <span className="text-xs font-bold text-slate-300">Publicar Vagas</span>
                           </label>
                        </div>

                        <button 
                           type="submit" 
                           disabled={isSubmitting}
                           className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar Escala</>}
                        </button>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                            Atenção: A publicação gera vagas automáticas no portal para 27 pessoas.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}