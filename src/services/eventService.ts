import { api } from "@/lib/api";
import { Event, PaginatedResponse } from "@/interfaces/events";
import { EventCreateInput } from "@/interfaces/eventCreateInput";

export const eventService = {
    // Lista eventos com suporte a paginação e busca
    getEvents: async (page: number = 1, search: string = ""): Promise<PaginatedResponse<Event>> => {
        
        const query = new URLSearchParams({
            page: page.toString(),
            ...(search && { search }) // Só adiciona 'search' se ele não estiver vazio
        }).toString();

        return await api(`/eventos/events/?${query}`, { method: "GET" });
    },

    // Detalhe de um evento específico
    getEventByUid: async (uid: string): Promise<Event> => {
        return await api(`/eventos/events/${uid}/`, { method: "GET" });
    },

    // Criação de Evento
    createEvent: async (eventData: EventCreateInput) => {
        return await api("/eventos/events/", {
            method: "POST",
            body: JSON.stringify(eventData),
        });
    },

    // Criação de Escala (Schedule) vinculada ao evento
    createSchedule: async (scheduleData: any) => {
        return await api("/eventos/schedules/", {
            method: "POST",
            body: JSON.stringify(scheduleData),
        });
    },

    // Ação de publicar vagas (Action do Django)
    publishJobs: async (scheduleUid: string) => {
        return await api(`/eventos/schedules/${scheduleUid}/publish_jobs/`, {
            method: "POST",
        });
    }
};