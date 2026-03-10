import { api } from "@/lib/api";

/**
 * Serviço responsável pela comunicação com os endpoints de escalas (Schedules)
 */
export const scheduleService = {
    /**
     * Lista todas as escalas com suporte a paginação e pesquisa.
     * @param page Número da página (padrão Django: 10 itens por página)
     * @param search Termo de busca para filtrar por 'chamada' ou nome do evento
     */
    getSchedules: async (page: number = 1, search: string = ""): Promise<any> => {
        const query = new URLSearchParams({
            page: page.toString(),
            ...(search && { search })
        }).toString();

        return await api(`/eventos/schedules/?${query}`, { 
            method: "GET" 
        });
    },

    /**
     * Obtém os detalhes completos de uma escala, incluindo requisitos e alocações.
     * @param uid Identificador único da escala
     */
    getScheduleByUid: async (uid: string): Promise<any> => {
        if (!uid) throw new Error("UID da escala é obrigatório");
        return await api(`/eventos/schedules/${uid}/`, { 
            method: "GET" 
        });
    },

    /**
     * Atualiza os dados de uma escala e os seus cargos/requisitos (Inlines).
     * @param uid Identificador único da escala
     * @param data Objeto contendo os campos a atualizar (chamada, is_published, requirements, etc)
     */
    updateSchedule: async (uid: string, data: any): Promise<any> => {
        if (!uid) throw new Error("UID da escala é obrigatório para atualização");
        return await api(`/eventos/schedules/${uid}/`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    /**
     * Cria uma nova escala vinculada a um evento base.
     */
    createSchedule: async (data: any): Promise<any> => {
        return await api("/eventos/schedules/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    /**
     * Remove uma escala permanentemente.
     */
    deleteSchedule: async (uid: string): Promise<any> => {
        return await api(`/eventos/schedules/${uid}/`, {
            method: "DELETE",
        });
    }
};