export interface CreateEventPayload {
    name: string;
    description?: string;
    fixed_organizers?: any[]; 
    sponsors?: any[];
}

export interface CreateSchedulePayload {
    event: string;
    chamada: string;
    start_time: string;
    end_time: string;
    address?: string | null; // Adicione o address aqui
}