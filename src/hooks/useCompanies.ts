import { useState, useEffect } from "react";
import { companyService } from "@/services/companies-service";

export function useCompanies(page: number = 1, search: string = "") {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await companyService.getCompanies(page, search);
        // Seguindo seu padrão: extrai "results" para lidar com a paginação do Django
        setCompanies(data.results || []);
      } catch (err: any) {
        setError("Não foi possível carregar as empresas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, search]); // Re-executa se a página ou busca mudar

  return { companies, loading, error };
}