"use client"
type StepId = "curriculo" | "dados" | "perguntas" | "upsell";

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
} from "lucide-react"
import { jobs } from "@/data/jobs";
import JobApplyModal from "../JobApplyModal";

const PAGE_SIZE = 10
const JobHome = () => {
  const [open, setOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(jobs[0])
  const [step, setStep] = useState(1)
  const steps = [
    "curriculo",
    "dados",
    selectedJob.perguntas?.length ? "perguntas" : null,
    "upsell",
    "final"
  ].filter(Boolean)
  const [currentPage, setCurrentPage] = useState(1)
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return jobs.slice(start, end)
  }, [currentPage, jobs])

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE)

  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = steps[stepIndex]


  useEffect(() => {
    if (!paginatedJobs.find(j => j.id === selectedJob?.id)) {
      setSelectedJob(paginatedJobs[0])
    }
  }, [currentPage])

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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
          <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2">
            {paginatedJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer border rounded-xl p-4 transition ${selectedJob?.id === job.id
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

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border disabled:opacity-50"
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
                className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border disabled:opacity-50"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-7 border border-gray-200 rounded-xl sticky top-24 bg-white">
            <div className="flex flex-col h-full w-full p-8">
              <header className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob?.cargo}
                </h2>

                <p className="text-gray-600">
                  <span className="font-semibold">{selectedJob?.empresa}</span> •{" "}
                  {selectedJob?.local}
                </p>
              </header>

              <section className="flex gap-4 mt-6">
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">
                    Salário
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedJob?.salario
                      ? `R$ ${selectedJob.salario}`
                      : "A combinar"}
                  </p>
                </div>

                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">
                    Jornada
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedJob?.turno || "Indefinido"}
                  </p>
                </div>
              </section>

              <section className="flex-1 overflow-y-auto mt-8 space-y-8 pr-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Sobre a vaga
                  </h4>
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
                      {selectedJob?.requisitos.map((req, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                          {req}
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
                        {selectedJob.beneficios.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              <button
                onClick={() => setOpen(true)}
                className="mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Candidatar-se
              </button>
            </div>
          </div>
        </section>
        <JobApplyModal
          open={open}
          onClose={() => setOpen(false)}
          job={selectedJob}
        />
        <section className="grid md:grid-cols-3 gap-6 pt-12 border-t border-gray-100">
          <div className="bg-indigo-600 p-6 rounded-xl text-white">
            <GraduationCap className="w-7 h-7 mb-3 opacity-80" />
            <h3 className="font-semibold mb-1">Cursos Gratuitos</h3>
            <p className="text-sm text-indigo-100 mb-3">
              Aprenda novas habilidades sem custo.
            </p>
            <button className="text-sm font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
              Acessar
            </button>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <Users className="w-7 h-7 mb-3 text-orange-500" />
            <h3 className="font-semibold mb-1">Feirão 2026</h3>
            <p className="text-sm text-gray-500 mb-3">
              Evento presencial dia 25 de Março.
            </p>
            <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
              SAVE THE DATE
            </span>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl">
            <Briefcase className="w-7 h-7 mb-3 text-green-600" />
            <h3 className="font-semibold mb-1">Dicas de Currículo</h3>
            <p className="text-sm text-gray-500 mb-3">
              Como se destacar em processos seletivos.
            </p>
            <button className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:underline">
              Ler mais <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default JobHome