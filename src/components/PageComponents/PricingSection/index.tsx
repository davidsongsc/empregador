'use client';

import { Check, Zap, ArrowRight, Star, Loader2, Lock, Terminal, Activity, HelpCircle, ListChecks } from "lucide-react";
import { useEffect } from "react";
import { useAdminSubscriptionStore } from "@/store/useAdminSubscriptionStore";

const SubscriptionCard = ({ sub }: { sub: any }) => {
  // Mapeamento de cores baseado no color_theme do banco
  const getThemeStyles = (theme: string) => {
    const styles: Record<string, any> = {
      purple: { border: 'border-purple-500', shadow: 'shadow-purple-100', text: 'text-purple-600', bg: 'bg-purple-50' },
      indigo: { border: 'border-indigo-500', shadow: 'shadow-indigo-100', text: 'text-indigo-600', bg: 'bg-indigo-50' },
      emerald: { border: 'border-emerald-500', shadow: 'shadow-emerald-100', text: 'text-emerald-600', bg: 'bg-emerald-50' },
      amber: { border: 'border-amber-500', shadow: 'shadow-amber-100', text: 'text-amber-600', bg: 'bg-amber-50' },
      slate: { border: 'border-slate-400', shadow: 'shadow-slate-100', text: 'text-slate-600', bg: 'bg-slate-50' },
    };
    return styles[theme] || styles.slate;
  };

  const theme = getThemeStyles(sub.color_theme);

  return (
    <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:scale-[1.02] flex flex-col h-full ${
      sub.is_active ? `${theme.border} ${theme.shadow} shadow-2xl` : 'border-rose-200 grayscale-[0.5] opacity-80'
    }`}>
      
      {/* BADGE DE STATUS */}
      <div className={`absolute -top-4 left-8 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg ${
        sub.is_active ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
      }`}>
        {sub.is_active ? <><Check size={10} /> Ativo</> : <><Lock size={10} /> Expirado</>}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-start">
          <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest mb-1 font-mono">
            Node_ID: {sub.id?.slice(0, 8)}
          </p>
          {sub.is_popular && (
            <div className="flex items-center gap-1 bg-amber-100 text-amber-600 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter">
              <Star size={8} fill="currentColor" /> High_Demand
            </div>
          )}
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 truncate uppercase italic leading-none mb-1">
          {sub.name}
        </h3>
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-4">
          {sub.foco || "Unidade_Operacional"}
        </p>
        
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 italic border-l-2 border-slate-100 pl-3">
          {sub.description || "Nenhuma diretriz operacional definida para este protocolo."}
        </p>
      </div>

      {/* METRICAS DE QUOTA */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Colaboradores</p>
          <p className="text-sm font-bold text-slate-700">{sub.max_collaborators || '0'} <span className="text-[9px] opacity-50">Units</span></p>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl border border-black/5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Publicações</p>
          <p className="text-sm font-bold text-slate-700">{sub.max_active_jobs || '0'} <span className="text-[9px] opacity-50">Slots</span></p>
        </div>
      </div>

      {/* FEATURES LIST (Array do JSON) */}
      {sub.features && sub.features.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <ListChecks size={10} /> Protocol_Privileges
          </p>
          <div className="flex flex-wrap gap-1">
            {sub.features.map((feat: string, i: number) => (
              <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-black/5 uppercase">
                {feat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PROTOCOLO INFO */}
      <div className="mt-auto mb-6 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-black/5">
        <Terminal size={14} className="text-gray-400" />
        <div>
          <p className="text-[8px] font-black text-gray-400 uppercase leading-none">Mainframe_Alias</p>
          <p className={`text-xs font-black uppercase ${theme.text}`}>{sub.plan_name}</p>
        </div>
      </div>

      {/* TEMPO RESTANTE */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 relative overflow-hidden group/metric">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase">Tempo_Restante</span>
            <span className={`text-xl font-black italic mt-1 ${sub.days_until_expiration > 5 ? 'text-gray-900' : 'text-rose-600 animate-pulse'}`}>
              {sub.days_until_expiration}D
            </span>
          </div>
          <Activity size={24} className={`opacity-10 transition-transform group-hover/metric:scale-110 ${sub.is_active ? 'text-emerald-600' : 'text-rose-600'}`} />
        </div>
      </div>

      <button className={`w-full py-4 rounded-2xl font-black text-[10px] transition-all uppercase tracking-[0.3em] shadow-md active:scale-95 ${
        sub.is_active ? 'bg-gray-900 text-white hover:bg-black' : 'bg-rose-600 text-white hover:bg-rose-700'
      }`}>
        {sub.is_active ? 'Acessar_Mainframe' : 'Reativar_Protocolo'}
      </button>
    </div>
  );
};

export default function PricingSection() {
  const { subscriptions, loading, fetchSubscriptions, lastUpdate } = useAdminSubscriptionStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  if (loading && subscriptions.length === 0) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-amber-600" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Decrypting_Node_Data...</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest">
            <Activity size={12} className="animate-pulse" /> Live_Registry_Monitor
          </div>
          <h2 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">Status de Assinaturas</h2>
          <p className="text-gray-500 max-w-xl mx-auto font-medium uppercase text-xs tracking-widest">Controle de licenças operacionais FreelaCerto.</p>
          {lastUpdate && (
            <p className="text-[9px] font-mono text-gray-400 uppercase italic">Sincronizado: {new Date(lastUpdate).toLocaleTimeString()}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subscriptions.map((sub: any) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>

        <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle size={120} /></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-amber-400 text-[10px] font-black uppercase">Manual_Override</div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Intervenção de Sistema</h2>
              <p className="text-slate-400 font-medium text-sm">Resincronize os protocolos `is_active` caso o heartbeat da unidade apresente latência crítica com o banco de dados da Matriz.</p>
            </div>
            <button onClick={() => fetchSubscriptions()} className="flex items-center gap-3 text-white font-black group text-[10px] uppercase tracking-widest border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all">
              Forçar_Sincronização <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}