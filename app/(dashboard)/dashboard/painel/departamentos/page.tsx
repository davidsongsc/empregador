"use client";

import { useEffect, useState } from "react";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { 
  Layers, Plus, Trash2, Edit3, Save, X, ChevronRight, 
  Terminal, Activity, Database, ShieldAlert, Users, 
  Star, UserPlus, Fingerprint 
} from "lucide-react";
import { getActiveMembership } from "@/utils/userHelpers";
import { toast } from "@/components/Notification";

export default function DepartmentsPage() {
  const companyId = getActiveMembership()?.id;
  const { departments, loading, fetchDepartments, addDepartment, updateDepartment, removeDepartment } = useDepartmentStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    parent: "",
    leaders: [] as number[], // IDs dos líderes
    members: [] as number[]  // IDs dos membros
  });

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateDepartment(editingId, formData);
        setEditingId(null);
      } else {
        await addDepartment({ ...formData, company: companyId });
        setIsAdding(false);
      }
      setFormData({ name: "", description: "", parent: "", leaders: [], members: [] });
    } catch (e) {
      toast.error("FAIL: Erro na sincronização do nó.");
    }
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-12 space-y-12 font-mono text-delos-black bg-delos-surface transition-colors duration-500">
      
      {/* GRID DECORATIVO DLS */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] -z-10" style={{
          backgroundImage: `linear-gradient(var(--delos-amber) 1px, transparent 1px), linear-gradient(90deg, var(--delos-amber) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
      }} />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-delos-grey/20 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-delos-amber animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-delos-grey">Unit_Hierarchy_Management</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            Nós_de_<span className="text-delos-amber">Estrutura</span>
          </h1>
        </div>

        {!isAdding && !editingId && (
          <button onClick={() => setIsAdding(true)} className="bg-delos-black text-delos-surface px-10 py-5 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3 hover:bg-delos-amber transition-all shadow-2xl">
            <Plus size={18} /> Inject_New_Node
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LISTA DE NÓS (MANTÉM IGUAL) */}
        <main className="lg:col-span-6 space-y-4">
          {/* ... Iteração dos departamentos ... */}
          {departments.map((dept) => (
            <div key={dept.id} className={`p-6 flex items-center justify-between group border border-transparent ${editingId === dept.id ? 'bg-delos-amber/5 border-delos-amber/20 border-l-4 border-l-delos-amber' : 'hover:bg-delos-black/[0.02]'}`}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-delos-black text-delos-surface flex items-center justify-center font-black">
                        {dept.parent ? <ChevronRight size={14} className="text-delos-amber" /> : <Fingerprint size={14} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter">{dept.name}</h3>
                        <p className="text-[7px] text-delos-grey uppercase tracking-widest mt-1">Hosts: {dept.members_count || 0} // Lvl: {dept.parent ? 'Branch' : 'Root'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => startEdit(dept)} className="p-2 hover:text-delos-amber transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => removeDepartment(dept.id)} className="p-2 hover:text-delos-red transition-colors"><Trash2 size={16} /></button>
                </div>
            </div>
          ))}
        </main>

        {/* CONSOLE DE EDIÇÃO (LADO DIREITO - OPOSIÇÃO TOTAL) */}
        <aside className="lg:col-span-6">
          {(isAdding || editingId) ? (
            <section className="bg-delos-black text-delos-surface p-8 space-y-8 shadow-2xl relative border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-delos-amber" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">{editingId ? "Node_Modification" : "Initial_Injection"}</h2>
                </div>
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-white/40 hover:text-white"><X size={18} /></button>
              </div>

              {/* DADOS BÁSICOS */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[7px] font-black text-white/40 uppercase tracking-widest">Label_Nó</label>
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase outline-none focus:border-delos-amber text-delos-surface" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[7px] font-black text-white/40 uppercase tracking-widest">Parent_Node</label>
                        <select value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 text-xs font-black uppercase outline-none focus:border-delos-amber text-delos-surface">
                            <option value="" className="bg-delos-black">TOP_LEVEL</option>
                            {departments.filter(d => d.id !== editingId).map(d => <option key={d.id} value={d.id} className="bg-delos-black">{d.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* GESTÃO DE HOSTS (LÍDERES E MEMBROS) */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-delos-amber" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Host_Assignment</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Box Líderes */}
                        <div className="bg-white/5 p-4 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[7px] font-black uppercase text-delos-amber flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> Leaders
                                </span>
                                <span className="text-[7px] opacity-30 italic">{formData.leaders.length}/3</span>
                            </div>
                            <button className="w-full py-2 bg-white/5 border border-dashed border-white/20 text-[8px] font-black uppercase tracking-widest hover:bg-delos-amber hover:text-delos-black transition-all">
                                <Plus size={10} className="inline mr-1" /> Assign_Leader
                            </button>
                        </div>

                        {/* Box Membros */}
                        <div className="bg-white/5 p-4 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[7px] font-black uppercase text-white/60 flex items-center gap-1">
                                    <Users size={10} /> Members
                                </span>
                                <span className="text-[7px] opacity-30 italic">{formData.members.length} Hosts</span>
                            </div>
                            <button className="w-full py-2 bg-white/5 border border-dashed border-white/20 text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-delos-black transition-all">
                                <UserPlus size={10} className="inline mr-1" /> Sync_Host
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[7px] font-black text-white/40 uppercase tracking-widest">Node_Directive (Description)</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-white/5 border border-white/10 p-4 text-[10px] uppercase font-medium outline-none focus:border-delos-amber text-delos-surface resize-none" />
                </div>

                <button onClick={handleSave} className="w-full bg-delos-amber text-delos-surface py-5 font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-delos-black transition-all shadow-xl">
                  <Save size={16} className="inline mr-3" /> Commit_Changes
                </button>
              </div>
            </section>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-delos-grey/10 text-center space-y-6 opacity-40 italic">
              <ShieldAlert size={40} className="text-delos-amber" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em]">Selecione um nó de setor para modificar<br />ou gerenciar o roster de hosts.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}