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
import SystemicTable from "@/components/ProfileRestrictions/SystemicTable";

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
    const myProfileId = user?.profile?.id ?? "";

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
                    fetchMembers(1)
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
                        Vincular
                    </motion.button>
                </header>

                <SystemicTable
                    loading={loading}
                    members={members}
                    paginatedMembers={paginatedMembers}
                    myProfileId={myProfileId}
                    isSuperAdmin={isSuperAdmin}
                    editingMemberId={editingMemberId}
                    companyName={companyName}
                    ROLE_LABELS={ROLE_LABELS}
                    canManageMember={canManageMember}
                    setEditingMemberId={setEditingMemberId}
                    updateMemberRole={updateMemberRole}
                    handleOpenTerminateModal={handleOpenTerminateModal}
                    RoleSelectorPanel={RoleSelectorPanel}
                />
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