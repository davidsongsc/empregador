import { CompanyMemberDetail } from "@/interfaces/iCompanyMember";
import { Department } from "@/interfaces/iDepartament";
import { debounce } from "lodash";
import { 
    Settings2, ShieldCheck, Trash2, UserPlus, Users, 
    Lock, ChevronRight, Crown, GitBranch, User 
} from "lucide-react";
import { useMemo } from "react";

function DepartmentCard({ dept, isLocked, isActive, onSelect, onUpdate, onDelete }: any) {
    
    const debouncedUpdate = useMemo(() =>
        debounce((id: string, data: Partial<Department>) => onUpdate(id, data), 1000),
        [onUpdate]);

    return (
        <div className={`group border transition-all duration-500 relative overflow-hidden ${isActive
                ? 'bg-[var(--delos-black)] text-[var(--delos-surface)] border-[var(--delos-black)] shadow-2xl'
                : 'bg-[var(--delos-surface)] border-[var(--delos-border)] hover:bg-[var(--delos-black)]/[0.02]'
            }`}>
            
            {/* LINHA DE STATUS LATERAL */}
            <div className={`absolute left-0 top-0 h-full w-[2px] transition-colors ${isLocked ? 'bg-[var(--delos-red)]/50' : 'bg-emerald-500'}`} />
            
            <div className="p-6">
                {/* HEADER DO CARD */}
                <div className="flex justify-between items-start gap-6 mb-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-amber-500' : 'text-[var(--delos-grey)]'}`}>
                                {dept.parent ? `Sub_Node // Branch_of_${dept.parent}` : `Root_Sector // ${dept.id?.slice(0, 8)}`}
                            </span>
                        </div>
                        <input
                            disabled={isLocked}
                            className={`bg-transparent text-2xl font-black uppercase italic outline-none w-full transition-colors ${isActive ? 'text-white' : 'text-[var(--delos-black)] focus:text-[var(--delos-amber)]'}`}
                            defaultValue={dept.name}
                            onChange={(e) => debouncedUpdate(dept.id, { name: e.target.value })}
                        />
                        <textarea
                            disabled={isLocked}
                            className={`bg-transparent text-[10px] uppercase w-full outline-none resize-none font-bold italic leading-tight ${isActive ? 'text-slate-400' : 'text-[var(--delos-grey)]'}`}
                            defaultValue={dept.description || "NO_DESCRIPTION_PROVIDED_BY_CORE"}
                            onChange={(e) => debouncedUpdate(dept.id, { description: e.target.value })}
                            rows={1}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSelect}
                            className={`p-2 transition-all ${isActive ? 'bg-amber-600 text-white rotate-90' : 'text-[var(--delos-grey)] hover:bg-black/5'}`}
                        >
                            <Settings2 size={16} />
                        </button>
                        {!isLocked && (
                            <button onClick={() => onDelete(dept.id)} className="p-2 text-[var(--delos-grey)] hover:text-[var(--delos-red)] transition-colors text-xs">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* VIEW EXPANDIDA: HIERARQUIA E PESSOAL */}
                {isActive && (
                    <div className="mb-8 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        
                        {/* 1. SEÇÃO DE LIDERANÇA */}
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2 border-b border-white/10 pb-2">
                                <Crown size={12} /> Operational_Leadership
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {dept.leaders_detail?.map((leader: CompanyMemberDetail) => (
                                    <MemberItem key={leader.id} member={leader} isLeader />
                                ))}
                            </div>
                        </div>

                        {/* 2. SEÇÃO de MEMBROS (Novo) */}
                        <div className="space-y-3">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 border-b border-white/10 pb-2">
                                <Users size={12} /> Active_Personnel
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {dept.members_detail?.length > 0 ? (
                                    dept.members_detail.map((member: CompanyMemberDetail) => (
                                        <MemberItem key={member.id} member={member} />
                                    ))
                                ) : (
                                    <div className="text-[8px] uppercase opacity-40 italic p-2 italic font-mono">No_Members_Assigned_to_Node</div>
                                )}
                            </div>
                        </div>

                        {/* 3. SUB-DEPARTAMENTOS (Novo) */}
                        {dept.sub_departments?.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2 border-b border-white/10 pb-2">
                                    <GitBranch size={12} /> Dependent_Nodes
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {dept.sub_departments.map((sub: any) => (
                                        <div key={sub.id} className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{sub.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FOOTER METRICS */}
                <div className={`mt-4 pt-4 border-t flex justify-between items-center text-[9px] font-black uppercase tracking-tighter ${isActive ? 'border-white/10' : 'border-[var(--delos-border)]'}`}>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-[var(--delos-black)]">
                            <Users size={12} className={isActive ? 'text-amber-500' : 'text-slate-400'} />
                            {dept.members_count} <span className="opacity-50">Units</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck size={12} className="text-[var(--delos-amber)]" />
                            {dept.leaders_count} <span className="opacity-50">Cmd_Nodes</span>
                        </span>
                        {dept.sub_departments?.length > 0 && (
                            <span className="flex items-center gap-1.5 text-emerald-500">
                                <GitBranch size={12} />
                                {dept.sub_departments.length} <span className="opacity-50 text-white/40">Branches</span>
                            </span>
                        )}
                    </div>
                    {isLocked ? (
                        <div className="flex items-center gap-1 text-[var(--delos-amber)] animate-pulse font-black italic">
                            <Lock size={10} /> ACCESS_RESTRICTED
                        </div>
                    ) : (
                        <div className={`flex items-center gap-1 font-black italic ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                            <Activity size={10} className="animate-spin-slow" /> DATA_SYNC_ON
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Sub-componente para itens de Membro/Líder
 */
function MemberItem({ member, isLeader = false }: { member: CompanyMemberDetail, isLeader?: boolean }) {
    return (
        <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 transition-all group/member">
            <div className="flex items-center gap-3">
                <div className={`w-7 h-7 flex items-center justify-center text-[9px] font-black border ${
                    isLeader ? 'bg-amber-600 border-amber-400 text-black' : 'bg-transparent border-white/20 text-white'
                }`}>
                    {member.profile_name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase leading-tight">{member.profile_name}</div>
                    <div className="text-[7px] opacity-60 font-bold uppercase tracking-widest">{member.role}</div>
                </div>
            </div>
            {isLeader ? (
                <Crown size={10} className="text-amber-500" />
            ) : (
                <User size={10} className="text-white/20 group-hover/member:text-white/50 transition-colors" />
            )}
        </div>
    );
}

// Icone Activity (já fornecido anteriormente)
function Activity({ size, className }: { size: number, className: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

export default DepartmentCard;