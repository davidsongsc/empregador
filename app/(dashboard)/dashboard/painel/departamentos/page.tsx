"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import {
  Layers, Plus, Trash2, Edit3, Save, X, ChevronRight,
  Terminal, Activity, ShieldAlert, Users,
  Star, UserPlus, Fingerprint, Cpu, Search
} from "lucide-react";
import { toast } from "@/components/Notification";

export default function DepartmentsPage() {
  // 1. STORES CONTEXT
  const { activeCompany, members: companyMembers, fetchCompanyDetails } = useCompanyStore();
  const { departments, loading, fetchDepartments, addDepartment, updateDepartment, removeDepartment } = useDepartmentStore();

  // 2. UI STATE
  const [isAdding, setIsAdding] = useState(false);
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

  // 3. SYNC LOGIC
  useEffect(() => {
    if (activeCompany?.id) {
      fetchDepartments(); // O Store já deve usar o X-Company-ID ou company_pk
    }
  }, [activeCompany?.id, fetchDepartments]);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDepartment(editingId, formData);
        toast.success("DELTA_SYNC_COMPLETE: Nó atualizado.");
      } else {
        await addDepartment({ ...formData, company: activeCompany?.id });
        toast.success("INJECTION_SUCCESS: Novo setor criado.");
      }
      resetForm();
    } catch (e) {
      toast.error("SYNC_ERROR: Falha na persistência.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
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
    setIsAdding(false);
  };
  const filteredMembers = useMemo(() => {
    // Verifica se companyMembers existe E se é de fato um Array
    if (!companyMembers || !Array.isArray(companyMembers)) {
      return [];
    }

    return companyMembers.filter(m =>
      m.profile_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companyMembers, searchTerm]);

  const toggleMember = (id: number, type: 'leaders' | 'members') => {
    setFormData(prev => {
      const list = prev[type].includes(id)
        ? prev[type].filter(item => item !== id)
        : [...prev[type], id];

      if (type === 'leaders' && list.length > 3) {
        toast.error("CAPACITY_REACHED: Máximo 3 líderes.");
        return prev;
      }
      return { ...prev, [type]: list };
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-10 font-mono text-delos-black bg-delos-surface relative overflow-hidden">

      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Cpu size={120} strokeWidth={0.5} className="text-delos-amber" />
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-delos-black pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-delos-amber animate-ping" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-delos-grey">System_Architecture // Root</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Setores_<span className="text-delos-amber italic">Matrix</span>
          </h1>
        </div>

        {!isAdding && !editingId && (
          <button onClick={() => setIsAdding(true)} className="group bg-delos-black text-delos-surface px-8 py-4 font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:bg-delos-amber hover:text-delos-black transition-all">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Adicionar_Novo_Nó
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LADO ESQUERDO: LISTA DE SETORES */}
        <main className="lg:col-span-5 space-y-3">
          <div className="bg-delos-black/5 p-3 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-l-4 border-delos-black">
            <span>Estrutura_Atual</span>
            <span className="text-delos-amber">[{departments.length}]</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => startEdit(dept)}
                className={`p-5 flex items-center justify-between border-2 transition-all cursor-pointer group ${editingId === dept.id ? 'bg-delos-black text-delos-surface border-delos-black' : 'border-delos-black/5 hover:border-delos-amber bg-white'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold ${editingId === dept.id ? 'bg-delos-amber text-delos-black' : 'bg-delos-black text-white'}`}>
                    {dept.parent ? <ChevronRight size={14} /> : <Fingerprint size={14} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-tight">{dept.name}</h3>
                    <p className={`text-[8px] uppercase tracking-tighter ${editingId === dept.id ? 'text-delos-amber/60' : 'text-delos-grey'}`}>
                      Membros: {dept.members?.length || 0} // Líderes: {dept.leaders?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); removeDepartment(dept.id); }} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-delos-red hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* LADO DIREITO: CONSOLE DELTA */}
        <aside className="lg:col-span-7">
          {(isAdding || editingId) ? (
            <div className="bg-delos-black text-delos-surface shadow-2xl border-t-8 border-delos-amber animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Terminal size={18} className="text-delos-amber" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{editingId ? 'Edit_Mode' : 'Injection_Mode'}</span>
                </div>
                <button onClick={resetForm} className="hover:rotate-90 transition-transform"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-8">
                {/* CAMPOS BÁSICOS */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-delos-grey uppercase tracking-widest">Identificador_Setor</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="EX: FINANCEIRO_OPERACIONAL"
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase outline-none focus:border-delos-amber transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-delos-grey uppercase tracking-widest">Dependência_Superior</label>
                    <select
                      value={formData.parent}
                      onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase outline-none focus:border-delos-amber appearance-none"
                    >
                      <option value="" className="bg-delos-black">RAIZ_SISTEMA</option>
                      {departments.filter(d => d.id !== editingId).map(d => (
                        <option key={d.id} value={d.id} className="bg-delos-black">{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ROSTER MANAGEMENT */}
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-delos-amber flex items-center gap-2">
                    <Users size={12} /> Gerenciamento_de_Recursos_Humanos
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {/* BOX LÍDERES */}
                    <div className="border border-white/10 p-4 space-y-4 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase flex items-center gap-1"><Star size={10} className="text-delos-amber" fill="currentColor" /> Líderes</span>
                        <span className="text-[8px] text-delos-amber">[{formData.leaders.length}/3]</span>
                      </div>
                      <button
                        onClick={() => setShowMemberSelector({ type: 'leaders', open: true })}
                        className="w-full py-2 bg-white/10 hover:bg-delos-amber hover:text-delos-black text-[8px] font-black uppercase tracking-widest transition-all"
                      >
                        Atribuir_Líder
                      </button>
                      <div className="flex flex-wrap gap-1">
                        {formData.leaders.map(id => (
                          <div key={id} className="text-[7px] bg-delos-amber text-delos-black px-2 py-1 font-black">
                            {companyMembers.find(m => m.id === id)?.profile_name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BOX MEMBROS */}
                    <div className="border border-white/10 p-4 space-y-4 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase flex items-center gap-1"><UserPlus size={10} /> Operacionais</span>
                        <span className="text-[8px] text-white/40">[{formData.members.length}]</span>
                      </div>
                      <button
                        onClick={() => setShowMemberSelector({ type: 'members', open: true })}
                        className="w-full py-2 bg-white/10 hover:bg-white hover:text-delos-black text-[8px] font-black uppercase tracking-widest transition-all"
                      >
                        Vincular_Host
                      </button>
                      <div className="flex flex-wrap gap-1">
                        {formData.members.slice(0, 3).map(id => (
                          <div key={id} className="text-[7px] bg-white/20 px-2 py-1 italic font-medium">
                            {companyMembers.find(m => m.id === id)?.profile_name}
                          </div>
                        ))}
                        {formData.members.length > 3 && <span className="text-[7px] text-white/40">...</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-delos-grey uppercase tracking-widest">Diretiva_de_Operação</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 p-4 text-[10px] uppercase font-medium outline-none focus:border-delos-amber text-white/80 resize-none"
                  />
                </div>

                <button onClick={handleSave} className="w-full bg-delos-amber text-delos-black py-6 font-black text-sm uppercase tracking-[0.5em] hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3">
                  <Save size={18} /> Executar_Sincronização_Delta
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-delos-black/5 p-12 text-center space-y-4 group">
              <div className="relative">
                <ShieldAlert size={60} className="text-delos-black/10 group-hover:text-delos-amber/20 transition-colors" />
                <Activity size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-delos-black/20 animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-delos-black/30 max-w-xs leading-relaxed">
                Aguardando_Seleção_de_Nó // Permissão de Nível Super_Admin requerida para manipulação de estrutura.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* SELECTOR OVERLAY (ESTILO CONSOLE) */}
      {showMemberSelector.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-delos-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-delos-surface text-delos-black w-full max-w-2xl border-4 border-delos-black shadow-[20px_20px_0px_rgba(0,0,0,1)]">
            <div className="bg-delos-black text-delos-surface p-4 flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest">Assign_{showMemberSelector.type} // Database_Query</span>
              <X className="cursor-pointer hover:text-delos-amber" onClick={() => setShowMemberSelector({ ...showMemberSelector, open: false })} />
            </div>

            <div className="p-6 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-delos-grey" size={16} />
                <input
                  autoFocus
                  placeholder="Pesquisar_Host..."
                  className="w-full pl-12 pr-4 py-4 bg-delos-black/5 border-2 border-delos-black outline-none font-black text-xs uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredMembers.map(member => (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member.id, showMemberSelector.type)}
                    className={`p-4 border-2 flex items-center justify-between cursor-pointer transition-all ${formData[showMemberSelector.type].includes(member.id)
                      ? 'bg-delos-black text-white border-delos-black'
                      : 'border-delos-black/10 hover:border-delos-black'
                      }`}
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter">{member.profile_name}</p>
                      <p className="text-[7px] uppercase opacity-60 italic">{member.role}</p>
                    </div>
                    {formData[showMemberSelector.type].includes(member.id) && <Activity size={14} className="text-delos-amber" />}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowMemberSelector({ ...showMemberSelector, open: false })}
                className="w-full bg-delos-black text-white py-4 font-black uppercase text-xs tracking-[0.4em] hover:bg-delos-amber hover:text-black transition-all"
              >
                Confirmar_Seleção
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}