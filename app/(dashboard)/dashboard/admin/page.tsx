import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  Briefcase
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans ">
      
      {/* HEADER: Visão de Patrimônio */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Governance Dashboard</h1>
          <p className="text-slate-500 font-medium">Controle Acionário: <span className="text-indigo-600 font-bold">55% (Sócio Majoritário)</span></p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase">Valuation Estimado (5x)</p>
            <p className="text-lg font-black text-slate-900">R$ 4.110.000,00</p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-400" />
            Term Sheet
          </button>
        </div>
      </header>

      {/* GRID DE KPIs FINANCEIROS (Fase de Validação: 40 Clientes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={24}/></div>
            <span className="flex items-center text-green-500 text-xs font-bold">MRR <ArrowUpRight size={14}/></span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Faturamento Bruto</p>
          <p className="text-2xl font-black text-slate-900">R$ 9.200,00</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><TrendingUp size={24}/></div>
            <span className="text-indigo-500 text-xs font-bold italic">Meta: 40 Unidades</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Taxa de Conversão</p>
          <p className="text-2xl font-black text-slate-900">12.5%</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><ArrowDownRight size={24}/></div>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase">Burn Rate (Custos)</p>
          <p className="text-2xl font-black text-slate-900">R$ 2.500,00</p>
        </div>

        <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-lg shadow-indigo-200 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-2xl"><PieChartIcon size={24}/></div>
          </div>
          <p className="text-indigo-100 text-xs font-bold uppercase">Seu Pró-labore + Lucro</p>
          <p className="text-2xl font-black">R$ 4.551,40</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DISTRIBUIÇÃO DE DIVIDENDOS (CAP TABLE) */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6">Cap Table & Dividendos</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs">CEO</div>
                <div>
                  <p className="text-sm font-black">Você</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Equity: 55%</p>
                </div>
              </div>
              <p className="text-sm font-black text-indigo-600">R$ 1.951,40</p>
            </div>

            {['Sócio A', 'Sócio B', 'Sócio C'].map((socio) => (
              <div key={socio} className="flex justify-between items-center p-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs">15%</div>
                  <p className="text-sm font-bold text-slate-700">{socio}</p>
                </div>
                <p className="text-sm font-bold text-slate-900">R$ 532,20</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-[10px] font-black text-amber-700 uppercase mb-1">⚠️ Alerta de Vesting</p>
            <p className="text-xs text-amber-800 leading-tight font-medium">Os sócios capitalistas possuem 18 meses restantes para o cliff de vesting total.</p>
          </div>
        </div>

        {/* OPERAÇÃO SAAS - STATUS DOS CLIENTES */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Funil de Assinaturas</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold">Exportar CSV</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold">Filtros</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="text-center">
                  <p className="text-slate-400 text-[10px] font-black uppercase">Start</p>
                  <p className="text-xl font-black">22</p>
               </div>
               <div className="text-center border-x border-slate-100">
                  <p className="text-indigo-600 text-[10px] font-black uppercase">Business</p>
                  <p className="text-xl font-black text-indigo-600">12</p>
               </div>
               <div className="text-center">
                  <p className="text-purple-600 text-[10px] font-black uppercase">Premium</p>
                  <p className="text-xl font-black text-purple-600">4</p>
               </div>
               <div className="text-center border-l border-slate-100">
                  <p className="text-amber-600 text-[10px] font-black uppercase">Partner</p>
                  <p className="text-xl font-black text-amber-600">2</p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Atividades Recentes</h4>
              {[
                { event: 'Nova Assinatura Business', client: 'Agência Prime Eventos', time: 'Há 2h', icon: <Briefcase size={14}/> },
                { event: 'Upgrade para Premium', client: 'Produções Rio', time: 'Há 5h', icon: <TrendingUp size={14}/> },
                { event: 'Renovação Anual', client: 'Staff Elite SP', time: 'Há 1 dia', icon: <Calendar size={14}/> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg text-slate-400">{item.icon}</div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{item.event}</p>
                      <p className="text-xs text-slate-500">{item.client}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}