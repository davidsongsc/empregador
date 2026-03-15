"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import {
    UserPlus, Trash2, Loader2, ChevronLeft, ChevronRight,
    Search, ShieldAlert, Fingerprint, Shield, Activity
} from "lucide-react";
import { getActiveMembership } from "@/utils/userHelpers";
import { ROLE_LABELS } from "@/constants/roles";
import RoleSelectorPanel from "@/components/MiniComponents/RoleSelectorPanel";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";

export default function MembersPage() {
    // 1. EXTRAÇÃO DOS DADOS DA STORE (Garantindo que membersCount e fetchMembers existam)
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

    // 2. ESTADOS DE CONTROLE
    const [searchTerm, setSearchTerm] = useState("");
    const [profileFilter, setProfileFilter] = useState<'ALL' | 'CLIENT' | 'INTERNAL' | 'CANDIDATE'>('ALL');
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToTerminate, setMemberToTerminate] = useState<{ id: number, name: string } | null>(null);

    const activeCompany = getActiveMembership();
    const companyId = activeCompany?.id;
    const companyName = activeCompany?.name;

    // Inicialização do Cluster
    useEffect(() => {
        const init = async () => {
            await loadFromStorage();
            if (companyId) await fetchCompanyDetails(companyId);
        };
        init();
    }, [companyId]);

    // 3. GATILHO DE PAGINAÇÃO REAL (Sincroniza com o Backend)
    const handlePageChange = (newPage: number) => {
        if (companyId && newPage !== currentPage) {
            setCurrentPage(newPage);
            fetchMembers(companyId, newPage); // Busca a nova página no Django
        }
    };

    // Resetar página ao filtrar ou pesquisar localmente
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, profileFilter]);

    // 4. LÓGICA DE FILTRAGEM (Dados já vêm fatiados do servidor)
    const { paginatedMembers, totalPages, totalResults } = useMemo(() => {
        const list = Array.isArray(members) ? members : [];

        // Filtro local refinado (Busca e Perfil)
        const filtered = list.filter(m => {
            const label = ROLE_LABELS[m.role] || m.role;
            const matchesSearch = m.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 label.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesProfile = true;
            if (profileFilter === 'CLIENT') matchesProfile = m.role.startsWith('CLIENT_');
            if (profileFilter === 'CANDIDATE') matchesProfile = m.role.startsWith('CANDIDATE_');
            if (profileFilter === 'INTERNAL') {
                matchesProfile = !m.role.startsWith('CLIENT_') && !m.role.startsWith('CANDIDATE_');
            }

            return matchesSearch && matchesProfile;
        });

        // O total de páginas é baseado no membersCount retornado pela API (count: 50)
        const pages = Math.ceil(membersCount / 10); 

        return {
            paginatedMembers: filtered,
            totalPages: pages,
            totalResults: membersCount
        };
    }, [members, searchTerm, profileFilter, membersCount]);

    const handleOpenTerminateModal = (id: number, name: string) => {
        setMemberToTerminate({ id, name });
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
        <div className="min-h-screen bg-[var(--delos-surface)] text-[var(--delos-black)] p-4 md:p-8 pt-24 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER CORPORATIVO */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--delos-border)] pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-4 h-4 text-[var(--delos-amber)] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--delos-amber)]">
                                Security_Matrix_Operational
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                            Membros <span className="text-[var(--delos-grey)]">/</span> {activeCompany?.name || "Nexus_Hub"}
                        </h1>
                        <p className="text-[11px] font-bold text-[var(--delos-subtext)] uppercase tracking-widest italic">
                            Status: <span className={loading ? "text-blue-500" : "text-emerald-500"}>{loading ? "Sincronizando..." : "Dataframe_Ativo"}</span>
                        </p>
                    </div>

                    <button className="flex items-center justify-center gap-3 bg-[var(--delos-black)] text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--delos-amber)] transition-all active:scale-95 shadow-lg">
                        <UserPlus className="w-4 h-4" />
                        Vincular_Novo_Sujeito
                    </button>
                </header>

                {/* BARRA DE FERRAMENTAS (BUSCA + PERFIL) */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--delos-subtext)] w-4 h-4 group-focus-within:text-[var(--delos-amber)] transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="PESQUISAR_IDENTIDADE_OU_CARGO..."
                            className="input-delos w-full !pl-12 py-4 text-[11px] font-black uppercase tracking-widest bg-white relative"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-[var(--delos-black)] p-1 rounded-sm shadow-xl shrink-0">
                        {[
                            { id: 'ALL', label: 'Todos' },
                            { id: 'CLIENT', label: 'Clientes' },
                            { id: 'INTERNAL', label: 'Nexus_Staff' },
                            { id: 'CANDIDATE', label: 'Talentos' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setProfileFilter(tab.id as any)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${profileFilter === tab.id
                                        ? 'bg-[var(--delos-amber)] text-black'
                                        : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABELA DE MEMBROS */}
                <div className="border border-[var(--delos-border)] bg-white shadow-2xl">
                    <div className="overflow-x-auto min-h-[450px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[var(--delos-black)] bg-gray-50/50">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Identidade_Node</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Privilégio_Sistêmico</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Integridade</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--delos-border)]">
                                {loading && members.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-32 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--delos-amber)] mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--delos-subtext)]">Lendo_Clusters...</p>
                                        </td>
                                    </tr>
                                ) : paginatedMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-32 text-center">
                                            <ShieldAlert className="w-12 h-12 mx-auto text-[var(--delos-grey)] opacity-20 mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--delos-subtext)]">Zero_Data_Found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedMembers.map((member) => (
                                        <tr key={member.id} className="group hover:bg-gray-50 transition-colors animate-in fade-in duration-300">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-sm bg-[var(--delos-black)] flex items-center justify-center text-[var(--delos-surface)] font-black text-sm italic border-r-4 border-[var(--delos-amber)] shadow-inner shrink-0">
                                                        {member.profile_name?.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black uppercase tracking-tighter text-[var(--delos-black)] truncate">{member.profile_name}</p>
                                                        <p className="text-[9px] text-[var(--delos-subtext)] font-bold tracking-widest mt-0.5 italic">ID_HEX: #{member.id.toString(16).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <button
                                                    onClick={() => setEditingMemberId(member.id)}
                                                    className="flex items-center gap-2 bg-white px-4 py-2 border border-[var(--delos-border)] text-[10px] font-black uppercase hover:border-[var(--delos-black)] hover:bg-[var(--delos-black)] hover:text-white transition-all group/btn"
                                                >
                                                    <Shield className="w-3 h-3 text-[var(--delos-amber)]" />
                                                    {ROLE_LABELS[member.role] || member.role}
                                                </button>

                                                {editingMemberId === member.id && (
                                                    <RoleSelectorPanel
                                                        currentRole={member.role}
                                                        onSelect={(newRole) => updateMemberRole(member.id, newRole)}
                                                        onClose={() => setEditingMemberId(null)}
                                                        companyName={companyName}
                                                    />
                                                )}
                                            </td>

                                            <td className="px-6 py-6 text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter">Sincronizado</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6 text-right">
                                                <button
                                                    onClick={() => handleOpenTerminateModal(member.id, member.profile_name)}
                                                    className="p-3 text-[var(--delos-subtext)] hover:text-red-600 hover:bg-red-50 rounded-sm transition-all transform hover:scale-110 active:scale-95 group"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setMemberToTerminate(null);
                        }}
                        onConfirm={handleConfirmTermination}
                        title="TERMINAR_ACESSO_DE_NÓ"
                        description={
                            memberToTerminate
                                ? `Você está prestes a revogar permanentemente todos os privilégios de [${memberToTerminate.name.toUpperCase()}]. Esta ação é irreversível.`
                                : "Confirmar revogação de acesso?"
                        }
                        loading={loading}
                    />

                    {/* FOOTER DELOS SYSTEM (PAGINAÇÃO ATIVA) */}
                    <footer className="px-6 py-6 border-t border-[var(--delos-border)] bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--delos-subtext)]">
                            <span>Total_Nodes: {totalResults}</span>
                            <div className="w-1 h-1 rounded-full bg-[var(--delos-amber)]" />
                            <span>Layer: {currentPage} / {totalPages || 1}</span>
                        </div>

                        <div className="flex gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="flex items-center gap-2 px-6 py-2 border border-[var(--delos-border)] text-[9px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-20 transition-all active:bg-gray-100"
                            >
                                <ChevronLeft className="w-3 h-3" /> Prev_Layer
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0 || loading}
                                className="flex items-center gap-2 px-6 py-2 border border-[var(--delos-border)] text-[9px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-20 transition-all active:bg-gray-100"
                            >
                                Next_Layer <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}