"use client";

import { useEffect, useMemo } from "react";
import {
  Plus, Trash2, RefreshCw, Clock, Users, Layers, Lock,
  Star, Palette, ListChecks, Target,
  Zap,
  Terminal
} from "lucide-react";
import { useAdminPlanStore } from "@/store/useAdminPlanStore";
import { Plan, adminPlanService } from "@/services/adminPlanService";
import { debounce } from "lodash";
import { toast } from "@/components/Notification";
import FeatureManager from "@/components/MiniComponents/FeatureManager";

export default function AdminPlanPage() {
  const { plans, loading, fetchPlans, updatePlan, addPlan } = useAdminPlanStore();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const debouncedSync = useMemo(
    () => debounce((id: string, data: Partial<Plan>) => {
      updatePlan(id, data);
    }, 1000),
    [updatePlan]
  );

  const handleInputChange = (id: string, field: keyof Plan, value: any, isActive: boolean) => {
    if (isActive) {
      toast.error("PROTOCOL_LOCKED: Desative para editar.");
      return;
    }
    debouncedSync(id, { [field]: value });
  };

  const handleDelete = async (id: string, isActive: boolean) => {
    if (isActive) {
      toast.error("TERMINATION_DENIED: Protocolo em uso.");
      return;
    }
    if (confirm("CONFIRM_TERMINATION: Deseja apagar este protocolo?")) {
      const ok = await adminPlanService.deletePlan(id);
      if (ok) {
        toast.success("NODE_TERMINATED.");
        fetchPlans();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--delos-surface)] p-4 md:p-10 font-mono">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 border-b border-[var(--delos-border)] pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[var(--delos-amber)] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.5em] text-[var(--delos-grey)] uppercase">Mainframe_Control</span>
          </div>
          <h1 className="text-6xl font-black text-[var(--delos-black)] tracking-tighter uppercase italic leading-none">
            Node <span className="font-light opacity-50 not-italic text-[var(--delos-grey)]">Architect</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => addPlan({ name: "NEW_PROTOCOL", price: 0, is_active: false })}
            className="bg-[var(--delos-black)] text-[var(--delos-surface)] px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[var(--delos-amber)] transition-all shadow-2xl active:scale-95"
          >
            <Plus size={14} /> Initialize_Node
          </button>
          <button onClick={() => fetchPlans()} className="border border-[var(--delos-border)] px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync_Grid
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {Array.isArray(plans) && plans.map((plan) => (
          <PlanCard
            key={plan?.id}
            plan={plan}
            onChange={handleInputChange}
            onDelete={handleDelete}
            onToggleStatus={(id: string, status: boolean) => updatePlan(id, { is_active: status })}
          />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, onChange, onDelete, onToggleStatus }: any) {
  const isLocked = plan?.is_active ?? false;
  const planId = plan?.id ?? "";

  // Mapeamento de cores para o preview lateral
  const themeColors: any = {
    slate: 'bg-slate-500',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div className={`bg-white border border-[var(--delos-border)] p-10 relative group transition-all duration-500 ${isLocked ? 'opacity-80 grayscale-[0.3]' : 'shadow-2xl'}`}>
      {/* LINHA DE COR DO TEMA */}
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] transition-colors duration-700 ${isLocked ? themeColors[plan.color_theme] || 'bg-amber-500' : 'bg-rose-500'}`} />

      <div className="space-y-6">
        {/* HEADER DO CARD */}
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2 py-1 bg-black/[0.03] border border-black/5">
                <Layers size={10} className="text-[var(--delos-amber)]" />
                <span className="text-[8px] font-black text-[var(--delos-grey)] uppercase">ID: {planId.slice(0, 8)}</span>
              </div>

              {/* TOGGLE POPULAR */}
              <button
                disabled={isLocked}
                onClick={() => onChange(planId, 'is_popular', !plan.is_popular, isLocked)}
                className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest px-2 py-1 border transition-all ${plan.is_popular ? 'bg-amber-500 text-white border-amber-600' : 'text-slate-400 border-slate-200 opacity-30 hover:opacity-100'}`}
              >
                <Star size={8} fill={plan.is_popular ? "white" : "none"} /> High_Demand
              </button>
            </div>

            <input
              disabled={isLocked}
              className="bg-transparent text-4xl font-black text-[var(--delos-black)] uppercase italic outline-none border-b-2 border-transparent focus:border-[var(--delos-amber)] w-full transition-all tracking-tighter"
              defaultValue={plan?.name}
              onChange={(e) => onChange(planId, 'name', e.target.value, isLocked)}
            />

            {/* NOVO: CAMPO FOCO */}
            <div className="flex items-center gap-2">
              <Target size={12} className="text-slate-400" />
              <input
                disabled={isLocked}
                placeholder="TARGET_SEGMENT (EX: PEQUENO OPERADOR)"
                className="bg-transparent text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] outline-none w-full"
                defaultValue={plan?.foco}
                onChange={(e) => onChange(planId, 'foco', e.target.value, isLocked)}
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <button onClick={() => onDelete(planId, isLocked)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
              <Trash2 size={16} />
            </button>
            <div className="text-right border-l-2 border-amber-500 pl-4 py-1">
              <span className="text-[7px] font-black text-[var(--delos-grey)] uppercase block mb-1">Pricing_Value</span>
              <div className="flex items-center gap-1 font-black text-[var(--delos-black)] italic leading-none">
                <span className="text-amber-500 text-xs">R$</span>
                <input
                  disabled={isLocked}
                  className="bg-transparent text-2xl outline-none w-28 text-right font-black"
                  defaultValue={plan?.price}
                  onChange={(e) => onChange(planId, 'price', e.target.value, isLocked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* GRIDE DE QUOTAS TÉCNICAS */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border border-slate-100`}>
          <MiniQuota disabled={isLocked} icon={<Users size={12} />} label="Hosts" value={plan?.max_collaborators} onChange={(v: number) => onChange(planId, 'max_collaborators', v, isLocked)} />
          <MiniQuota disabled={isLocked} icon={<Zap size={12} />} label="Slots" value={plan?.max_active_jobs} onChange={(v: number) => onChange(planId, 'max_active_jobs', v, isLocked)} />
          <MiniQuota disabled={isLocked} icon={<Clock size={12} />} label="TTL_Days" value={plan?.days_duration} onChange={(v: number) => onChange(planId, 'days_duration', v, isLocked)} />

          {/* SELETOR DE TEMA DE COR */}
          <div className="bg-white p-4 flex flex-col justify-center items-center gap-2 group/color relative">
            <span className="text-[7px] font-black uppercase text-slate-400">Node_Color</span>
            <select
              disabled={isLocked}
              value={plan.color_theme}
              onChange={(e) => onChange(planId, 'color_theme', e.target.value, isLocked)}
              className="text-[9px] font-black bg-transparent outline-none uppercase cursor-pointer text-center"
            >
              <option value="slate">Slate</option>
              <option value="indigo">Indigo</option>
              <option value="purple">Purple</option>
              <option value="amber">Amber</option>
              <option value="emerald">Emerald</option>
            </select>
          </div>
        </div>

        {/* DESCRIÇÃO E FEATURES */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* SUMÁRIO OPERACIONAL */}
          <div className="space-y-2">
            <span className="text-[7px] font-black uppercase text-slate-400 flex items-center gap-1">
              <Terminal size={10} /> Operation_Summary
            </span>
            <textarea
              disabled={isLocked}
              className="w-full bg-slate-50 border border-slate-100 p-4 text-[11px] font-mono text-slate-600 uppercase leading-relaxed outline-none focus:border-amber-500 transition-all resize-none"
              rows={6}
              defaultValue={plan?.description}
              onChange={(e) => onChange(planId, 'description', e.target.value, isLocked)}
            />
          </div>

          {/* NOVO GERENCIADOR DE FEATURES DINÂMICO */}
          <FeatureManager
            disabled={isLocked}
            features={plan?.features || []}
            onChange={(newFeatures) => onChange(planId, 'features', newFeatures, isLocked)}
          />
        </div>
        {/* STATUS FINAL */}
        <button
          onClick={() => onToggleStatus(planId, !isLocked)}
          className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] italic border-2 transition-all ${isLocked ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white'}`}
        >
          {isLocked ? 'OPERATIONAL_NODE_LOCKED' : 'OFFLINE_READY_FOR_DEPLOY'}
        </button>
      </div>
    </div>
  );
}

function MiniQuota({ icon, label, value, onChange, disabled }: any) {
  return (
    <div className="bg-white p-4 group/q hover:bg-slate-50 transition-all">
      <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover/q:text-amber-500 transition-colors">
        {icon}
        <span className="text-[7px] font-black uppercase tracking-tighter">{label}</span>
      </div>
      <input
        disabled={disabled}
        type="number"
        className="bg-transparent text-slate-900 font-black text-xl outline-none w-full"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}