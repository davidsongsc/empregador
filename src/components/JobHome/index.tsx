"use client"

import { useState, useMemo, useEffect } from "react"
import {
  MapPin,
  CheckCircle2,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  CircleDollarSign
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobApplyModal from "../JobApplyModal";
import JobDetailsModal from "../JobsDetailsModal";
import AdBanner from "../AdBanner";
import SkeletonJob from "../Loading";

const PAGE_SIZE = 10;

const JobHome = () => {
  const [openApply, setOpenApply] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const { jobs, loading, error } = useJobs(currentPage);

  const paginatedJobs = useMemo(() => {
    if (!jobs) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return jobs.slice(start, start + PAGE_SIZE);
  }, [currentPage, jobs]);

  const totalPages = useMemo(() => jobs ? Math.ceil(jobs.length / PAGE_SIZE) : 0, [jobs]);

  // Sincronização de seleção de vaga
  useEffect(() => {
    if (paginatedJobs.length > 0 && !selectedJob) {
      setSelectedJob(paginatedJobs[0]);
    }
  }, [paginatedJobs, selectedJob]);

  // Handler de navegação para resetar scroll e seleção se necessário
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedJob(null); // Opcional: limpa seleção ao mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <SkeletonJob />;

  if (error || !jobs?.length) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {error ? "Ops! Ocorreu um erro" : "Nenhuma vaga disponível"}
        </h1>
        <p className="text-gray-500 max-w-xs mt-2">
          {error ? "Não conseguimos carregar as vagas. Tente novamente em instantes." : "No momento não temos vagas que coincidam com sua busca."}
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]"> {/* Fundo levemente acinzentado para destacar os cards brancos */}
      <main className="max-w-7xl mx-auto pt-24 pb-12 px-3 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Oportunidades <span className="text-indigo-600 font-black">2026</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl leading-relaxed">
            Conectamos você às melhores empresas. Processos simplificados e feedback em tempo real.
          </p>
        </header>

        <AdBanner dataAdSlot="1234567890" className="mb-2" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LADO ESQUERDO: LISTA */}
          <section className="lg:col-span-5 space-y-4 h-full">
            <div className="flex flex-col gap-3 sm:max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
              {paginatedJobs.map((job) => (
                <article
                  key={job.uid}
                  onClick={() => {
                    setSelectedJob(job);
                    if (window.innerWidth < 1024) setOpenDetailsModal(true);
                  }}
                  className={`relative group cursor-pointer border-2 rounded-2xl p-4 transition-all duration-200 ${
                    selectedJob?.uid === job.uid
                      ? "border-indigo-600 bg-white shadow-md ring-4 ring-indigo-50"
                      : "border-transparent bg-white hover:border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                      {job.tipo_vaga_display}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {job.cargo_exibicao}
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {job.endereco?.cidade || "Remoto"}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <CircleDollarSign className="w-3 h-3" />
                      {job.salario ? `R$ ${job.salario}` : "A combinar"}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação Mobile-Friendly */}
            <nav className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-20 transition-all cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Página {currentPage} de {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-20 transition-all cursor-pointer"
                aria-label="Próxima página"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </section>

          {/* LADO DIREITO: DETALHES (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-7 sticky top-28">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden h-[750px] flex flex-col">
              {!selectedJob ? (
                <div className="m-auto text-center p-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-medium">Selecione uma vaga para ver detalhes</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Header do Detalhe */}
                  <div className="p-8 border-b border-slate-50 bg-gradient-to-b from-slate-50/50 to-transparent">
                    <div className="flex gap-2 mb-4">
                      <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {selectedJob.tipo_vaga_display}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {selectedJob.role_details?.category || "Destaque"}
                      </span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedJob.cargo_exibicao}</h2>
                    <p className="text-lg text-slate-500 font-medium italic">{selectedJob.empresa_nome}</p>
                    
                    <button
                      onClick={() => setOpenApply(true)}
                      className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Candidatar-se Agora
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Conteúdo Scrollável */}
                  <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Jornada</span>
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                          <Clock className="w-4 h-4 text-indigo-500" /> {selectedJob.turno || "A definir"}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="block text-[9px] font-black text-slate-400 uppercase mb-1">Salário</span>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold">
                          {selectedJob.salario ? `R$ ${selectedJob.salario}` : "A combinar"}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-slate prose-sm max-w-none">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Sobre a vaga</h4>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                        {selectedJob.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer Info Cards */}
        <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           <InfoCard 
            icon={<GraduationCap className="text-white" />} 
            title="Cursos Gratuitos" 
            desc="Aprenda habilidades em alta no mercado." 
            bg="bg-indigo-600"
            buttonText="Explorar"
           />
           <InfoCard 
            icon={<Users className="text-orange-500" />} 
            title="Feirão Presencial 2026" 
            desc="Dia 25 de Março no Centro de Convenções." 
            label="Evento VIP"
           />
           <InfoCard 
            icon={<Briefcase className="text-emerald-500" />} 
            title="Guia de Currículos" 
            desc="Dicas práticas para dobrar suas chances." 
            link="Ler artigo"
           />
        </section>

      </main>

      <JobDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        job={selectedJob}
        onApply={() => { setOpenDetailsModal(false); setOpenApply(true); }}
      />

      <JobApplyModal
        open={openApply}
        onClose={() => setOpenApply(false)}
        job={selectedJob}
      />
    </div>
  );
};

// Componente Interno para os Cards de Conteúdo (Reutilização e Limpeza)
const InfoCard = ({ icon, title, desc, bg = "bg-white", buttonText, label, link }: any) => (
  <div className={`${bg} ${bg === 'bg-white' ? 'border border-slate-200' : 'text-white'} p-6 rounded-2xl shadow-sm transition-transform hover:-translate-y-1`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${bg === 'bg-white' ? 'bg-slate-50' : 'bg-white/20'}`}>
      {icon}
    </div>
    <h3 className="font-bold mb-1">{title}</h3>
    <p className={`text-sm mb-4 ${bg === 'bg-white' ? 'text-slate-500' : 'text-indigo-100'}`}>{desc}</p>
    {buttonText && <button className="text-xs font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 cursor-pointer">{buttonText}</button>}
    {label && <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-2 py-1 rounded-md">{label}</span>}
    {link && <button className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer">{link} <ArrowRight className="w-3 h-3"/></button>}
  </div>
);

export default JobHome;