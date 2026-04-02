import { useEffect, useCallback, useMemo } from "react";
import { useCorporateApplicationsStore } from "@/store/useCorporateApplicationsStore";
import { useAuthStore } from "@/store/useAuthStore";

interface UseCorporateApplicationsProps {
    jobId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

export const useCorporateApplications = (filters: UseCorporateApplicationsProps = {}) => {
    const { user, activeCompanyId } = useAuthStore();
    const {
        applications,
        pagination,
        loading,
        error,
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
        if (activeCompanyId) {
            fetchApplications(currentFilters);
        }
    }, [activeCompanyId, currentFilters, fetchApplications]);

    useEffect(() => {
        loadData();
    }, [loadData]);
    console.log('candidatos', applications);
    return {
        candidatos: applications,
        total: pagination.total,
        loading,
        error,
        refresh: loadData,
        updateStatus: updateApplicationStatusLocal
    };
};