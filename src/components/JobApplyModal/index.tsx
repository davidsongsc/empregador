"use client"
import { CheckCircle2 } from "lucide-react"
import React from "react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
}

const JobApplyModal = ({ open, onClose, job }: Props) => {
  if (!open || !job) return null

  const steps = [
    "curriculo",
    "dados",
    job.perguntas?.length ? "perguntas" : null,
    "upsell",
    "final"
  ].filter(Boolean)

  const [stepIndex, setStepIndex] = React.useState(0)
  const currentStep = steps[stepIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Candidatura para {job.cargo}
        </h3>

        <p className="text-sm text-gray-500 mb-6">
          Etapa {stepIndex + 1} de {steps.length}
        </p>

        <form className="space-y-6">
          {currentStep === "curriculo" && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Currículo (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                className="mt-2 block w-full text-sm file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:px-4 file:py-2"
              />
            </div>
          )}

          {currentStep === "dados" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="rounded-lg border px-3 py-2 text-sm" placeholder="CPF" />
              <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Endereço" />
            </div>
          )}

          {currentStep === "perguntas" && (
            <div className="space-y-4">
              {job.perguntas.map((q: string, i: number) => (
                <textarea
                  key={i}
                  placeholder={q}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              ))}
            </div>
          )}

          {currentStep === "upsell" && (
            <div className="bg-indigo-50 border rounded-lg p-4">
              <p className="font-semibold text-indigo-700">
                Envio automático de currículo
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Envie para vagas compatíveis por <strong>R$ 5,99</strong>.
              </p>
              <label className="flex items-center gap-2 mt-3 text-sm">
                <input type="checkbox" />
                Ativar envio automático
              </label>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex(i => i - 1)}
              className="px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
            >
              Voltar
            </button>

            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStepIndex(i => i + 1)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Enviar candidatura
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobApplyModal