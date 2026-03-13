"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import {
  ChevronRight, ChevronLeft, Check, Target, X, Cpu, Fingerprint, Database,
  Activity, ShieldCheck, Box, Layers, Plus, Trash2, Edit3, Save, Users,
  Terminal, Search, Star, UserPlus
} from "lucide-react";
import { toast } from "@/components/Notification";

export default function DepartmentsPage() {
  const { activeCompany, members: companyMembers } = useCompanyStore();
  const { departments, loading, fetchDepartments, addDepartment, updateDepartment, removeDepartment } = useDepartmentStore();

  const [step, setStep] = useState<'list' | 'editor'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showMemberSelector, setShowMemberSelector] = useState<{ type: 'leaders' | 'members', open: boolean }>({ type: 'members', open: false });
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    leaders: [] as number[],
    members: [] as number[]
  });

  useEffect(() => {
    if (activeCompany?.id) fetchDepartments(activeCompany.id);
  }, [activeCompany?.id, fetchDepartments]);

  const handleSave = async () => {
    if (!activeCompany?.id) return;
    const targetId = editingId && typeof editingId === "string" ? editingId : null;

    try {
      const formattedData = {
        ...formData,
        name: formData.name?.trim().toUpperCase(),
        description: formData.description?.trim() || "",
        company: activeCompany.id
      };

      if (targetId) {
        await updateDepartment(activeCompany.id, targetId, formattedData);
        toast.success("DELTA_SYNC_COMPLETE: Nó atualizado.");
      } else {
        await addDepartment(activeCompany.id, formattedData);
        toast.success("INJECTION_SUCCESS: Novo setor criado.");
      }
      resetForm();
    } catch (e) {
      toast.error("SYNC_ERROR: Falha na persistência.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setStep('list');
    setFormData({ name: "", description: "", parent: "", leaders: [], members: [] });
  };

  const startEdit = (dept: any) => {
    setFormData({
      name: dept.name,
      description: dept.description,
      parent: dept.parent || "",
      leaders: dept.leaders || [],
      members: dept.members || []
    });
    setEditingId(dept.id);
    setStep('editor');
  };

  const filteredMembers = useMemo(() => {
    if (!companyMembers || !Array.isArray(companyMembers)) return [];
    return companyMembers.filter(m => m.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [companyMembers, searchTerm]);

  const toggleMember = (id: number, type: 'leaders' | 'members') => {
    setFormData(prev => {
      const list = prev[type].includes(id) ? prev[type].filter(i => i !== id) : [...prev[type], id];
      if (type === 'leaders' && list.length > 3) {
        toast.error("CAPACITY: Máximo 3 líderes.");
        return prev;
      }
      return { ...prev, [type]: list };
    });
  };

  return (
    <div className="relative inset-0 z-0 bg-[#050505] flex items-center justify-center animate-in fade-in duration-500 overflow-hidden text-black">
      {/* GRID DECORATIVO */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      <div className="relative w-full h-full max-w-[1600px] flex flex-col md:flex-row">

        {/* LATERAL ESQUERDA: STATUS & LOGS */}
        <div className="w-full md:w-[30%] bg-black p-12 flex flex-col justify-between border-r border-white/10 relative shrink-0">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--delos-amber)] flex items-center justify-center rounded-sm rotate-45 shrink-0">
                <Fingerprint className="w-6 h-6 text-black -rotate-45" />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Freela<span className="text-[var(--delos-amber)]">Certo</span></h2>
                <p className="text-[10px] font-bold text-[var(--delos-amber)] uppercase tracking-[0.4em]">Op_{activeCompany?.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 border-l-2 border-[var(--delos-amber)] bg-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Protocolo_Estrutura</p>
                <p className="text-xl font-black uppercase italic text-white leading-none">
                  {step === 'list' ? `Setores_Ativos [${departments.length}]` : `Editando_${formData.name || 'Novo_Nó'}`}
                </p>
              </div>

              <div className="font-mono text-[9px] text-white/30 uppercase leading-relaxed space-y-2 border-t border-white/10 pt-4">
                <p className="flex gap-2"><span className="text-[var(--delos-amber)]">›</span> {loading ? "Sincronizando Cluster..." : "Cluster Online"}</p>
                <p className="flex gap-2"><span className="text-[var(--delos-amber)]">›</span> Mapeando Dependências Hieárquicas...</p>
                <p className="flex gap-2"><span className="text-[var(--delos-amber)]">›</span> {step === 'list' ? "Aguardando Input do Operador" : "Modo de Injeção Delta Ativo"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             {step === 'list' && (
                <button onClick={() => setStep('editor')} className="w-full group flex items-center justify-between bg-[var(--delos-amber)] text-black p-6 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                    <span>Adicionar_Novo_Setor</span>
                    <Plus className="group-hover:rotate-90 transition-transform" />
                </button>
             )}
             <p className="text-[7px] font-mono text-white/20 uppercase tracking-[0.3em]">Security_Level: Admin_Auth_Required</p>
          </div>
        </div>

        {/* ÁREA PRINCIPAL: LISTA OU EDITOR */}
        <div className="flex-1 bg-white p-8 md:p-20 overflow-y-auto custom-scrollbar flex flex-col">
          <header className="mb-16 flex justify-between items-end border-b-4 border-black pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[var(--delos-amber)]">
                <Layers className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                    {step === 'list' ? 'Passo_01: Seleção_de_Nó' : 'Passo_02: Configuração_Delta'}
                </span>
              </div>
              <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                {step === 'list' ? 'Setores' : 'Editor'}
              </h3>
            </div>

            {step === 'editor' && (
              <button onClick={resetForm} className="flex items-center gap-2 px-6 py-3 border-2 border-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                <ChevronLeft className="w-4 h-4" /> Cancelar_Operação
              </button>
            )}
          </header>

          <div className="flex-1">
            {step === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => startEdit(dept)}
                    className="group relative flex flex-col justify-end p-8 border-2 border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all min-h-[160px] text-left"
                  >
                    <div className="absolute top-8 left-8 w-10 h-10 bg-black group-hover:bg-[var(--delos-amber)] flex items-center justify-center text-white group-hover:text-black transition-colors">
                        {dept.parent ? <ChevronRight size={18} /> : <Database size={18} />}
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">{dept.name}</h4>
                        <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                            Membros: {dept.members?.length || 0} // Líderes: {dept.leaders?.length || 0}
                        </p>
                    </div>
                    <ChevronRight className="absolute right-8 bottom-8 w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[var(--delos-amber)]" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={14} className="text-[var(--delos-amber)]" /> Nome_do_Setor
                        </label>
                        <input 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-b-4 border-black p-4 text-2xl font-black uppercase italic focus:bg-black focus:text-white outline-none transition-all"
                            placeholder="EX: LOGISTICA_SUL"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Layers size={14} className="text-[var(--delos-amber)]" /> Dependência_Hierárquica
                        </label>
                        <select 
                             value={formData.parent}
                             onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                             className="w-full border-b-4 border-black p-4 text-xl font-black uppercase italic outline-none"
                        >
                            <option value="">RAIZ_SISTEMA</option>
                            {departments.filter(d => d.id !== editingId).map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* SEÇÃO LÍDERES */}
                    <div className="p-8 border-2 border-black space-y-6">
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="text-[10px] font-black uppercase flex items-center gap-2"><Star size={14} fill="black" /> Comando</span>
                            <span className="text-xs font-mono font-bold">[{formData.leaders.length}/3]</span>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {formData.leaders.map(id => (
                                <div key={id} className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase italic">
                                    {companyMembers.find(m => m.id === id)?.profile_name}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowMemberSelector({ type: 'leaders', open: true })} className="w-full py-3 bg-black text-white text-[10px] font-black uppercase hover:bg-[var(--delos-amber)] hover:text-black transition-all">
                            Atribuir_Líder
                        </button>
                    </div>

                    {/* SEÇÃO MEMBROS */}
                    <div className="p-8 border-2 border-black space-y-6">
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="text-[10px] font-black uppercase flex items-center gap-2"><Users size={14} /> Operacionais</span>
                            <span className="text-xs font-mono font-bold">[{formData.members.length}]</span>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {formData.members.slice(0, 4).map(id => (
                                <div key={id} className="border border-black px-3 py-1 text-[9px] font-black uppercase italic">
                                    {companyMembers.find(m => m.id === id)?.profile_name}
                                </div>
                            ))}
                            {formData.members.length > 4 && <span className="text-xs">...</span>}
                        </div>
                        <button onClick={() => setShowMemberSelector({ type: 'members', open: true })} className="w-full py-3 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all">
                            Vincular_Host
                        </button>
                    </div>
                </div>

                <div className="pt-10 space-y-6">
                    <button onClick={handleSave} className="w-full bg-black text-white py-8 font-black text-xl uppercase italic tracking-[0.3em] hover:bg-[var(--delos-amber)] hover:text-black transition-all flex items-center justify-center gap-4">
                        <Save size={24} /> Sincronizar_Estrutura
                    </button>
                    {editingId && (
                        <button onClick={() => removeDepartment(activeCompany!.id, editingId)} className="w-full text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                            Remover_Setor_do_Cluster
                        </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE SELEÇÃO DE MEMBROS (OVERLAY DELOS) */}
      {showMemberSelector.open && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl border-4 border-black flex flex-col max-h-[80vh]">
                <div className="bg-black p-6 flex justify-between items-center">
                    <span className="text-white text-xs font-black uppercase tracking-widest">Assign_{showMemberSelector.type}</span>
                    <X className="text-white cursor-pointer hover:text-[var(--delos-amber)]" onClick={() => setShowMemberSelector({ ...showMemberSelector, open: false })} />
                </div>
                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                        <input 
                            placeholder="FILTRAR_HOSTS..."
                            className="w-full pl-12 p-4 border-b-2 border-black font-black uppercase outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {filteredMembers.map(m => {
                            const selected = formData[showMemberSelector.type].includes(m.id);
                            return (
                                <button key={m.id} onClick={() => toggleMember(m.id, showMemberSelector.type)} className={`p-4 flex justify-between items-center border-2 transition-all ${selected ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-black'}`}>
                                    <div className="text-left">
                                        <p className="font-black uppercase text-xs">{m.profile_name}</p>
                                        <p className="text-[8px] font-mono opacity-50">{m.role}</p>
                                    </div>
                                    {selected && <Check className="text-[var(--delos-amber)]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button onClick={() => setShowMemberSelector({ ...showMemberSelector, open: false })} className="p-6 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-[var(--delos-amber)] hover:text-black transition-all">
                    Finalizar_Seleção
                </button>
            </div>
        </div>
      )}
    </div>
  );
}