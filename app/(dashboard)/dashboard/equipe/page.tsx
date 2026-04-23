"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useAuthStore } from "@/store/useAuthStore";
import { 
    UserPlus, Trash2, Loader2, ChevronLeft, ChevronRight, 
    Search, Fingerprint, Shield, Activity, Binary, Terminal, ShieldAlert 
} from "lucide-react";
import { motion } from "framer-motion";

// Helpers e Componentes
import { canManageMember, getActiveMembership } from "@/utils/userHelpers";
import { ROLE_LABELS } from "@/constants/roles";
import RoleSelectorPanel from "@/components/MiniComponents/RoleSelectorPanel";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export default function MembersPage() {
    const { 
        members, 
        membersCount, 
        loading, 
        fetchCompanyDetails, 
        fetchMembers, 
        updateMemberRole, 
        removeMember, 
        loadFromStorage 
    } = useCompanyStore();

    // 1. IDENTIFICAÇÃO E PERMISSÕES SISTÊMICAS
    const { user } = useAuthStore();
    // Extraímos isSuperAdmin do nosso hook de permissões centralizado
    const { high, modules, isSuperAdmin } = useUserPermissions(user?.profile?.role || "");
    const myProfileId = user?.profile?.id;

    // 2. ESTADOS DE CONTROLE DE INTERFACE
    const [searchTerm, setSearchTerm] = useState("");
    const [profileFilter, setProfileFilter] = useState<'ALL' | 'CLIENT' | 'INTERNAL' | 'CANDIDATE'>('ALL');
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToTerminate, setMemberToTerminate] = useState<{ id: string, name: string } | null>(null);

    const activeCompany = getActiveMembership();
    const companyId = activeCompany?.company_id;
    const companyName = activeCompany?.company_name;

    // 3. INICIALIZAÇÃO DO DATAFRAME
    useEffect(() => {
        const init = async () => {
            const storageData = await loadFromStorage();
            const targetId = companyId;
            if (targetId) {
                await Promise.all([
                    fetchCompanyDetails(targetId),
                    fetchMembers( 1)
                ]);
            }
        };
        init();
    }, [companyId, loadFromStorage, fetchCompanyDetails, fetchMembers]);

    // 4. FILTRAGEM E PAGINAÇÃO
    const { paginatedMembers, totalPages, totalResults } = useMemo(() => {
        const list = Array.isArray(members) ? members : [];
        const filtered = list.filter(m => {
            const label = ROLE_LABELS[m.role] || m.role;
            const matchesSearch =
                m.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                label.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesProfile = true;
            if (profileFilter === 'CLIENT') matchesProfile = m.role.startsWith('CLIENT_');
            if (profileFilter === 'CANDIDATE') matchesProfile = m.role.startsWith('CANDIDATE_');
            if (profileFilter === 'INTERNAL') {
                matchesProfile = !m.role.startsWith('CLIENT_') && !m.role.startsWith('CANDIDATE_');
            }
            return matchesSearch && matchesProfile;
        });

        const pages = Math.ceil(membersCount / 10);
        return { paginatedMembers: filtered, totalPages: pages, totalResults: membersCount };
    }, [members, searchTerm, profileFilter, membersCount]);

    const handleOpenTerminateModal = (profileId: string, name: string) => {
        setMemberToTerminate({ id: profileId, name });
        setIsDeleteModalOpen(true);
    };

    const handleConfirmTermination = async () => {
        if (memberToTerminate) {
            await removeMember(memberToTerminate.id);
            setIsDeleteModalOpen(false);
            setMemberToTerminate(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pt-24 font-sans selection:bg-red-500/30 overflow-x-hidden">
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500/80">
                                Delos_Intelligence_Platform // Security_Sector
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-light uppercase tracking-[-0.05em] leading-none">
                            Controle_de <span className="font-black text-red-600 italic">Acessos</span>
                        </h1>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
                        className="flex items-center justify-center gap-4 bg-transparent border border-white/20 text-white px-10 py-5 rounded-none font-black text-[11px] uppercase tracking-[0.3em]"
                    >
                        <UserPlus className="w-4 h-4" />
                        Vincular_Sujeito
                    </motion.button>
                </header>

                {/* TABELA SISTÊMICA COM REGRAS DE PERMISSÃO APLICADAS */}
                <div className="bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
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
                                        <td colSpan={4} className="py-40 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-red-600" /></td>
                                    </tr>
                                ) : (
                                    paginatedMembers.map((member) => {
                                        const isMe = member.profile_id === myProfileId;
                                        
                                        // --- LÓGICA DE PERMISSÃO DELOS ---
                                        // 1. Super Admins podem gerenciar QUALQUER UM.
                                        // 2. Ninguém (nem Super Admin) pode gerenciar a SI PRÓPRIO nesta lista (para evitar auto-lockout).
                                        // 3. Usuários comuns usam a lógica canManageMember padrão.
                                        const isManageable = isSuperAdmin ? !isMe : canManageMember(member.role, member.profile_id);

                                        return (
                                            <tr key={member.profile_id} className={`group hover:bg-white/[0.02] transition-colors ${isMe ? 'bg-red-900/10' : ''}`}>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-12 h-12 flex items-center justify-center border ${isMe ? 'border-red-600 bg-red-600 text-black' : 'border-white/10 bg-transparent text-white/30'}`}>
                                                            {isMe ? <Fingerprint size={20} /> : <Binary size={18} />}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-base font-black uppercase italic tracking-tight">{member.profile?.name || "N/A"}</p>
                                                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">UID: {member.profile_id.substring(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                </td>

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
                                                                    onSelect={async (newRole) => {
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

                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-1 w-24 bg-white/5 overflow-hidden">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: isMe ? "100%" : "75%" }}
                                                                className={`h-full ${isMe ? 'bg-emerald-500' : 'bg-red-600/40'}`}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-mono text-white/30">{isMe ? "100%" : "75%"}</span>
                                                    </div>
                                                </td>

                                                <td className="px-8 py-8 text-right">
                                                    <div className="flex justify-end gap-4">
                                                        {isManageable ? (
                                                            <button 
                                                                onClick={() => handleOpenTerminateModal(member.profile_id, member.profile?.name || "Membro")}
                                                                className="p-3 border border-transparent hover:border-red-600/50 hover:text-red-500 transition-all text-white/20"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-white/10 italic">
                                                                <Shield size={12} />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">{isMe ? "Self" : "Locked"}</span>
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

                <footer className="flex justify-between items-center opacity-20 pt-8 border-t border-white/5 font-mono text-[8px] uppercase tracking-[0.5em]">
                     <span>Host_ID::{user?.id?.substring(0, 8) || "UNKNOWN"}</span>
                     <span>Delos_Firmware_v4.0.2</span>
                </footer>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setMemberToTerminate(null); }}
                onConfirm={handleConfirmTermination}
                title="TERMINAR_CONEXÃO_DE_NÓ"
                description={`Atenção: A revogação dos privilégios de [${memberToTerminate?.name?.toUpperCase()}] é uma ação definitiva de segurança.`}
                loading={loading}
            />
        </div>
    );
}