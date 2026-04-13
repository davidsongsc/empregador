"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useAuthStore } from "@/store/useAuthStore"; // Importado para identificar o "EU"
import {
    UserPlus, Trash2, Loader2, ChevronLeft, ChevronRight,
    Search, ShieldAlert, Fingerprint, Shield, Activity, UserCheck
} from "lucide-react";
import { canManageMember, getActiveMembership } from "@/utils/userHelpers";
import { ROLE_LABELS } from "@/constants/roles";
import RoleSelectorPanel from "@/components/MiniComponents/RoleSelectorPanel";
import { ConfirmationModal } from "@/components/Modal/ConfirmationModal";

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

    // 1. IDENTIFICAÇÃO DO USUÁRIO LOGADO
    const { user } = useAuthStore();
    const myProfileId = user?.profile?.id;

    const [searchTerm, setSearchTerm] = useState("");
    const [profileFilter, setProfileFilter] = useState<'ALL' | 'CLIENT' | 'INTERNAL' | 'CANDIDATE'>('ALL');
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToTerminate, setMemberToTerminate] = useState<{ id: string, name: string } | null>(null);

    const activeCompany = getActiveMembership();
    const companyId = activeCompany?.company_id;
    const companyName = activeCompany?.company_name;

    useEffect(() => {
        const init = async () => {
            const storageData = await loadFromStorage();
            const targetId = companyId || storageData?.activeCompanyId;
            if (targetId) {
                await Promise.all([
                    fetchCompanyDetails(targetId),
                    fetchMembers(1)
                ]);
            }
        };
        init();
    }, [companyId, loadFromStorage, fetchCompanyDetails, fetchMembers]);

    const handlePageChange = (newPage: number) => {
        if (companyId && newPage !== currentPage && !loading) {
            setCurrentPage(newPage);
            fetchMembers(companyId, newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, profileFilter]);

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
        console.log("Confirmando término de acesso para:", memberToTerminate);
        if (memberToTerminate) {
            await removeMember(memberToTerminate.id);
            setIsDeleteModalOpen(false);
            setMemberToTerminate(null);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--delos-surface)] text-[var(--delos-black)] p-4 md:p-8 pt-24 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--delos-border)] pb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                            <span className="text-[var(--delos-grey)]">/</span>Segurança e Privacidade
                        </h1>
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-4 h-4 text-[var(--delos-amber)] animate-pulse" />
                            <span className="text-[14px] font-black uppercase tracking-[0.4em] text-[var(--delos-amber)]">
                                {companyName || "Freela Facil"}
                            </span>
                        </div>
                        <p className="text-[11px] font-bold text-[var(--delos-subtext)] uppercase tracking-widest italic">
                            Status: <span className={loading ? "text-blue-500" : "text-emerald-500"}>{loading ? "Sincronizando..." : "Dataframe_Ativo"}</span>
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-3 bg-[var(--delos-black)] text-white px-8 py-4 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--delos-amber)] transition-all active:scale-95 shadow-lg">
                        <UserPlus className="w-4 h-4" />
                        Vincular_Novo_Sujeito
                    </button>
                </header>

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
                        {['ALL', 'CLIENT', 'INTERNAL', 'CANDIDATE'].map((id) => (
                            <button
                                key={id}
                                onClick={() => setProfileFilter(id as any)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${profileFilter === id ? 'bg-[var(--delos-amber)] text-black' : 'text-white/40 hover:text-white'}`}
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border border-[var(--delos-border)] bg-white shadow-2xl">
                    <div className="overflow-x-auto min-h-[450px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-[var(--delos-black)] bg-gray-50/50">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Identificação</th>
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
                                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--delos-subtext)]">Lendo informação...</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedMembers.map((member) => {
                                        // 2. LOGICA DE TRAVA: SOU EU?
                                        const isMe = member.profile_id === myProfileId;

                                        // Chamamos o helper passando a Role e o ID do alvo para a validação completa
                                        const isManageable = canManageMember(member.role, member.profile_id);

                                        return (
                                            <tr key={member.profile_id} className={`group transition-all ${isMe ? 'bg-amber-50/20' : ''}`}>
                                                {/* Coluna de Identificação */}
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 flex items-center justify-center border-r-2 ${isMe ? 'bg-[var(--delos-amber)] border-black' : 'bg-black border-[var(--delos-amber)]'}`}>
                                                            {isMe ? <Fingerprint className="w-5 h-5 text-black" /> : <span className="text-white text-xs font-black">{member.profile.name?.charAt(0)}</span>}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black uppercase italic">{member.profile.name}</p>
                                                            {isMe && <span className="text-[8px] bg-black text-[var(--delos-amber)] px-1 font-bold">SESSÃO_ATIVA</span>}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Coluna de Privilégio (Botão de Troca de Cargo) */}
                                                <td className="px-6 py-6">
                                                    <button
                                                        onClick={() => isManageable && setEditingMemberId(member.profile_id)}
                                                        disabled={!isManageable}
                                                        className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase transition-all
                        ${isManageable
                                                                ? 'bg-white border-black hover:bg-black hover:text-white cursor-pointer'
                                                                : 'bg-gray-100 border-transparent text-gray-400 cursor-not-allowed opacity-40'
                                                            }`}
                                                    >
                                                        {/* Ícone muda conforme a relação de poder */}
                                                        {isMe ? (
                                                            <Fingerprint className="w-3 h-3 text-amber-600" />
                                                        ) : isManageable ? (
                                                            <Shield className="w-3 h-3 text-[var(--delos-amber)]" />
                                                        ) : (
                                                            <ShieldAlert className="w-3 h-3 text-gray-400" />
                                                        )}
                                                        {ROLE_LABELS[member.role] || member.role}
                                                    </button>

                                                    {editingMemberId === member.profile_id && (
                                                        <RoleSelectorPanel
                                                            currentRole={member.role}
                                                            onSelect={async (newRole) => {
                                                                await updateMemberRole(member.profile_id, newRole);
                                                                setEditingMemberId(null);
                                                            }}
                                                            onClose={() => setEditingMemberId(null)}
                                                            companyName={companyName}
                                                        />
                                                    )}
                                                </td>

                                                {/* Coluna de Ações (Excluir) */}
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex justify-end">
                                                        {/* Só renderiza a lixeira se o usuário for estritamente superior ao alvo */}
                                                        {isManageable ? (
                                                            <button
                                                                onClick={() => handleOpenTerminateModal(member.profile_id, member.profile.name)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        ) : !isMe && (
                                                            <div className="flex items-center gap-1 opacity-20 italic">
                                                                <Shield className="w-3 h-3" />
                                                                <span className="text-[8px] font-black uppercase">Protegido</span>
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

                    <ConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => { setIsDeleteModalOpen(false); setMemberToTerminate(null); }}
                        onConfirm={handleConfirmTermination}
                        title="TERMINAR_ACESSO_DE_NÓ"
                        description={memberToTerminate ? `Você está prestes a revogar permanentemente todos os privilégios de [${memberToTerminate.name.toUpperCase()}]. Esta ação é irreversível.` : "Confirmar revogação de acesso?"}
                        loading={loading}
                    />

                    <footer className="px-6 py-6 border-t border-[var(--delos-border)] bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--delos-subtext)]">
                            <span>Total_Nodes: {totalResults}</span>
                            <div className="w-1 h-1 rounded-full bg-[var(--delos-amber)]" />
                            <span>Layer: {currentPage} / {totalPages || 1}</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="flex items-center gap-2 px-6 py-2 border border-[var(--delos-border)] text-[9px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-20 transition-all active:bg-gray-100">
                                <ChevronLeft className="w-3 h-3" /> Prev_Layer
                            </button>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0 || loading} className="flex items-center gap-2 px-6 py-2 border border-[var(--delos-border)] text-[9px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-20 transition-all active:bg-gray-100">
                                Next_Layer <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}