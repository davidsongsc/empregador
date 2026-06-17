"use client";

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Fingerprint, Binary, Trash2, Shield } from 'lucide-react';

// Tipagem para clareza e segurança no TS
interface Member {
    profile_id: string;
    role: string;
    profile?: {
        name: string;
    };
}

interface SystemicTableProps {
    loading: boolean;
    members: Member[];
    paginatedMembers: Member[];
    myProfileId: string | null;
    isSuperAdmin: boolean;
    editingMemberId: string | null;
    companyName: string;
    ROLE_LABELS: Record<string, string>;
    canManageMember: (role: string, id: string) => boolean;
    setEditingMemberId: (id: string | null) => void;
    updateMemberRole: (id: string, role: string) => Promise<void>;
    handleOpenTerminateModal: (id: string, name: string) => void;
    // RoleSelectorPanel deve ser importado ou passado como componente
    RoleSelectorPanel: React.ComponentType<any>;
}

const SystemicTable = memo(({
    loading,
    members,
    paginatedMembers,
    myProfileId,
    isSuperAdmin,
    editingMemberId,
    companyName,
    ROLE_LABELS,
    canManageMember,
    setEditingMemberId,
    updateMemberRole,
    handleOpenTerminateModal,
    RoleSelectorPanel
}: SystemicTableProps) => {

    return (
        <div className="bg-[#0a0a0a] border border-white/10 relative overflow-hidden rounded-sm">
            {/* Linha de acento estética (Industrial Clean) */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Sujeito_ID</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Privilégio_Nível</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">Integridade</th>
                            <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic text-right">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {loading && members.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-40 text-center">
                                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-red-600" />
                                </td>
                            </tr>
                        ) : (
                            paginatedMembers.map((member) => {
                                const isMe = member.profile_id === myProfileId;

                                // Lógica Sistêmica de Permissão
                                // 1. Super Admins gerenciam todos, exceto a si mesmos.
                                // 2. Outros níveis seguem a função canManageMember.
                                const isManageable = isSuperAdmin ? !isMe : canManageMember(member.role, member.profile_id);

                                return (
                                    <tr
                                        key={member.profile_id}
                                        className={`group hover:bg-white/[0.02] transition-colors ${isMe ? 'bg-red-900/10' : ''}`}
                                    >
                                        {/* COLUNA: IDENTIDADE */}
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 flex items-center justify-center border transition-all ${isMe ? 'border-red-600 bg-red-600 text-black' : 'border-white/10 bg-transparent text-white/30 group-hover:border-white/30'
                                                    }`}>
                                                    {isMe ? <Fingerprint size={20} /> : <Binary size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-black uppercase italic tracking-tight text-white/90">
                                                        {member.profile?.name || "N/A"}
                                                    </p>
                                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                                                        UID: {member.profile_id.substring(0, 8)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* COLUNA: ROLE / SELECTOR */}
                                        <td className="px-8 py-8">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => isManageable && setEditingMemberId(member.profile_id)}
                                                    className={`px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all
                            ${isManageable
                                                            ? 'border-white/20 text-white hover:bg-white hover:text-black cursor-pointer'
                                                            : 'border-transparent text-white/20 cursor-not-allowed opacity-50'}`}
                                                >
                                                    {ROLE_LABELS[member.role] || member.role}
                                                </button>

                                                {editingMemberId === member.profile_id && (
                                                    <div className="absolute top-full left-0 mt-2 z-50">
                                                        <RoleSelectorPanel
                                                            currentRole={member.role}
                                                            onSelect={async (newRole: string) => {
                                                                await updateMemberRole(member.profile_id, newRole);
                                                                setEditingMemberId(null);
                                                            }}
                                                            onClose={() => setEditingMemberId(null)}
                                                            companyName={companyName}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* COLUNA: INTEGRIDADE (BARRA) */}
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1 w-24 bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: isMe ? "100%" : "75%" }}
                                                        className={`h-full ${isMe ? 'bg-emerald-500' : 'bg-red-600/40'}`}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-mono text-white/30">
                                                    {isMe ? "100%" : "75%"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* COLUNA: AÇÕES */}
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex justify-end gap-4">
                                                {isManageable ? (
                                                    <button
                                                        onClick={() => handleOpenTerminateModal(member.profile_id, member.profile?.name || "Membro")}
                                                        className="p-3 border border-transparent hover:border-red-600/50 hover:text-red-500 transition-all text-white/20"
                                                        title="Encerrar Acesso"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-white/10 italic">
                                                        <Shield size={12} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">
                                                            {isMe ? "Self" : "Locked"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

SystemicTable.displayName = 'SystemicTable';

export default SystemicTable;