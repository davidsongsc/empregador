import { useState, useEffect, useCallback, useMemo } from "react";
import { getMyJobs } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { useJobsCacheStore } from "@/store/useJobsCacheStore";
import { JobsResponse } from "@/interfaces/ijobResponse";

interface FilterParams {
  usuario?: string;
  company?: string;
  page?: number;
  page_size?: number;
}
interface MyJobsParams extends FilterParams {
  company: string;
}
const CACHE_TTL = 60 * 1000; // 60 segundos

export const useMyJobs = (filter: FilterParams) => {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(false); // Começa como false para evitar flash se não houver company
  const [error, setError] = useState<string | null>(null);

  const { getCache, setCache } = useJobsCacheStore();

  // 1. Memoizamos a chave de cache
  const cacheKey = useMemo(() => {
    return `my-jobs-${filter.usuario || 'any'}-${filter.company || 'no-co'}-${filter.page || 1}-${filter.page_size || 10}`;
  }, [filter.usuario, filter.company, filter.page, filter.page_size]); // Dependências primitivas evitam loops se o objeto filter for recriado

  const fetchJobs = useCallback(async (forceRefresh = false) => {
    // Cláusula de Guarda: Se não tem empresa, limpamos os dados e paramos
    if (!filter.company) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cache Check
      if (!forceRefresh) {
        const cachedData = getCache(cacheKey, CACHE_TTL);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // API Call - Agora o TS aceita o cast pois garantimos o filter.company acima
      const response = await getMyJobs(filter as MyJobsParams);

      setCache(cacheKey, response);
      setData(response);
    } catch (err: any) {
      const msg = err.message || "Erro ao carregar suas vagas";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, filter, getCache, setCache]);

  // 2. Efeito de sincronização
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    vagas: data?.results || [],
    pagination: {
      count: data?.count || 0,
      next: data?.next,
      previous: data?.previous
    },
    loading,
    error,
    refresh: () => fetchJobs(true)
  };
};