"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllJobs, getJobFeed, JobResult, JobsResponse } from "@/services/jobService";
import { toast } from "@/components/Notification";
import { useAuthStore } from "@/store/useAuthStore";

export function useJobs(page: number) {
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);

  const { user } = useAuthStore();

  // Usamos useCallback para que a função possa ser usada no useEffect 
  // e também exportada para o componente.
  const loadJobs = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      // Tentativa 1: Se temos user e token, tentamos o Feed Privado
      if (user && token) {
        try {
          const data = await getJobFeed();
          setJobs(data.results || []);
          setCount(data.count || 0);
          setHasNext(Boolean(data.next));
          return; // Sucesso, encerra a função
        } catch (feedErr: any) {
          console.warn("Feed falhou (token expirado?), tentando rota pública...");
          // Se der 401 aqui, o código abaixo (catch) vai rodar o fallback
        }
      }

      // Tentativa 2: Rota Pública (Fallback se deslogado ou se o Feed deu erro)
      const publicData = await getAllJobs();
      setJobs(publicData.results || []);
      setCount(publicData.count || 0);
      setHasNext(Boolean(publicData.next));

    } catch (err: any) {
      setError("Não foi possível carregar as vagas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs, page]); // Executa quando a página muda ou o usuário loga

  return {
    jobs,
    count,
    loading,
    error,
    hasNext,
    refresh: () => loadJobs(true), // Exporta para uso externo
  };
}