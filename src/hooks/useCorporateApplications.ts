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
        job: filters.jobId, // <-- Verifique se isso não está vindo como undefined e depois sendo preenchido
        status: filters.status,
        page: filters.page,
        page_size: filters.pageSize,
    }), [filters.jobId, filters.status, filters.page, filters.pageSize]);

    const loadData = useCallback(() => {
        // Só dispara se houver uma empresa selecionada (Lógica de Seleção de Empresa)
        if (activeCompanyId) {
            fetchApplications(activeCompanyId, currentFilters);
        }
    }, [activeCompanyId, currentFilters, fetchApplications]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        candidatos: applications,
        total: pagination.count,
        loading,
        error,
        refresh: loadData,
        updateStatus: updateApplicationStatusLocal
    };
};