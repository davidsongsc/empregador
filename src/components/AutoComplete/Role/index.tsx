"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Users, Save, Plus, Trash2,
    Clock, AlertTriangle, Loader2, ChevronRight,
    DollarSign, Hash, Search, Sparkles, X
} from "lucide-react";

// Importações reais do projeto
import { toast } from "@/components/Notification";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useRoles } from "@/hooks/useRoles";
import { createRole } from "@/services/roles";

// --- INTERFACES ---

interface Role {
    uid: string;
    name: string;
    category: string;
}



interface RoleAutocompleteProps {
    value: string;
    onChange: (val: string) => void;
    onRoleSelect: (uid: string) => void;
}

/**
 * RoleAutocomplete
 * Componente para seleção de cargos com pesquisa e criação dinâmica.
 */
const RoleAutocomplete: React.FC<RoleAutocompleteProps> = ({ value, onChange, onRoleSelect }) => {
    const [search, setSearch] = useState(value || "");
    const [isOpen, setIsOpen] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [category, setCategory] = useState("Geral");
    const [isCreating, setIsCreating] = useState(false);

    const { roles } = useRoles();

    const filtered = useMemo(() => {
        if (!search || search === value) return [];
        return roles.filter((r: Role) =>
            r.name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 5);
    }, [roles, search, value]);

    const handleSelect = (role: Role) => {
        setSearch(role.name);
        onChange(role.name);
        onRoleSelect(role.uid);
        setIsOpen(false);
    };

    const handleCreate = async () => {
        setIsCreating(true);
        try {
            const newRole = await createRole({ name: search, category });
            handleSelect(newRole);
            setShowCategory(false);
            toast.success("Novo cargo criado com sucesso!");
        } catch (err) {
            toast.error("Erro ao criar o cargo.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="relative w-full">
            <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-300'}`} />
                <input
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Procurar cargo..."
                    className="w-full bg-slate-50 border-none rounded-xl py-2 pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
            </div>

            {isOpen && search && search !== value && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                    {!showCategory ? (
                        <>
                            {filtered.map((r: Role) => (
                                <button
                                    key={r.uid}
                                    type="button"
                                    onClick={() => handleSelect(r)}
                                    className="w-full p-3 text-left hover:bg-indigo-50 flex flex-col transition-colors border-b border-slate-50 last:border-none"
                                >
                                    <span className="font-bold text-slate-700 text-xs">{r.name}</span>
                                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{r.category}</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setShowCategory(true)}
                                className="w-full p-3 text-left bg-indigo-600 text-white flex items-center justify-between hover:bg-gray-900 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Plus className="w-3 h-3" />
                                    <span className="font-bold text-[10px] uppercase">Criar "{search}"</span>
                                </div>
                                <Sparkles className="w-3 h-3 opacity-50" />
                            </button>
                        </>
                    ) : (
                        <div className="p-4 space-y-3 bg-slate-50">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Categoria do cargo</p>
                                <button type="button" onClick={() => setShowCategory(false)}><X className="w-3 h-3 text-slate-300" /></button>
                            </div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs font-bold outline-none focus:border-indigo-500"
                            >
                                <option value="Geral">Geral</option>
                                <option value="Operacional">Operacional</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Vendas">Vendas</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleCreate}
                                disabled={isCreating}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmar e Criar"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};



export default React.memo(RoleAutocomplete);