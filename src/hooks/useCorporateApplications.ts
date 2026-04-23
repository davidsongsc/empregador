import { useEffect, useCallback, useMemo } from "react";
import { useCorporateApplicationsStore } from "@/store/useCorporateApplicationsStore";
import { useAuthStore } from "@/store/useAuthStore";

interface UseCorporateApplicationsProps {
    jobId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    companyId?: string;
}

export const useCorporateApplications = (filters: UseCorporateApplicationsProps = {}) => {
    const { activeCompanyId: storeCompanyId } = useAuthStore();
    const effectiveCompanyId = filters.companyId || storeCompanyId;
    const {
        applications,
        pagination,
        loading,
        fetchApplications,
        updateApplicationStatusLocal
    } = useCorporateApplicationsStore();
    // Memoiza os filtros para evitar loops no useEffect
    const currentFilters = useMemo(() => ({
        page: filters.page,
        page_size: filters.pageSize,
        job_id: filters.jobId,
        status: filters.status,
    }), [filters.page, filters.pageSize, filters.jobId, filters.status]);

    const loadData = useCallback(() => {
        // Só dispara se houver uma empresa selecionada (Lógica de Seleção de Empresa)
        if (effectiveCompanyId) {
            console.log("Carregando candidaturas para a empresa ID:", effectiveCompanyId, "com filtros:", currentFilters);
            fetchApplications(effectiveCompanyId, currentFilters);
        }
    }, [effectiveCompanyId, currentFilters, fetchApplications]);

    useEffect(() => {
        loadData();
    }, [loadData]);
    console.log('candidatos', applications);
    return {
        candidatos: applications,
        total: pagination.total,
        loading,
        
        refresh: loadData,
        updateStatus: updateApplicationStatusLocal
    };
};