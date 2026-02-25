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
  ChevronRight
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
          <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
            {paginatedJobs.map(job => (
              <div
                key={job.uid}
                onClick={() => {
                  setSelectedJob(job)
                  if (window.innerWidth < 1024) {
                    setOpenJobModal(true)
                  }
                }}
                className={`cursor-pointer border rounded-xl p-4 transition ${selectedJob?.uid === job.uid
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <h3 className="font-semibold text-gray-900 leading-snug">
                  {job.cargo}
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {job.empresa}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.local}
                  </span>
                  <span>{job.turno || "Indefinido"}</span>
                  <span className="font-semibold text-green-700">
                    {job.salario ? `R$ ${job.salario}` : "A combinar"}
                  </span>
                </div>
              </div>
            ))}

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-between pt-4 mt-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border disabled:opacity-50 cursor-pointer"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* DETALHES DA VAGA (DESKTOP) */}
          <div className="hidden lg:flex lg:col-span-7 border border-gray-200 rounded-xl sticky top-24 bg-white overflow-hidden">
            <div className="flex flex-col h-full w-full p-8">
              <header className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                  Sobre a vaga
                </h4>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob?.cargo}
                </h2>
              </header>
              <section className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">Jornada</p>
                  <p className="font-semibold text-gray-800">{selectedJob?.turno || "Indefinido"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">Salário</p>
                  <p className="font-semibold text-gray-800">
                    {selectedJob?.salario ? `R$ ${selectedJob.salario}` : "A combinar"}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Candidatar-se
                </button>
              </section>


              <section className="flex-1 overflow-y-auto mt-8 space-y-8 pr-2">
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedJob?.descricao}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                      Experiência & Requisitos
                    </h4>
                    <ul className="space-y-2">
                      {selectedJob?.requisitos?.map((req: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                          {/* Aqui estava o erro: antes era req, agora é req.description */}
                          {typeof req === 'object' ? req.description : req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedJob?.beneficios?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                        Benefícios
                      </h4>
                      <ul className="space-y-2">
                        {selectedJob.beneficios.map((benefit: any, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            {/* Aqui também: benefit.description */}
                            {typeof benefit === 'object' ? benefit.description : benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>


            </div>
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