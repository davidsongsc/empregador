"use client";

import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Briefcase,
  Terminal,
  Activity,
  Layers
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 sm:p-10 font-sans text-slate-400">
      
      {/* VESTÍGIO ANALÓGICO GLOBAL */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* HEADER: Visão de Patrimônio Delos Style */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-amber-600" />
            <span className="text-[9px] font-black tracking-[0.4em] text-slate-600 uppercase">Board_Governance_Protocol</span>
          </div>
          <h1 className="text-4xl font-light text-white tracking-tighter uppercase">
            Equity <span className="font-black italic">Control</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Majoritário: <span className="text-amber-600 font-black">55% Shareholder Access</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="bg-[#141414] border border-white/5 px-6 py-3 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-600/30" />
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 group-hover:text-amber-600 transition-colors">Estimated_Valuation (5x)</p>
            <p className="text-xl font-mono font-black text-white italic">R$ 4.110.000,00<span className="text-[10px] opacity-30 ml-1">.nx</span></p>
          </div>
          
          <button className="bg-white text-black px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-3 group">
            <ShieldCheck size={16} className="group-hover:rotate-12 transition-transform" />
            Term_Sheet.pdf
          </button>
        </div>
      </header>

      {/* GRID DE KPIs FINANCEIROS - Alta Densidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 border border-white/5 mb-12 shadow-2xl">
        
        <div className="bg-[#111] p-8 group hover:bg-[#141414] transition-colors relative">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 border border-white/5 text-emerald-500"><DollarSign size={20}/></div>
            <span className="flex items-center text-emerald-500 text-[10px] font-mono font-bold tracking-tighter">MRR_FLOW <ArrowUpRight size={12}/></span>
          </div>
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Faturamento_Bruto</p>
          <p className="text-3xl font-light text-white tracking-tighter italic">R$ 9.200,00</p>
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 group-hover:w-full transition-all duration-700" />
        </div>

        <div className="bg-[#111] p-8 group hover:bg-[#141414] transition-colors relative">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 border border-white/5 text-amber-600"><TrendingUp size={20}/></div>
            <span className="text-slate-500 text-[9px] font-mono italic">Target: 40_Units</span>
          </div>
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Conversão_Sincronizada</p>
          <p className="text-3xl font-light text-white tracking-tighter italic">12.5%</p>
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-600 group-hover:w-full transition-all duration-700" />
        </div>

        <div className="bg-[#111] p-8 group hover:bg-[#141414] transition-colors relative">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 border border-white/5 text-rose-600"><Activity size={20}/></div>
            <span className="text-rose-600/50 text-[10px] font-mono">DANGER_ZONE</span>
          </div>
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Burn_Rate (Custos)</p>
          <p className="text-3xl font-light text-white tracking-tighter italic">R$ 2.500,00</p>
          <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-rose-600 group-hover:w-full transition-all duration-700" />
        </div>

        <div className="bg-[#181818] p-8 border-l border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers size={80} className="text-amber-600" />
          </div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-600 text-black shadow-[0_0_15px_rgba(217,119,6,0.3)]"><PieChartIcon size={20}/></div>
          </div>
          <p className="text-amber-600/60 text-[9px] font-black uppercase tracking-widest mb-1 font-mono">Pró-labore + Dividends</p>
          <p className="text-3xl font-black text-white tracking-tighter italic">R$ 4.551,40</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 shadow-2xl bg-white/5 border border-white/5">
        
        {/* CAP TABLE - Estilo Dossiê Militar */}
        <div className="lg:col-span-1 bg-[#111] p-10 border-r border-white/5">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-4 bg-amber-600" />
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Cap_Table & Asset_Dist</h3>
          </div>

          <div className="space-y-[1px] bg-white/5">
            <div className="flex justify-between items-center p-5 bg-[#161616] group hover:bg-black transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-amber-600/40 text-amber-600 flex items-center justify-center font-mono text-[10px] bg-amber-600/5">CEO</div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-wider">Você (Operator)</p>
                  <p className="text-[8px] text-slate-600 font-mono uppercase">Equity_Node: 55%</p>
                </div>
              </div>
              <p className="text-xs font-mono font-black text-amber-500">R$ 1.951,40</p>
            </div>

            {['Sócio A', 'Sócio B', 'Sócio C'].map((socio) => (
              <div key={socio} className="flex justify-between items-center p-5 bg-[#111] hover:bg-[#141414] transition-all border-b border-white/5 last:border-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/5 text-slate-700 flex items-center justify-center font-mono text-[10px]">15%</div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{socio}</p>
                </div>
                <p className="text-xs font-mono font-bold text-slate-200">R$ 532,20</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-amber-600/5 border border-amber-600/20 relative">
            <div className="absolute top-0 right-0 p-2"><Activity size={10} className="text-amber-600 animate-pulse" /></div>
            <p className="text-[8px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">⚠️ Vesting_Cliff_Alert</p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono italic">
              Sócios capitalistas: 18 meses remanescentes para desbloqueio de nodes secundários.
            </p>
          </div>
        </div>

        {/* FUNIL SAAS - Monitor de Fluxo */}
        <div className="lg:col-span-2 bg-[#111] p-10 flex flex-col">
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
            <div className="flex flex-col">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Subscription_Funnel</h3>
              <span className="text-[7px] font-mono text-slate-600 uppercase">Live Feed // Status: Active</span>
            </div>
            <div className="flex gap-4">
              <button className="text-[8px] font-black text-slate-500 hover:text-amber-600 uppercase tracking-widest border border-white/10 px-3 py-1.5 transition-all">Export_Data</button>
              <button className="text-[8px] font-black text-slate-500 hover:text-amber-600 uppercase tracking-widest border border-white/10 px-3 py-1.5 transition-all">Filters.sh</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/5 border border-white/5 mb-12">
             {[
               { label: 'Start', val: '22', color: 'text-slate-400' },
               { label: 'Business', val: '12', color: 'text-amber-600' },
               { label: 'Premium', val: '04', color: 'text-white' },
               { label: 'Partner', val: '02', color: 'text-amber-500 shadow-[0_0_10px_#d97706]' }
             ].map((stat, i) => (
               <div key={i} className="bg-[#161616] p-6 text-center group hover:bg-black transition-all">
                  <p className={`text-[8px] font-black uppercase tracking-[0.3em] mb-2 ${stat.color} opacity-60`}>{stat.label}</p>
                  <p className={`text-3xl font-light font-mono italic ${stat.color}`}>{stat.val}</p>
               </div>
             ))}
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-4">
            <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mb-4 border-l-2 border-amber-600/40 pl-3">Recent_Event_Logs</h4>
            {[
              { event: 'New Subscription: Business', client: 'Agência Prime Eventos', time: '2H_AGO', icon: <Briefcase size={12}/> },
              { event: 'Tier Upgrade: Premium', client: 'Produções Rio', time: '5H_AGO', icon: <TrendingUp size={12}/> },
              { event: 'Annual Renewal: Staff', client: 'Staff Elite SP', time: '1D_AGO', icon: <Calendar size={12}/> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#141414] hover:bg-[#181818] border border-white/[0.03] group transition-all cursor-crosshair">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-black border border-white/10 text-slate-600 group-hover:text-amber-600 transition-colors">{item.icon}</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-200 uppercase tracking-tighter group-hover:text-amber-500 transition-colors">{item.event}</p>
                    <p className="text-[9px] text-slate-600 font-mono italic">{item.client}</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-slate-700 group-hover:text-amber-600/60">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* FOOTER HUD */}
      <footer className="mt-8 flex justify-between items-center text-[8px] font-mono text-slate-800 uppercase tracking-widest px-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-4">
          <span>Grid_Stable: 100%</span>
          <span className="text-emerald-900">Encrypted_Board_Link</span>
        </div>
        <div className="italic">Analysis: Revenue stream healthy. Expansion advised.</div>
      </footer>
    </div>
  );
}