"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
  Target,
  Zap,
  Activity,
  ShieldCheck
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobApplyModal from "../JobApplyModal";
import JobDetailsModal from "../JobsDetailsModal";
import AdBanner from "../AdBanner";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "../Notification";
import { useJobSyncStore } from "@/store/useJobSyncStore";
import { getJobDeltaSync } from "@/services/sincronismo-service";

const PAGE_SIZE = 10;

const JobHome = () => {
  const [openApply, setOpenApply] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const { jobs, loading, count } = useJobs(currentPage, PAGE_SIZE);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  
  const { lastSequenceId, syncData, setSyncing, isSyncing } = useJobSyncStore();

  const performSync = useCallback(async () => {
    if (isSyncing) return;
    
    setSyncing(true);
    try {
      const data = await getJobDeltaSync(lastSequenceId);

      if (data?.action === "APPLY_PATCHES") {
        syncData(data.patches, data.new_hash);
      } else if (data?.action === "FULL_RELOAD") {
        window.location.reload();
      }
    } catch (err) {
      console.error("Nexus_Hub::Sync_Error");
    } finally {
      setSyncing(false);
    }
  }, [lastSequenceId, syncData, setSyncing, isSyncing]);

  useEffect(() => {
    performSync();
    const interval = setInterval(performSync, 30000);
    return () => clearInterval(interval);
  }, [performSync]);

  const totalPages = useMemo(() => Math.ceil(count / PAGE_SIZE), [count]);

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
    if (jobs.length > 0 && !selectedJob && window.innerWidth >= 1024) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedJob(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--delos-surface)', color: 'var(--delos-black)' }} className="min-h-screen relative transition-colors duration-500">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[length:100px_100px] [background-image:linear-gradient(to_right,var(--delos-black)_1px,transparent_1px),linear-gradient(to_bottom,var(--delos-black)_1px,transparent_1px)]" />
      
      {(loading || isSyncing) && (
        <div className="fixed top-24 right-8 z-50 flex items-center gap-2 bg-[var(--delos-amber)] text-black px-3 py-1 rounded-full text-[8px] font-mono font-black animate-pulse shadow-lg">
          <Activity size={10} /> {isSyncing ? "SYNCING_DELTA" : "SYNCING_MATRIX"}
        </div>
      )}

      <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 md:px-8 relative z-10">

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[var(--delos-amber)] animate-pulse rounded-full" />
              <span className="text-[10px] font-mono font-black text-[var(--delos-amber)] uppercase tracking-[0.4em]">Protocol::Active_Hunt_2026</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              Nexus_<span className="opacity-30">Hub</span>
            </h1>
            <p className="text-[10px] md:text-[11px] font-bold opacity-50 uppercase tracking-[0.2em] max-w-xl">
              Sincronização de talentos bio-sintéticos com unidades corporativas de alta performance.
            </p>
          </div>
          <div className="flex items-center gap-4 border-l border-black/5 dark:border-white/5 pl-6 opacity-30 hidden md:flex">
            <Activity className="w-5 h-5 text-[var(--delos-indigo)]" />
            <span className="text-[9px] font-mono uppercase tracking-widest leading-tight">System_Status::<br />Optimal_Sync</span>
          </div>
        </header>

        <AdBanner dataAdSlot="1234567890" className="mb-12 rounded-sm grayscale opacity-40 hover:opacity-100 transition-all border border-black/10 dark:border-white/10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <section className="lg:col-span-4 space-y-4">
            <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-1 custom-scrollbar">
              {jobs.map((job) => (
                <article
                  key={job.uid}
                  onClick={() => {
                    setSelectedJob(job);
                    if (window.innerWidth < 1024) setOpenDetailsModal(true);
                  }}
                  className={`relative group cursor-pointer border rounded-sm p-5 transition-all duration-500 ${selectedJob?.uid === job.uid
                    ? "border-[var(--delos-black)] bg-black/[0.02] dark:bg-white/[0.02] shadow-xl"
                    : "border-black/5 dark:border-white/5 hover:border-[var(--delos-indigo)]/30"
                    }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${selectedJob?.uid === job.uid ? 'bg-[var(--delos-amber)]' : 'bg-transparent'}`} />

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono text-[var(--delos-amber)] uppercase tracking-widest font-bold">
                        UNIT_TYPE::{job.tipo_vaga_display}
                      </span>
                      <ChevronRight size={14} className={`transition-all ${selectedJob?.uid === job.uid ? 'rotate-90 text-[var(--delos-amber)]' : 'opacity-10'}`} />
                    </div>
                    <h3 className="text-base md:text-lg font-black uppercase tracking-tight group-hover:text-[var(--delos-indigo)] transition-colors leading-tight italic">
                      {job.cargo_exibicao}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] font-bold opacity-40 uppercase tracking-widest">
                      <MapPin size={10} style={{ color: 'var(--delos-amber)' }} />
                      {job.endereco?.cidade || "Global_Network"}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <nav className="flex items-center justify-between p-4 border border-black/5 dark:border-white/5 bg-black/[0.01]">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 opacity-40 hover:opacity-100 disabled:invisible transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">
                Registry {currentPage} / {totalPages || 1}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 opacity-40 hover:opacity-100 disabled:invisible transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </section>

          <aside className="hidden lg:block lg:col-span-8 sticky top-28">
            <div className="bg-white dark:bg-[#080808] border border-black/5 dark:border-white/10 rounded-sm shadow-2xl h-[750px] flex flex-col relative overflow-hidden">

              {!selectedJob ? (
                <div className="m-auto text-center p-12 opacity-20">
                  <Binary className="w-16 h-16 mx-auto mb-6 animate-pulse" />
                  <p className="text-[10px] font-mono font-black uppercase tracking-[0.5em]">Waiting_Selection_Input</p>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-10 border-b border-black/5 dark:border-white/5 bg-black/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-[var(--delos-black)] text-[var(--delos-surface)] text-[9px] font-black px-3 py-1 rounded-sm uppercase tracking-widest italic">
                        {selectedJob.tipo_vaga_display}
                      </span>
                      <div className="h-px w-12 bg-[var(--delos-amber)] opacity-30" />
                      <span className="text-[9px] font-mono font-bold opacity-40">CAT::CORE_PROTOCOL</span>
                    </div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                      {selectedJob.cargo_exibicao}
                    </h2>
                    <p className="text-xl opacity-40 font-black uppercase tracking-widest italic">{selectedJob.empresa_nome}</p>

                    <button
                      onClick={() => handleApplyClick(selectedJob)}
                      style={{ backgroundColor: 'var(--delos-black)', color: 'var(--delos-surface)' }}
                      className="w-full mt-10 py-5 rounded-sm font-black text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-[var(--delos-indigo)] flex items-center justify-center gap-4 group active:scale-[0.98] shadow-xl"
                    >
                      Initialize_Protocol
                      <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="p-5 border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 rounded-sm">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-2 block">Temporal_Shift</span>
                        <div className="flex items-center gap-2 font-black uppercase text-xs tracking-tighter italic">
                          <Clock className="w-4 h-4 text-[var(--delos-indigo)]" /> {selectedJob.turno || "Full_Sequence"}
                        </div>
                      </div>
                      <div className="p-5 border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 rounded-sm">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest mb-2 block">Compensation_Data</span>
                        <div className="flex items-center gap-2 font-black uppercase text-xs tracking-tighter italic">
                          <CircleDollarSign className="w-4 h-4 text-[var(--delos-amber)]" />
                          {selectedJob.salario ? `R$ ${selectedJob.salario}` : "Competitive_Market"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 opacity-30" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Functional_Requirements</h4>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed italic border-l-2 border-[var(--delos-indigo)] pl-8 py-2 opacity-70">
                        {selectedJob.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Skill_Academy"
            desc="Sincronização de matrizes de competência técnica via rede neural."
            isDark={true}
          />
          <InfoCard
            icon={<Users className="w-6 h-6" />}
            title="Registry_Fair"
            desc="Evento presencial para diagnóstico e calibração de talentos."
          />
          <InfoCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Guia_Operational"
            desc="Otimize seus parâmetros de busca para detecção corporativa."
          />
        </section>
      </main>

      <JobDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        job={selectedJob}
        onApply={() => { setOpenDetailsModal(false); setOpenApply(true); }}
      />

      <JobApplyModal open={openApply} onClose={() => setOpenApply(false)} job={selectedJob} />
    </div>
  );
};

const InfoCard = ({ icon, title, desc, isDark }: any) => (
  <div
    style={{
      backgroundColor: isDark ? 'var(--delos-black)' : 'var(--delos-surface)',
      color: isDark ? 'var(--delos-surface)' : 'var(--delos-black)'
    }}
    className={`p-8 rounded-sm border border-black/5 dark:border-white/5 transition-all hover:-translate-y-1 hover:shadow-2xl group`}
  >
    <div className={`w-12 h-12 flex items-center justify-center mb-6 border ${isDark ? 'border-white/20' : 'border-black/10'}`}>
      {icon}
    </div>
    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-3">{title}</h3>
    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 leading-relaxed mb-8">{desc}</p>

    <button
      className={`text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all ${isDark ? 'hover:text-[var(--delos-amber)]' : 'hover:text-[var(--delos-indigo)]'}`}
    >
      EXECUTE_MODULE <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-2" />
    </button>
  </div>
);

export default JobHome;