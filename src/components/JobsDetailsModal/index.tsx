"use client"
import { CheckCircle2, MapPin } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  job: any
  onApply: () => void
}

const JobDetailsModal = ({ open, onClose, job, onApply }: Props) => {
  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 lg:hidden">
      <div className="bg-white w-full h-full overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="text-sm text-gray-500 mb-4"
        >
          Voltar
        </button>

        <h2 className="text-2xl font-bold text-gray-900">
          {job.cargo}
        </h2>

        <p className="text-gray-600 mt-1">
          <span className="font-semibold">{job.empresa}</span> • {job.local}
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">
              Salário
            </p>
            <p className="font-semibold text-gray-800">
              {job.salario ? `R$ ${job.salario}` : "A combinar"}
            </p>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <p className="text-[11px] uppercase font-semibold text-gray-400 mb-1">
              Jornada
            </p>
            <p className="font-semibold text-gray-800">
              {job.turno || "Indefinido"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase mb-2">
            Sobre a vaga
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {job.descricao}
          </p>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 uppercase mb-3">
            Requisitos
          </h4>
          <ul className="space-y-2">
            {job.requisitos.map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {job.beneficios?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 uppercase mb-3">
              Benefícios
            </h4>
            <ul className="space-y-2">
              {job.beneficios.map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onApply}
          className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
        >
          Candidatar-se
        </button>
      </div>
    </div>
  )
}

export default JobDetailsModal