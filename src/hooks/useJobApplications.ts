import { useState, useEffect, useCallback } from "react";
import { applicationService } from "@/services/applicationService";
import { toast } from "@/components/Notification";

export const useJobApplications = (jobId: string) => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async (isSilent = false) => {
        if (!jobId) return;

        try {
            if (!isSilent) setLoading(true);
            setError(null);

            // Chamada usando o novo padrão do applicationService
            const data = await applicationService.getJobApplications(jobId) as any;
            // O axios com nosso interceptor já retorna o data direto, 
            // mas como o Django envia paginação, pegamos o .results
            setCandidates(data.results || data || []);

        } catch (err: any) {
            const msg = err.message || "Erro ao carregar candidatos";
            setError(msg);
            console.log("Erro ao buscar candidaturas:", err);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    const changeStatus = async (applicationId: string, newStatus: string) => {
        try {
            // 1. Atualização via service (Axios PATCH)
            await applicationService.updateApplicationStatus(applicationId, newStatus);

            // 2. Notifica o sucesso
            toast.success("Status atualizado com sucesso!");

            // 3. Silent Refresh: busca os dados novamente para liberar 
            // os campos 'whatsapp', 'email' etc., que o Serializer desbloqueia no backend
            await fetchApplications(true);

        } catch (err: any) {
            const msg = err.message || "Falha ao atualizar status";
            toast.error(msg);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return {
        candidates,
        loading,
        error,
        refresh: () => fetchApplications(false),
        changeStatus
    };
};