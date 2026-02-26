import { useState, useEffect, useCallback } from 'react';
import { getMyApplications, Application } from '@/services/applications';
import { useAuth } from '@/contexts/AuthContext';

export function useMyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchApplications = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getMyApplications();
      
      // GARANTIA: Se o Django retornar paginação, os dados estão em 'results'.
      // Se não, usamos o data diretamente, mas garantimos que seja um Array.
      const applicationsArray = Array.isArray(data) 
        ? data 
        : (data as any)?.results || [];
        
      setApplications(applicationsArray);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar suas candidaturas.");
      setApplications([]); // Evita que o estado fique como undefined
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const refresh = () => fetchApplications();

  // GARANTIA EXTRA: Sempre usamos um fallback [] para evitar erros de runtime
  const safeApps = Array.isArray(applications) ? applications : [];

  return {
    applications: safeApps,
    loading,
    error,
    refresh,
    totalCount: safeApps.length,
    pendingCount: safeApps.filter(a => a.status === 'applied' || a.status === 'reviewing').length,
    approvedCount: safeApps.filter(a => a.status === 'hired' || a.status === 'interview').length
  };
}