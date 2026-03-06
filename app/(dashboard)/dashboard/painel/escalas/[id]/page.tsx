"use client";

import { useEffect, useMemo, useState } from "react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useParams } from "next/navigation";
import RoleAutocomplete from "@/components/AutoComplete/Role";
import {
    Users, Save, Plus, Trash2,
    Clock, AlertTriangle, Loader2, ChevronRight,
    DollarSign,
    Hash
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/Notification";
import { useEventStore } from "@/store/useEventStore";
import { useScheduleStore } from "@/store/useScheduleStore";

interface StaffRequirement {
    uid?: string;
    role: string;      // UID do Cargo
    role_name: string; // Nome de exibição
    quantity: number;
    remuneration: number;
}

interface ScheduleFormData {
    chamada: string;
    is_published: boolean;
    address: string | null;
    requirements: StaffRequirement[];
}
export default function ScheduleAdminPage() {
    const params = useParams();

    const scheduleUid = params?.id as string;

    const {
        activeSchedule,
        fetchScheduleDetails,
        updateSchedule,
        loading,
        clearActiveSchedule
    } = useScheduleStore();

    const [hasLoaded, setHasLoaded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { register, control, handleSubmit, watch, reset, setValue, formState: { isSubmitting } } = useForm<ScheduleFormData>({
        defaultValues: {
            chamada: "",
            is_published: false,
            address: "",
            requirements: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "requirements"
    });

    // Garantia de montagem no cliente
    useEffect(() => {
        setIsMounted(true);
        return () => clearActiveSchedule();
    }, [clearActiveSchedule]);

    // Carregamento de dados
    useEffect(() => {
        if (isMounted && scheduleUid) {
            fetchScheduleDetails(scheduleUid).then(() => {
                setHasLoaded(true);
            });
        }
    }, [isMounted, scheduleUid, fetchScheduleDetails]);

    // Sincronização da Store com o Formulário
    useEffect(() => {
        if (activeSchedule && activeSchedule.uid === scheduleUid) {
            reset({
                chamada: activeSchedule.chamada || "",
                is_published: activeSchedule.is_published || false,
                address: activeSchedule.address || "",
                requirements: activeSchedule.requirements?.map((req: any) => ({
                    uid: req.uid,
                    role: req.role,
                    role_name: req.role_name,
                    quantity: req.quantity,
                    remuneration: parseFloat(req.remuneration) || 0
                })) || []
            });
        }
    }, [activeSchedule, scheduleUid, reset]);

    const watchRequirements = watch("requirements") || [];

    // Cálculos dinâmicos
    const totals = useMemo(() => {
        const cost = watchRequirements.reduce((acc, curr) =>
            acc + (Number(curr.quantity || 0) * Number(curr.remuneration || 0)), 0);
        const staff = watchRequirements.reduce((acc, curr) =>
            acc + Number(curr.quantity || 0), 0);
        return { cost, staff };
    }, [watchRequirements]);

    const onSubmit = async (data: ScheduleFormData) => {
        try {
            const success = await updateSchedule(scheduleUid, data);
            if (success) {
                toast.success("Escala guardada com sucesso!");
            }
        } catch (err) {
            toast.error("Ocorreu um erro ao guardar as alterações.");
        }
    };

    if (!isMounted) return null;

    if (loading && !hasLoaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest text-center">
                    Sincronizando com o servidor...<br />
                    <span className="text-slate-400 text-[8px] font-bold">ID: {scheduleUid}</span>
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link href="/painel/eventos" className="hover:text-indigo-600 transition-colors">Eventos</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-900 font-black uppercase">Gestão de Escala</span>
                </nav>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            {watch("chamada") || "Escala sem nome"}
                        </h1>
                        <p className="text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-widest">
                            Ref: {activeSchedule?.uid?.substring(0, 8)}...
                        </p>
                    </div>

                    <div className="flex gap-8">
                        <div className="text-right border-r pr-8 border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                                <DollarSign className="w-3 h-3" /> Investimento Total
                            </p>
                            <p className="text-3xl font-black text-emerald-600">
                                R$ {totals.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                                <Users className="w-3 h-3" /> Staff Previsto
                            </p>
                            <p className="text-3xl font-black text-slate-900">
                                {totals.staff} <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter ml-1">vagas</span>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 rounded-xl">
                                        <Hash className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Configuração de Staff</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => append({ role: "", role_name: "", quantity: 1, remuneration: 0 })}
                                    className="flex items-center gap-2 text-[10px] font-black bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
                                >
                                    <Plus className="w-4 h-4" /> ADICIONAR CARGO
                                </button>
                            </div>

                            <div className="overflow-x-auto min-h-[350px]">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/30 border-b border-slate-100">
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Função</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Qtd</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cache (R$)</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase text-right tracking-widest">Subtotal</th>
                                            <th className="p-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {fields.map((field, index) => (
                                            <tr key={field.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="p-6 min-w-[300px]">
                                                    <Controller
                                                        name={`requirements.${index}.role_name`}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <RoleAutocomplete
                                                                value={value}
                                                                onChange={onChange}
                                                                onRoleSelect={(uid: string) => setValue(`requirements.${index}.role`, uid)}
                                                            />
                                                        )}
                                                    />
                                                </td>
                                                <td className="p-6 text-center">
                                                    <input
                                                        type="number"
                                                        {...register(`requirements.${index}.quantity`, { valueAsNumber: true })}
                                                        className="w-16 text-center bg-slate-100 rounded-xl py-2 font-black text-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </td>
                                                <td className="p-6">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`requirements.${index}.remuneration`, { valueAsNumber: true })}
                                                        className="w-28 bg-transparent font-bold outline-none border-b border-transparent focus:border-indigo-500 text-slate-700"
                                                    />
                                                </td>
                                                <td className="p-6 text-right font-black text-slate-900 text-sm italic">
                                                    R$ {((watchRequirements[index]?.quantity || 0) * (watchRequirements[index]?.remuneration || 0)).toFixed(2)}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    >
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

                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl ring-1 ring-slate-800">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                                <Clock className="w-5 h-5 text-indigo-400" />
                                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Publicação</h3>
                            </div>

                            <div className="space-y-4">
                                <div className={`p-5 rounded-2xl border transition-all ${watch('is_published') ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            {...register("is_published")}
                                            className="w-5 h-5 accent-indigo-500 rounded-lg cursor-pointer"
                                        />
                                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${watch('is_published') ? 'text-white' : 'text-slate-400'}`}>
                                            {watch('is_published') ? 'Vagas Ativas' : 'Rascunho Interno'}
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Escala</>}
                                </button>
                            </div>

                            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-center italic">
                                A sincronização atualizará as vagas no portal conforme as necessidades definidas acima.
                            </p>
                        </div>

                        <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex gap-4 shadow-sm">
                            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                                Atenção: Esta escala requer {totals.staff} profissionais e um investimento de R$ {totals.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}