import { api } from "@/lib/api";

export interface Application {
    id: string;
    job: string;
    status: string;
    status_display: string;
    cargo: string;
    empresa_nome: string;
    data_aplicacao: string;
    cover_letter?: string;
}

/**
 * Busca todas as candidaturas do usuário logado.
 * O Django ViewSet já filtra pelo usuário da sessão.
 */
export async function getMyApplications(): Promise<Application[]> {
    try {
        // Como usamos ViewSet, a rota padrão é /candidaturas/
        const response = await api("/vagas/candidaturas/", {
            method: "GET",
        });

        // Se sua API retorna os dados direto ou dentro de um objeto (ex: response.data)
        // Ajuste conforme a estrutura do seu wrapper 'api'
        return response;
    } catch (error) {
        console.error("Erro ao buscar candidaturas:", error);
        throw error;
    }
}