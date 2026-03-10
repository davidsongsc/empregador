import { create } from "zustand";
import { Event } from "@/interfaces/events";
import { eventService } from "@/services/eventService";
import { toast } from "@/components/Notification";

interface EventState {
  // Estado
  events: Event[];
  activeEvent: Event | null;
  loading: boolean;
  error: string | null;
  
  // Paginação e Busca (O que o seu componente espera)
  count: number;
  page: number;
  totalPages: number;
  search: string;

  // Ações
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  fetchEvents: () => Promise<void>;
  fetchEventDetails: (uid: string) => Promise<void>;
  publishSchedule: (scheduleUid: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  activeEvent: null,
  loading: false,
  error: null,
  
  // Inicialização dos novos campos
  count: 0,
  page: 1,
  totalPages: 1,
  search: "",

  setPage: (page: number) => {
    set({ page });
    get().fetchEvents(); // Busca automaticamente ao trocar de página
  },

  setSearch: (search: string) => {
    set({ search, page: 1 }); // Reseta para página 1 ao buscar
    // Opcional: você pode disparar o fetch aqui ou deixar o componente decidir
  },

  fetchEvents: async () => {
    const { loading, page, search } = get();
    if (loading) return;

    set({ loading: true, error: null });
    try {
      // Assumindo que seu service aceita (page, search)
      const data = await eventService.getEvents(page, search);
      
      const ITEMS_PER_PAGE = 10; // Ajuste conforme seu backend
      
      set({
        events: data.results || [],
        count: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / ITEMS_PER_PAGE),
        loading: false,
      });
    } catch (err) {
      set({ error: "Erro ao carregar eventos", loading: false });
      toast.error("Erro ao carregar lista de eventos");
    }
  },

  fetchEventDetails: async (uid: string) => {
    set({ loading: true });
    try {
      const data = await eventService.getEventByUid(uid);
      set({ activeEvent: data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  publishSchedule: async (scheduleUid: string) => {
    try {
      await eventService.publishJobs(scheduleUid);
      toast.success("Vagas publicadas com sucesso!");

      const active = get().activeEvent;
      if (active) {
        const updatedSchedules = active.schedules.map((s) =>
          s.uid === scheduleUid ? { ...s, is_published: true } : s
        );
        set({ activeEvent: { ...active, schedules: updatedSchedules } });
      }
    } catch (err) {
      toast.error("Erro ao publicar vagas.");
    }
  },
}));