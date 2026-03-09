"use client"

import { useState, useMemo, useEffect } from "react"
import {
  MapPin,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  CircleDollarSign,
  Binary,
  Target
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobApplyModal from "../JobApplyModal";
import JobDetailsModal from "../JobsDetailsModal";
import AdBanner from "../AdBanner";
import AuthLoadingScreen from "../AuthLoadingScreen";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "../Notification";

const PAGE_SIZE = 10;

const JobHome = () => {
  const [openApply, setOpenApply] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const { jobs, loading, error } = useJobs(currentPage);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const paginatedJobs = useMemo(() => {
    if (!jobs) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return jobs.slice(start, start + PAGE_SIZE);
  }, [currentPage, jobs]);

  const totalPages = useMemo(() => jobs ? Math.ceil(jobs.length / PAGE_SIZE) : 0, [jobs]);

  const handleApplyClick = (job: any) => {
    if (!isAuthenticated) {
      toast.error("Acesso restrito. Autenticação de Host necessária.");
      sessionStorage.setItem('pending_application_job_id', job.uid);
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    setSelectedJob(job);
    setOpenApply(true);
  };

  useEffect(() => {
    if (paginatedJobs.length > 0 && !selectedJob) {
      setSelectedJob(paginatedJobs[0]);
    }
  }, [paginatedJobs, selectedJob]);

  useEffect(() => {
    const pendingJobId = sessionStorage.getItem('pending_application_job_id');
    if (isAuthenticated && pendingJobId && jobs) {
      const jobToRestore = jobs.find((j: any) => j.uid === pendingJobId);
      if (jobToRestore) {
        setSelectedJob(jobToRestore);
        setOpenApply(true);
        sessionStorage.removeItem('pending_application_job_id');
        toast.success("Sincronização restaurada. Prossiga com o protocolo.");
      }
    }
  }, [isAuthenticated, jobs]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedJob(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <AuthLoadingScreen />;

  if (error || !jobs?.length) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-[#FDFDFD]">
        <div className="bg-black p-5 rounded-3xl mb-6 shadow-xl shadow-gray-200">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-black text-black uppercase italic tracking-tighter">
          {error ? "Falha no Sistema" : "Nenhum Host Detectado"}
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4 max-w-xs">
          {error ? "Erro na sincronização de dados. Tente novamente." : "Não existem vagas ativas para este protocolo de busca."}
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative">
      {/* Calibration Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }} />

      <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-8 relative z-10">

        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-amber-600 animate-pulse" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Protocolo_Ativo_2026</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-black uppercase italic tracking-tighter leading-none">
              Oportunidades <span className="text-gray-300">Hub</span>
            </h1>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] max-w-xl">
              Sincronização de talentos com unidades corporativas de alta performance.
            </p>
          </div>
          <div className="hidden md:block text-right">
             <span className="text-[10px] font-mono text-gray-300 uppercase">System Status: Optimal</span>
          </div>
        </header>

        <AdBanner dataAdSlot="1234567890" className="mb-8 rounded-3xl overflow-hidden grayscale opacity-50 hover:grayscale-0 transition-all" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LADO ESQUERDO: LISTA */}
          <section className="lg:col-span-4 space-y-6">
            <div className="flex flex-col gap-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
              {paginatedJobs.map((job) => (
                <article
                  key={job.uid}
                  onClick={() => {
                    setSelectedJob(job);
                    if (window.innerWidth < 1024) setOpenDetailsModal(true);
                  }}
                  className={`relative group cursor-pointer border-2 rounded-[28px] p-6 transition-all duration-500 ${selectedJob?.uid === job.uid
                    ? "border-black bg-white shadow-2xl shadow-gray-200 -translate-y-1"
                    : "border-gray-50 bg-white/50 hover:border-gray-200"
                    }`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] italic">
                      {job.tipo_vaga_display}
                    </span>
                    <h3 className="text-lg font-black text-black uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                      {job.cargo_exibicao}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-black" />
                      {job.endereco?.cidade || "Remoto"}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all ${selectedJob?.uid === job.uid ? 'text-black translate-x-0' : 'text-gray-200 -translate-x-2'}`} />
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação Estilo Delos */}
            <nav className="flex items-center justify-between bg-white px-6 py-4 rounded-[24px] border border-gray-100 shadow-sm">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-full hover:bg-gray-50 disabled:opacity-0 transition-all cursor-pointer border border-transparent hover:border-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-[10px] font-black text-black uppercase tracking-[0.3em] italic">
                Página {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full hover:bg-gray-50 disabled:opacity-0 transition-all cursor-pointer border border-transparent hover:border-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </section>

          {/* LADO DIREITO: DETALHES (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-8 sticky top-28">
            <div className="bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-gray-100 overflow-hidden h-[800px] flex flex-col relative group">
              
              {!selectedJob ? (
                <div className="m-auto text-center p-12">
                   <Binary className="w-16 h-16 text-gray-100 mx-auto mb-6 animate-pulse" />
                   <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">Selecione_Unidade_Host</p>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in duration-700">
                  {/* Header do Detalhe */}
                  <div className="p-12 border-b border-gray-50 bg-white relative">
                    <div className="flex gap-3 mb-8">
                      <span className="bg-black text-white text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest italic">
                        {selectedJob.tipo_vaga_display}
                      </span>
                      <span className="border-2 border-indigo-600 text-indigo-600 text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest italic">
                        {selectedJob.role_details?.category || "Tier_1"}
                      </span>
                    </div>
                    <h2 className="text-5xl font-black text-black uppercase italic tracking-tighter leading-none mb-4">
                      {selectedJob.cargo_exibicao}
                    </h2>
                    <p className="text-xl text-gray-400 font-black uppercase tracking-widest italic">{selectedJob.empresa_nome}</p>

                    <button
                      onClick={() => handleApplyClick(selectedJob)}
                      className="w-full mt-10 bg-black text-white py-6 rounded-[24px] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 group active:scale-95"
                    >
                      Sincronizar Protocolo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                    </button>
                  </div>

                  {/* Conteúdo Scrollável */}
                  <div className="flex-1 overflow-y-auto p-12 pt-8 custom-scrollbar bg-[#FAFAFA]/30">
                    <div className="grid grid-cols-2 gap-6 mb-12">
                      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Shift_Parameters</span>
                        <div className="flex items-center gap-3 text-black font-black uppercase italic text-sm">
                          <Clock className="w-5 h-5 text-indigo-600" /> {selectedJob.turno || "Full_Cycle"}
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Compensation_Value</span>
                        <div className="flex items-center gap-3 text-black font-black uppercase italic text-sm">
                          <CircleDollarSign className="w-5 h-5 text-amber-600" /> 
                          {selectedJob.salario ? `R$ ${selectedJob.salario}` : "Competitive_Market"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-5 h-5 text-black" />
                        <h4 className="text-[11px] font-black text-black uppercase tracking-[0.3em]">Especificações_Técnicas</h4>
                      </div>
                      <p className="text-gray-500 font-bold leading-relaxed text-base italic border-l-4 border-black pl-8 py-2">
                        {selectedJob.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer Info Cards - Estética Industrial */}
        <section className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard
            icon={<GraduationCap className="w-6 h-6 text-white" />}
            title="Skill Academy"
            desc="Sincronização de novas competências técnicas gratuitas."
            bg="bg-black"
            buttonText="ACESSAR_MÓDULO"
          />
          <InfoCard
            icon={<Users className="w-6 h-6 text-amber-600" />}
            title="Delos Fair 2026"
            desc="Evento presencial de recrutamento de hosts e talentos."
            label="DIAGNÓSTICO_PRESENCIAL"
            bg="bg-white"
          />
          <InfoCard
            icon={<Briefcase className="w-6 h-6 text-black" />}
            title="Guia de Perfil"
            desc="Otimize sua matriz de dados para atrair recrutadores."
            link="Ver Documentação"
            bg="bg-white"
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

const InfoCard = ({ icon, title, desc, bg, buttonText, label, link }: any) => (
  <div className={`${bg === 'bg-black' ? 'bg-black text-white' : 'bg-white text-black border border-gray-100'} p-8 rounded-[40px] shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200 group`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${bg === 'bg-black' ? 'bg-white/10' : 'bg-gray-50'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{title}</h3>
    <p className={`text-[11px] font-bold uppercase tracking-wider mb-8 leading-relaxed ${bg === 'bg-black' ? 'text-gray-400' : 'text-gray-400'}`}>{desc}</p>
    
    {buttonText && (
      <button className="text-[10px] font-black bg-white text-black px-6 py-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all tracking-[0.2em] cursor-pointer">
        {buttonText}
      </button>
    )}
    
    {label && (
      <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full tracking-widest uppercase">
        {label}
      </span>
    )}
    
    {link && (
      <button className="text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all cursor-pointer italic">
        {link} <ArrowRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default JobHome;