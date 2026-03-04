import { FileText, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    { label: "Candidaturas", value: "12", icon: <FileText className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Em análise", value: "05", icon: <Clock className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50" },
    { label: "Aprovado", value: "02", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
  ]

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Olá, João Silva 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Acompanhe suas oportunidades em tempo real.</p>
      </section>

      {/* GRID DE CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${item.bg}`}>{item.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ATIVIDADES RECENTES */}
      <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Atividades Recentes</h3>
          <Link href="/painel/minhas-vagas" className="text-xs font-black text-indigo-600 hover:underline">VER TUDO</Link>
        </div>
        
        <div className="divide-y divide-slate-50">
          {[1, 2].map((id) => (
            <div key={id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-12 h-12 bg-slate-100 rounded-xl items-center justify-center text-slate-400 font-bold">
                  {id === 1 ? "UX" : "DV"}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">
                    {id === 1 ? "UX Designer Senior" : "Desenvolvedor Frontend"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Google Inc • há 2 dias</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}