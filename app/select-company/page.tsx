"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react"; // Adicionei o CheckCircle2

export default function SelectCompany() {
  // 1. Importe o activeCompanyId do seu store
  const { user, setActiveCompany, activeCompanyId } = useAuthStore();
  const router = useRouter();
  const empresas = user?.profile?.empresas || [];

  const handleSelect = (id: string) => {
    setActiveCompany(id);
    router.push(`/dashboard/painel/companies/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">Selecione a Empresa</h1>
          <p className="text-gray-500 font-medium">Com qual organização você deseja trabalhar agora?</p>
        </div>

        <div className="space-y-4">
          {empresas.map((emp) => {
            // 2. Verifique se esta empresa é a ativa
            const isSelected = activeCompanyId === emp.id;

            return (
              <button
                key={emp.id}
                onClick={() => handleSelect(emp.id)}
                className={`
                  w-full group flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] shadow-sm
                  ${isSelected 
                    ? "border-indigo-600 bg-indigo-50/50 shadow-indigo-100" 
                    : "border-transparent bg-white hover:border-indigo-200"}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    p-3 rounded-xl transition-colors
                    ${isSelected 
                      ? "bg-indigo-600 text-white" 
                      : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"}
                  `}>
                    <Building2 size={24} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                        {emp.name}
                      </p>
                      {/* 3. Indicador visual de Selecionado */}
                      {isSelected && <CheckCircle2 size={14} className="text-indigo-600" />}
                    </div>
                    <p className={`text-xs uppercase font-black ${isSelected ? "text-indigo-400" : "text-gray-400"}`}>
                      {emp.role}
                    </p>
                  </div>
                </div>
                
                <ArrowRight 
                  className={`transition-colors ${isSelected ? "text-indigo-600" : "text-gray-300 group-hover:text-indigo-600"}`} 
                  size={20} 
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}