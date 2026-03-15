// hooks/useApplication.ts
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useApplication() {
  const searchParams = useSearchParams();
  const { activeCompanyId } = useAuthStore();
  
  // Pegamos apenas o que precisamos do Store Centralizado
  const { data, loading, fetchApplications } = useApplicationStore();
  
  const statusFilter = searchParams.get("status") || undefined;
  const searchFilter = searchParams.get("search") || undefined;

  const lastCallKey = useRef("");

  useEffect(() => {
    const filters = { status: statusFilter, search: searchFilter, activeCompanyId };
    const currentKey = JSON.stringify(filters);

    // Trava de segurança no cliente (evita disparos do Strict Mode)
    if (lastCallKey.current !== currentKey) {
      lastCallKey.current = currentKey;
      fetchApplications(filters);
    }
  }, [statusFilter, searchFilter, activeCompanyId, fetchApplications]);

  return { 
    applications: data, 
    loading, 
    statusFilter, 
    searchFilter,
    refresh: () => fetchApplications({ status: statusFilter, search: searchFilter }, true)
  };
}