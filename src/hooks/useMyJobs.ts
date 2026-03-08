import { useState, useEffect, useCallback, useMemo } from "react";
import { getMyJobs } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { useJobsCacheStore } from "@/store/useJobsCacheStore";
import { JobsResponse } from "@/interfaces/jobResponse";

interface FilterParams {
  usuario?: string;
  company?: string;
  page?: number;
  page_size?: number;
}

const CACHE_TTL = 60 * 1000; // 60 segundos

export const useMyJobs = (filter: FilterParams) => {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getCache, setCache } = useJobsCacheStore();

  // Geramos uma chave única baseada nos filtros para o cache
  const cacheKey = useMemo(() => 
    `my-jobs-${filter.usuario || ''}-${filter.company || ''}-${filter.page || 1}-${filter.page_size || 10}`, 
  [filter]);

  const fetchJobs = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Tentar pegar do Cache (se não for um forceRefresh)
      if (!forceRefresh) {
        const cachedData = getCache(cacheKey, CACHE_TTL);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      // 2. Buscar da API
      const response = await getMyJobs(filter);
      
      // 3. Salvar no Cache e no Estado
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

  useEffect(() => {
    if (filter.usuario || filter.company) {
      fetchJobs();
    }
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
    refresh: () => fetchJobs(true) // Força a busca ignorando o cache
  };
};