import { useState } from "react";
import { createJob } from "@/services/jobs";

export function useBulkPost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const publishJobs = async (jobsList: any[]) => {
        setLoading(true);
        setError(null);
        const results = { success: 0, failed: 0 };

        for (const job of jobsList) {
            try {
                // FORMATAÇÃO DE SEGURANÇA AQUI
                const payload = {
                    ...job,
                    requisitos: job.requisitos?.map((item: any) =>
                        typeof item === 'string' ? { description: item } : item) || [],
                    beneficios: job.beneficios?.map((item: any) =>
                        typeof item === 'string' ? { description: item } : item) || [],
                    perguntas: job.perguntas?.map((item: any) =>
                        typeof item === 'string' ? { question: item } : item) || [],
                };

                await createJob(payload);
                results.success++;
            } catch (err: any) {
                results.failed++;
                // Log detalhado para você ver o que o Django recusou
                console.error("Erro na vaga:", job.cargo, err);
            }
        }

        setLoading(false);
        return results;
    };

    return { publishJobs, loading, error };
}