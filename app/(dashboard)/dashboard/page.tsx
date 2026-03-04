import { FileText, Clock, CheckCircle2, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import PostJobModal from "@/components/Modal/PostJobModal";

// Simulação de busca de dados no Servidor (Substitua por sua chamada de API/DB)
async function getDashboardData() {
  // const res = await fetch('...', { next: { revalidate: 60 } });
  return {
    stats: [
      { label: "Candidaturas", value: "12", icon: <FileText className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
      { label: "Em análise", value: "05", icon: <Clock className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50" },
      { label: "Aprovado", value: "02", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    ],
    activities: [
      { id: 1, role: "UX Designer Senior", company: "Google Inc", time: "há 2 dias", initial: "UX" },
      { id: 2, role: "Frontend Developer", company: "Meta", time: "há 3 dias", initial: "FD" },
    ]
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const data = await getDashboardData();

  const isPostJobOpen = searchParams.newJob === "true";

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* HEADER COM BOTÃO DE AÇÃO */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-2">Acompanhe suas oportunidades em tempo real.</p>
        </div>

        <Link
          href="?newJob=true"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Postar Nova Vaga</span>
        </Link>
      </section>

      {/* GRID DE STATS (SKELETON-READY) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.stats.map((item, i) => (
          <div key={i} className="group bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ATIVIDADES RECENTES */}
      <section className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <h3 className="font-bold text-slate-900">Atividades Recentes</h3>
          </div>
          <Link href="/painel/minhas-vagas" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 tracking-widest uppercase">
            Ver Todas
          </Link>
        </div>

        <div className="divide-y divide-slate-50">
          {data.activities.length > 0 ? (
            data.activities.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex w-14 h-14 bg-slate-100 group-hover:bg-white border border-transparent group-hover:border-slate-200 rounded-2xl items-center justify-center text-slate-500 font-black text-xs transition-all">
                    {job.initial}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                      {job.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-500">{job.company}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-xs text-slate-400">{job.time}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Nenhuma atividade registrada.</p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL (Controlado pela URL) */}
      {/* Nota: O Modal precisa ser 'use client' internamente. 
        Ao clicar em fechar, ele deve navegar de volta para '/dashboard'
      */}
      <PostJobModal
        isOpen={isPostJobOpen}
      />

    </div>
  );
}