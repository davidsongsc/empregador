"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Building2, Layers, Users, ShieldCheck,
    Trash2, Plus, RefreshCw, Lock, X,
    Activity, Info, Settings2, Save,
    UserPlus
} from "lucide-react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { useAuthStore } from "@/store/useAuthStore";
import { companyService, Department } from "@/services/companies-service";
import { debounce } from "lodash";
import DepartmentCard from "@/components/MiniComponents/DepartmentCard";
import CreateDepartmentModal from "@/components/Modal/CreateDepartmentModal";
import TabButton from "@/components/MiniComponents/TabButton";
import InputGroup from "@/components/MiniComponents/InputGroup";
interface CreateDepartmentPayload {
    name: string;
    description: string;
    company: string; // UUID da empresa
}

interface CreateDepartmentModalProps {
    companyId: string | null;
    onClose: () => void;
    onConfirm: (data: CreateDepartmentPayload) => void;
}

export default function CompanyAdminPage() {
    const activeCompanyId = useAuthStore((state) => state.activeCompanyId);
    const { activeCompany, fetchCompanyDetails, updateCompanyStatus } = useCompanyStore();
    const { departments, fetchDepartments, addDepartment, updateDepartment, removeDepartment, loading } = useDepartmentStore();
    console.log("Departments:", departments);
    console.log("Departments:", departments.length);

    const [tab, setTab] = useState<"core" | "structure">("core");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (activeCompanyId) {
            fetchCompanyDetails(activeCompanyId);
            fetchDepartments();
        }
    }, [activeCompanyId, fetchCompanyDetails, fetchDepartments]);
    
    const isLocked = activeCompany?.is_active ?? false;

    const debouncedCompanyUpdate = useMemo(() =>
        debounce((id: string, data: any) => companyService.updateCompany(id, data), 1000),
        []);

    return (
        <div className="min-h-screen bg-[var(--delos-surface)] text-[var(--delos-black)] p-4 md:p-10 font-mono">
            {/* HEADER */}
            <header className="mb-12 border-b border-[var(--delos-border)] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-[var(--delos-grey)] uppercase tracking-[0.4em]">
                        <Building2 size={12} /> Unit_Administration // {activeCompany?.id?.slice(0, 8)}
                    </div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        {activeCompany?.name ?? "LOADING_UNIT..."}
                    </h1>
                </div>

                <div className="flex bg-[var(--delos-border)] p-1">
                    <TabButton active={tab === "core"} onClick={() => setTab("core")} label="Core_Info" />
                    <TabButton active={tab === "structure"} onClick={() => setTab("structure")} label="Structure" />
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* SIDEBAR */}
                <aside className="lg:col-span-3 space-y-6">
                    <div className={`p-6 border border-[var(--delos-border)] space-y-4 transition-all ${isLocked ? 'bg-[var(--delos-amber)]/5 border-[var(--delos-amber)]/20' : 'bg-[var(--delos-red)]/5 border-[var(--delos-red)]/20'}`}>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--delos-grey)]">
                            <span>Status</span>
                            {isLocked ? <ShieldCheck size={14} className="text-[var(--delos-amber)]" /> : <Lock size={14} className="text-[var(--delos-red)]" />}
                        </div>
                        <div className="text-2xl font-black italic uppercase">{isLocked ? "Operational" : "Offline"}</div>
                        <button
                            onClick={() => updateCompanyStatus(activeCompany?.id, !isLocked)}
                            className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isLocked ? 'bg-[var(--delos-red)] text-white' : 'bg-[var(--delos-amber)] text-white'}`}
                        >
                            {isLocked ? "Deactivate_Unit" : "Activate_Unit"}
                        </button>
                    </div>

                    <div className="p-6 border border-[var(--delos-border)] space-y-2">
                        <span className="text-[8px] font-black uppercase text-[var(--delos-grey)]">Metrics</span>
                        <div className="flex justify-between text-[10px] font-bold uppercase italic">
                            <span>Membros:</span> <span>{activeCompany?.members_count ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase italic">
                            <span>Setores:</span> <span>{departments.length}</span>
                        </div>
                    </div>
                </aside>

                {/* CONTENT */}
                <section className="lg:col-span-9">
                    {tab === "core" ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <InputGroup
                                label="Legal_Name"
                                defaultValue={activeCompany?.name}
                                disabled={isLocked}
                                onChange={(val: string) => debouncedCompanyUpdate(activeCompany.id, { name: val })}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <Layers size={14} className="text-[var(--delos-amber)]" /> Setores_Operacionais
                                </h3>
                                {!isLocked && (
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase bg-[var(--delos-black)] text-[var(--delos-surface)] px-4 py-2 hover:bg-[var(--delos-amber)] transition-colors"
                                    >
                                        <Plus size={14} /> New_Sector
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {loading ? (

                                    [1, 2].map((i) => (
                                        <div key={i} className="h-32 bg-[var(--delos-border)]/20 border border-[var(--delos-border)] animate-pulse relative">
                                            <div className="absolute left-0 top-0 h-full w-[2px] bg-[var(--delos-grey)]/20" />
                                        </div>
                                    ))
                                ) : departments.length > 0 ? (
                                    departments.map((dept) => (
                                        <DepartmentCard
                                            key={dept.id}
                                            dept={dept}
                                            isLocked={!isLocked}
                                            onUpdate={updateDepartment}
                                            onDelete={removeDepartment}
                                        />
                                    ))
                                ) : (
                                    // EMPTY STATE
                                    <div className="py-20 border border-dashed border-[var(--delos-border)] flex flex-col items-center justify-center opacity-30 gap-4">
                                        <Layers size={32} className="text-[var(--delos-grey)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                            No_Sector_Nodes_Found
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {/* MODAL PARA CRIAR SETOR */}
            {showAddModal && (
                <CreateDepartmentModal
                    companyId={activeCompanyId}
                    onClose={() => setShowAddModal(false)}
                    onConfirm={(data: CreateDepartmentPayload) => {
                        addDepartment(data);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}




