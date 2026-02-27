import { useState, useEffect, useCallback } from "react";
import { getJobApplications, updateApplicationStatus } from "@/services/applicationService";
import { toast } from "@/components/Notification";

export const useJobApplications = (jobId: string) => {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = useCallback(async (isSilent = false) => {
        if (!jobId) return;
        try {
            // isSilent evita que o loading de tela cheia apareça 
            // toda vez que você apenas muda o status de um card
            if (!isSilent) setLoading(true); 
            
            setError(null);
            const data = await getJobApplications(jobId);
            setCandidates(data.results || []);
        } catch (err: any) {
            const msg = err.message || "Erro ao carregar candidatos";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [jobId]);

    const changeStatus = async (applicationId: string, newStatus: string) => {
        try {
            // 1. Executa a atualização no banco de dados
            await updateApplicationStatus(applicationId, newStatus);

            // 2. Notifica o sucesso
            toast.success("Status atualizado!");

            // 3. Faz uma nova consulta à API para buscar os dados atualizados
            // e desbloquear informações sensíveis (WhatsApp, Email, etc)
            await fetchApplications(true); 

        } catch (err: any) {
            toast.error("Falha ao atualizar status");
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    return {
        candidates,
        loading,
        error,
        refresh: fetchApplications,
        changeStatus
    };
};