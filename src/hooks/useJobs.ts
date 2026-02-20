"use client";

import { useEffect, useState } from "react";
import { getJobs, Job } from "@/services/jobs";

export function useJobs(page: number) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setLoading(true);
      setError(null);

      try {
        const data = await getJobs(page);

        if (cancelled) return;

        // O Django REST Framework costuma retornar os dados dentro de 'results' na paginação
        setJobs(data.results || []); 
        setCount(data.count || 0);
        setHasNext(Boolean(data.next));
      } catch (err: any) {
        if (cancelled) return;
        
        // Agora o erro vem formatado pela nossa nova função api
        const errorMessage = err?.detail || "Erro ao carregar vagas";
        setError(errorMessage);
        console.error("Erro na busca de vagas:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [page]);

  return {
    jobs,
    count,
    loading,
    error,
    hasNext,
  };
}