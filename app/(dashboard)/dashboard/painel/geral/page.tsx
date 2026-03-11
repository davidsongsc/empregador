"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useDepartmentStore } from "@/store/useDepartmentStore"; // Hook de setores
import {
    Save, ArrowLeft, Terminal, Cpu, Activity,
    ShieldCheck, Globe, Users, UserPlus, Star, Trash2
} from "lucide-react";
import Link from "next/link";
import { getActiveMembership } from "@/utils/userHelpers";
import { toast } from "@/components/Notification";

export default function EditCompanyPage() {
    const companyId = getActiveMembership()?.id;
    const { activeCompany, fetchCompanyDetails, saveCompany, loading } = useCompanyStore();
    const { departments, fetchDepartments, updateDepartment } = useDepartmentStore();

    const [selectedDeptId, setSelectedDeptId] = useState<string>("");

    const { register, handleSubmit, reset } = useForm({
        defaultValues: { name: "", is_active: true }
    });

    useEffect(() => {
        if (companyId) {
            fetchCompanyDetails(companyId);
            fetchDepartments(); // Sincroniza os nós de estrutura
        }
    }, [companyId, fetchCompanyDetails, fetchDepartments]);

    useEffect(() => {
        if (activeCompany) {
            reset({ name: activeCompany.name, is_active: activeCompany.is_active });
        }
    }, [activeCompany, reset]);

    const onSaveMainframe = async (data: any) => {
        try {
            await saveCompany(companyId as string, data);
            toast.success("Parâmetros_Sincronizados");
        } catch (e) {
            toast.error("Falha_na_Gravação");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">

            {/* GRID DECORATIVO DLS */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
                backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* HEADER E NAVEGAÇÃO OMITIDOS PARA BREVIDADE (MANTÉM IGUAL AO ANTERIOR) */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* COLUNA ESQUERDA: PARÂMETROS CORE */}
                <div className="lg:col-span-5 space-y-8">
                    <form onSubmit={handleSubmit(onSaveMainframe)} className="space-y-8">
                        <section className="bg-delos-black/[0.02] border border-delos-grey/10 p-8 space-y-8 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-delos-grey/10 pb-4">
                                <Terminal size={14} className="text-delos-amber" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Identity_Parameters</h2>
                            </div>
                            <input {...register("name")} className="w-full bg-delos-surface border border-delos-grey/20 p-4 text-sm font-black uppercase tracking-widest outline-none focus:border-delos-amber" />
                            <button type="submit" className="w-full bg-delos-black text-delos-surface py-4 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-delos-amber transition-all">
                                Update_Identity
                            </button>
                        </section>
                    </form>

                    <div className="p-8 bg-delos-black text-delos-surface border border-white/5 space-y-4 shadow-2xl">
                        <div className="flex items-center gap-2 text-delos-amber">
                            <ShieldCheck size={18} />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Unit_Security_Vault</h3>
                        </div>
                        <p className="text-[8px] opacity-40 uppercase tracking-widest leading-relaxed">
                            As atribuições de membros geram logs persistentes. Certifique-se de que o Host possui as credenciais necessárias.
                        </p>
                    </div>
                </div>

                {/* COLUNA DIREITA: GESTÃO DE STAFF POR SETOR */}
                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-delos-black text-delos-surface p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Users size={120} />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                                <UserPlus size={20} className="text-delos-amber" />
                                <h2 className="text-xl font-black italic uppercase tracking-tighter">Atribuição_de_<span className="text-delos-amber">Hosts</span></h2>
                            </div>

                            {/* SELETOR DE NÓ (SETOR) */}
                            <div className="space-y-2">
                                <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Selecionar_Nó_de_Estrutura</label>
                                <select
                                    onChange={(e) => setSelectedDeptId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-delos-amber text-delos-surface"
                                >
                                    <option value="" className="bg-delos-black">-- SELECIONAR_SETOR --</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id} className="bg-delos-black">{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedDeptId && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    {/* BOX LIDERANÇA */}
                                    <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-delos-amber">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Leaders_Quota</span>
                                        </div>
                                        <button className="w-full py-3 border border-dashed border-white/20 text-[9px] font-black uppercase tracking-widest hover:bg-delos-amber hover:text-delos-black transition-all">
                                            Assign_Leader
                                        </button>
                                        {/* Lista de líderes do setor selecionado apareceria aqui */}
                                    </div>

                                    {/* BOX OPERACIONAIS */}
                                    <div className="bg-white/5 border border-white/10 p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <Users size={12} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Operational_Staff</span>
                                        </div>
                                        <button className="w-full py-3 border border-dashed border-white/20 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-delos-black transition-all">
                                            Sync_Member
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* LISTA RÁPIDA DE STAFF ATUAL (OPCIONAL) */}
                    <div className="border border-delos-grey/10 p-6 bg-delos-black/[0.01]">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            <Activity size={12} className="text-delos-amber" />
                            Active_Roster_Preview
                        </h3>
                        <div className="space-y-2">
                            {/* Mapeamento de membros atuais da unidade */}
                            <div className="flex items-center justify-between p-3 bg-delos-surface border border-delos-grey/5 group hover:border-delos-black transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-delos-black text-delos-surface flex items-center justify-center text-[10px] font-black italic">H</div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tighter">Host_Identifier_Name</p>
                                        <p className="text-[7px] text-delos-grey uppercase tracking-widest">Lvl_03 // Operational</p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-delos-red hover:bg-delos-red/10 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <footer className="pt-10 border-t border-delos-grey/10 flex justify-between items-center opacity-30">
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">Delos_White_Management // Console_v.1</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">Network: Optimal</span>
                </div>
            </footer>
        </div>
    );
}