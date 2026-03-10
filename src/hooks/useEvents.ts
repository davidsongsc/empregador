import { create } from "zustand";
import { Event } from "@/interfaces/events";
import { eventService } from "@/services/eventService";
import { toast } from "@/components/Notification";

interface EventState {
  events: Event[];
  count: number;
  activeEvent: Event | null;
  loading: boolean;
  error: string | null;
  fetchEvents: (page?: number) => Promise<void>;
  fetchEventDetails: (uid: string) => Promise<void>;
  publishSchedule: (scheduleUid: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  count: 0,
  activeEvent: null,
  loading: false,
  error: null,

  fetchEvents: async (page = 1) => {
    // Evita chamadas duplicadas se já estiver carregando
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const data = await eventService.getEvents(page);
      
      // Ajuste: Garantimos que estamos passando apenas UM objeto para o set
      set({
        events: data.results || [],
        count: data.count || 0,
        loading: false,
      });
    } catch (err) {
      set({ 
        error: "Erro ao carregar lista", 
        loading: false 
      });
      toast.error("Erro ao carregar lista");
    }
  },

  fetchEventDetails: async (uid: string) => {
    set({ loading: true });
    try {
      const data = await eventService.getEventByUid(uid);
      set({ activeEvent: data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Erro ao carregar detalhes" });
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
        set({ 
          activeEvent: { ...active, schedules: updatedSchedules } 
        });
      }
    } catch (err) {
      toast.error("Erro ao publicar vagas.");
    }
  },
}));