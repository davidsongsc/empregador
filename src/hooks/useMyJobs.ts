import { useState, useEffect, useCallback } from "react";
import { getMyJobs, JobResult } from "@/services/jobService";
import { toast } from "@/components/Notification";

export const useMyJobs = (filter: { usuario?: string; company?: string }) => {
  const [vagas, setVagas] = useState<JobResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyJobs(filter);
      setVagas(data.results);
    } catch (err: any) {
      const msg = err.message || "Erro ao carregar suas vagas";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filter.usuario, filter.company]);

  useEffect(() => {
    if (filter.usuario || filter.company) {
      fetchJobs();
    }
  }, [fetchJobs]);

  return { vagas, loading, error, refresh: fetchJobs };
};