import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompanyStore } from "@/store/useCompanyStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";

export function useCompanyContext() {
  const activeCompanyId = useAuthStore((state) => state.activeCompanyId);
  
  // Da sua store existente
  const { activeCompany, fetchCompanyDetails } = useCompanyStore();
  
  // Da nossa nova store
  const { departments, fetchDepartments, loading: deptsLoading } = useDepartmentStore();

  useEffect(() => {
    if (activeCompanyId) {
      // Busca os detalhes da empresa (seu fetchCompanyDetails ja faz isso)
      fetchCompanyDetails(activeCompanyId);
      // Busca os departamentos daquela empresa
      fetchDepartments();
    }
  }, [activeCompanyId]);

  return {
    company: activeCompany,
    departments,
    isLoading: deptsLoading,
    // Verifica se é filial baseado no seu Model (parent field)
    isBranch: !!activeCompany?.parent,
    subscription: activeCompany?.subscription, // Se vier no detail serializer
  };
}