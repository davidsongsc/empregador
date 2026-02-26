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
  Clock
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobApplyModal from "../JobApplyModal";
import JobDetailsModal from "../JobsDetailsModal";
import AdBanner from "../AdBanner";
import SkeletonJob from "../Loading";

type StepId = "curriculo" | "dados" | "perguntas" | "upsell";

const PAGE_SIZE = 10

const JobHome = () => {
  // --- 1. TODOS OS HOOKS DEVEM FICAR AQUI NO TOPO ---
  const [open, setOpen] = useState(false)
  const [openJobModal, setOpenJobModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [stepIndex, setStepIndex] = useState(0)

  // Hook customizado
  const { jobs, loading, error } = useJobs(currentPage || 1);

  // Memoização da paginação (sempre executada)
  const paginatedJobs = useMemo(() => {
    if (!jobs) return []
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return jobs.slice(start, end)
  }, [currentPage, jobs])

  // Estado do job selecionado
  const [selectedJob, setSelectedJob] = useState<any>(null)

  // Lógica de steps
  const hasQuestions = Array.isArray(selectedJob?.perguntas) && selectedJob.perguntas.length > 0;
  const steps = [
    "curriculo",
    "dados",
    hasQuestions ? "perguntas" : null,
    "upsell",
    "final",
  ].filter(Boolean);

  useEffect(() => {
    if (paginatedJobs.length > 0) {
      // Verificamos se o job atual ainda é válido para a nova lista
      const isJobInCurrentPage = paginatedJobs.some(j => j.uid === selectedJob?.uid);

      if (!selectedJob || !isJobInCurrentPage) {
        setSelectedJob(paginatedJobs[0]);
      }
    }
    // Removemos 'selectedJob' daqui. 
    // Queremos reagir apenas quando a página ou os dados da lista mudarem.
  }, [currentPage, paginatedJobs]);

  // --- 2. RETORNOS CONDICIONAIS DE UI (DEPOIS DOS HOOKS) ---
  if (loading) {
    return (
      <SkeletonJob />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Erro ao carregar vagas</h1>
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Nenhuma vaga encontrada</h1>
      </div>
    )
  }

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE)

  // --- 3. RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-25">
        <section className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Encontre seu próximo emprego
          </h1>
          <p className="text-gray-500">
            Vagas atualizadas diariamente, simples e direto ao ponto.
          </p>
        </section>
        {/* Banner de Topo */}
        <AdBanner dataAdSlot="1234567890" />
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
          {/* LISTA DE VAGAS */}
          <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {paginatedJobs.map(job => (
              <div
                key={job.uid}
                onClick={() => {
                  setSelectedJob(job)
                  if (window.innerWidth < 1024) {
                    setOpenJobModal(true)
                  }
                }}
                className={`cursor-pointer border rounded-2xl p-5 transition-all duration-300 ${selectedJob?.uid === job.uid
                  ? "border-indigo-600 bg-indigo-50 shadow-sm"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50/50"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {/* Ajustado para cargo_exibicao */}
                    {job.cargo_exibicao}
                  </h3>
                </div>

                <p className="text-sm text-indigo-600 font-bold">
                  {/* Ajustado para empresa_nome */}
                  {job.tipo_vaga_display}
                </p>

                <div className="flex flex-wrap gap-y-2 gap-x-4 text-[12px] text-gray-500 mt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {/* Fallback para quando o endereço estruturado for null */}
                    {job.endereco ? `${job.endereco.cidade}, ${job.endereco.estado}` : (job.endereco || "Remoto")}
                  </span>

                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {job.turno || "A definir"}
                  </span>
                  <span className="font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {job.salario ? `R$ ${job.salario}` : "A combinar"}
                  </span>
                </div>
              </div>
            ))}

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-between pt-6 mt-auto border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DETALHES DA VAGA (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-7 border border-gray-100 rounded-[32px] sticky top-24 bg-white shadow-sm overflow-hidden">
            {!selectedJob ? (
              <div className="flex flex-col items-center justify-center w-full text-gray-400 p-10 text-center">
                <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">Selecione uma vaga para visualizar os detalhes</p>
              </div>
            ) : (
              <div className="flex flex-col h-full w-full p-10">
                <header className="relative">
                  <div className="inline-block bg-red-100 text-orange-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 mr-2">
                    {selectedJob.tipo_vaga_display || ""}
                  </div>
                  <div className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                    {selectedJob.role_details?.category || "Oportunidade"}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">
                    {selectedJob.cargo_exibicao}
                  </h2>
                  <p className="text-lg text-gray-500 font-medium mt-1">{selectedJob.empresa_nome}</p>
                </header>

                <section className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-[10px] uppercase font-black text-gray-400 mb-2 tracking-widest">Jornada</p>
                    <p className="font-bold text-gray-800">{selectedJob.turno || "Indefinido"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-[10px] uppercase font-black text-gray-400 mb-2 tracking-widest">Remuneração</p>
                    <p className="font-bold text-green-600">
                      {selectedJob.salario ? `R$ ${selectedJob.salario}` : "A combinar"}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(true)}
                    className="col-span-2 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 cursor-pointer mt-2"
                  >
                    Candidatar-se agora
                  </button>
                </section>

                <section className="flex-1 overflow-y-auto mt-10 space-y-10 pr-4 custom-scrollbar">
                  <div>
                    <h4 className="text-[11px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Descrição da Oportunidade</h4>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                      {selectedJob.descricao}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-[11px] font-black text-gray-400 mb-5 uppercase tracking-[0.2em]">Requisitos</h4>
                      <ul className="space-y-3">
                        {selectedJob.requisitos?.map((req: any, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                            {req.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedJob.beneficios?.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-black text-gray-400 mb-5 uppercase tracking-[0.2em]">Benefícios</h4>
                        <ul className="space-y-3">
                          {selectedJob.beneficios.map((benefit: any, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              </div>
                              {benefit.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </section>
        <AdBanner dataAdSlot="0987654321" dataAdFormat="rectangle" />
        {/* MODAIS */}
        <JobDetailsModal
          open={openJobModal}
          onClose={() => setOpenJobModal(false)}
          job={selectedJob}
          onApply={() => {
            setOpenJobModal(false)
            setOpen(true)
          }}
        />

        <JobApplyModal
          open={open}
          onClose={() => setOpen(false)}
          job={selectedJob}
        />

        {/* CARDS INFORMATIVOS */}
        <section className="grid md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
          <div className="bg-indigo-600 p-6 rounded-xl text-white">
            <GraduationCap className="w-7 h-7 mb-3 opacity-80" />
            <h3 className="font-semibold mb-1">Cursos Gratuitos</h3>
            <p className="text-sm text-indigo-100 mb-3">Aprenda novas habilidades sem custo.</p>
            <button className="text-sm font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition cursor-pointer">
              Acessar
            </button>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <Users className="w-7 h-7 mb-3 text-orange-500" />
            <h3 className="font-semibold mb-1">Feirão 2026</h3>
            <p className="text-sm text-gray-500 mb-3">Evento presencial dia 25 de Março.</p>
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
              SAVE THE DATE
            </span>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <Briefcase className="w-7 h-7 mb-3 text-green-600" />
            <h3 className="font-semibold mb-1">Dicas de Currículo</h3>
            <p className="text-sm text-gray-500 mb-3">Como se destacar em processos seletivos.</p>
            <button className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer">
              Ler mais <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default JobHome