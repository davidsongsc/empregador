import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getApplications } from "@/services/applicationResult";
import { ApplicationResult } from "@/interfaces/applicationResult";

export function useApplications() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<ApplicationResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Captura os filtros da URL automaticamente
  const statusFilter = searchParams.get("status") || undefined;
  const searchFilter = searchParams.get("search") || undefined;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getApplications({ 
        status: statusFilter, 
        search: searchFilter 
      });
      setApplications(data.results || []);
    } catch (err) {
      console.error("Erro ao carregar candidaturas:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Retornamos os filtros aqui para que a Page possa usá-los
  return { 
    applications, 
    loading, 
    statusFilter, 
    searchFilter, 
    refresh: load 
  };
}