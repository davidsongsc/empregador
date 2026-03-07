"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

export default function SelectCompany() {
  const { user, setActiveCompany } = useAuthStore();
  const router = useRouter();
  const empresas = user?.profile?.empresas || [];

  const handleSelect = (id: string) => {
    setActiveCompany(id);
    router.push(`/dashboard/painel/companies/${id}`);
    console.log("Empresa selecionada:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">Selecione a Empresa</h1>
          <p className="text-gray-500 font-medium">Com qual organização você deseja trabalhar agora?</p>
        </div>

        <div className="space-y-4">
          {empresas.map((emp) => (
            <button
              key={emp.id}
              onClick={() => handleSelect(emp.id)}
              className="w-full group flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-transparent hover:border-indigo-600 shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-400 uppercase font-black">{emp.role}</p>
                </div>
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-indigo-600 transition-colors" size={20} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}