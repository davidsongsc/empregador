"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, X } from "lucide-react";

interface CompanySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanySelectorModal({ isOpen, onClose }: CompanySelectorModalProps) {
  const { user, setActiveCompany } = useAuthStore();
  const router = useRouter();
  const empresas = user?.profile?.empresas || [];

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setActiveCompany(id);
    onClose(); // Fecha o modal antes de redirecionar
    router.push(`/dashboard/painel/companies/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">Trocar Empresa</h2>
            <p className="text-sm text-gray-500 font-medium">Selecione a organização desejada</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Empresas */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {empresas.map((emp) => (
            <button
              key={emp.id}
              onClick={() => handleSelect(emp.id)}
              className="w-full group flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-2xl border-2 border-transparent hover:border-indigo-600 shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-gray-100">
                  <Building2 size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 leading-none">{emp.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black mt-1">{emp.role}</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-indigo-600 transition-colors" size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}