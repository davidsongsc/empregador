import { create } from "zustand";
import { eventService } from "@/services/eventService";
import { toast } from "@/components/Notification";
import { get as idbGet, set as idbSet } from "idb-keyval";

interface EventState {
  events: any[];
  schedulesCache: Record<string, any>; // Cache indexado por UID para múltiplos cards
  activeEvent: any | null;
  loading: boolean;

  // Sincronização e Cache
  fetchEvents: (forceRefresh?: boolean) => Promise<void>;
  fetchScheduleDetails: (uid: string, forceRefresh?: boolean) => Promise<void>;
  loadFromStorage: () => Promise<void>;

  // Escrita e Transações
  createEventStructure: (formData: any) => Promise<boolean>;
  publishVagas: (uid: string) => Promise<void>;
  
  // Atualizações Granulares (Protocolo Delta)
  patchRequirement: (scheduleUid: string, reqUid: string, data: any) => Promise<void>;
  patchAssignment: (scheduleUid: string, assUid: string, data: any) => Promise<void>;
}

const STALE_TIME = 90 * 1000; // 1.5 minutos

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  schedulesCache: {},
  activeEvent: null,
  loading: false,

  /**
   * Recupera o estado do IndexedDB (Zero Latency Startup)
   */
  loadFromStorage: async () => {
    try {
      const [events, cache] = await Promise.all([
        idbGet("delta_events"),
        idbGet("schedules_cache")
      ]);
      if (events) set({ events });
      if (cache) set({ schedulesCache: cache });
    } catch (err) {
      console.error("Erro ao carregar do Storage Local", err);
    }
  },

  /**
   * Busca lista de eventos (Camada Shallow)
   */
  fetchEvents: async (forceRefresh = false) => {
    const now = Date.now();
    const lastSync = await idbGet<number>("delta_events_ts") || 0;

    // Cache-hit: Evita requisições inúteis se os dados forem recentes
    if (get().events.length > 0 && (now - lastSync < STALE_TIME) && !forceRefresh) {
      return;
    }

    if (!forceRefresh) set({ loading: true });

    try {
      const data = await eventService.getEvents();
      const events = data.results || [];

      set({ events, loading: false });
      
      // Persistência Atômica
      await idbSet("delta_events", events);
      await idbSet("delta_events_ts", now);
    } catch (err) {
      set({ loading: false });
      toast.error("ERRO_AO_SINCRONIZAR_MAINFRAME");
    }
  },

  /**
   * Busca detalhes de uma escala específica e injeta no Cache
   */
  fetchScheduleDetails: async (uid: string, forceRefresh = false) => {
    const now = Date.now();
    const tsKey = `ts_${uid}`;
    
    // Verifica se os dados desta escala específica estão obsoletos
    const lastFetch = get().schedulesCache[tsKey] || 0;
    const isFresh = (now - lastFetch) < STALE_TIME;

    if (get().schedulesCache[uid] && isFresh && !forceRefresh) {
      return;
    }

    try {
      const data = await eventService.getScheduleDetails(uid);

      set((state) => {
        const newCache = { 
          ...state.schedulesCache, 
          [uid]: data,
          [tsKey]: now 
        };
        // Background Sync com o IDB
        idbSet("schedules_cache", newCache);
        return { schedulesCache: newCache };
      });
    } catch (err) {
      console.error(`Falha na revalidação do nó: ${uid}`);
    }
  },

  /**
   * Cria Evento + Primeira Escala (Transação Atômica no Front)
   */
  createEventStructure: async (formData: any): Promise<boolean> => {
    set({ loading: true });
    try {
      const newEvent = await eventService.createEvent({
        name: formData.name,
        description: formData.description,
        fixed_organizers: formData.fixed_organizers || [], 
        sponsors: formData.sponsors || []
      });

      if (newEvent && newEvent.uid) {
        const newSchedule = await eventService.createSchedule({
          event: newEvent.uid,
          chamada: formData.chamada,
          start_time: formData.start_time,
          end_time: formData.end_time,
          address: formData.address || null 
        });

        const eventForStore = {
          ...newEvent,
          schedules: [newSchedule.uid],
          owner_company_name: newEvent.owner_company_name || "Nexus Hub"
        };

        set((state) => {
          const updatedEvents = [eventForStore, ...state.events];
          const updatedCache = { 
            ...state.schedulesCache, 
            [newSchedule.uid]: newSchedule,
            [`ts_${newSchedule.uid}`]: Date.now()
          };
          
          idbSet("delta_events", updatedEvents);
          idbSet("schedules_cache", updatedCache);

          return { 
            events: updatedEvents, 
            schedulesCache: updatedCache,
            loading: false 
          };
        });

        toast.success("ESTRUTURA_SYNC_OK");
        return true;
      }
      return false;
    } catch (err) {
      set({ loading: false });
      toast.error("FALHA_NA_CONSTRUCAO");
      return false;
    }
  },

  /**
   * Atualização Parcial de Requisitos (ex: Mudança de Valor/Vagas)
   */
  patchRequirement: async (scheduleUid: string, reqUid: string, data: any) => {
    try {
      const updatedReq = await eventService.updateRequirement(reqUid, data);

      set((state) => {
        const schedule = state.schedulesCache[scheduleUid];
        if (!schedule) return state;

        const newReqs = schedule.requirements.map((r: any) =>
          r.uid === reqUid ? { ...r, ...updatedReq } : r
        );

        const newCache = {
          ...state.schedulesCache,
          [scheduleUid]: { ...schedule, requirements: newReqs }
        };

        idbSet("schedules_cache", newCache);
        return { schedulesCache: newCache };
      });
      toast.success("REQUISITO_ATUALIZADO");
    } catch (err) {
      toast.error("ERRO_NO_PATCH");
    }
  },

  /**
   * Atualização de Alocações (ex: Check-in do Staff)
   */
  patchAssignment: async (scheduleUid: string, assUid: string, data: any) => {
    try {
      const updatedAss = await eventService.updateAssignment(assUid, data);

      set((state) => {
        const schedule = state.schedulesCache[scheduleUid];
        if (!schedule) return state;

        const newAss = schedule.assignments.map((a: any) =>
          a.uid === assUid ? { ...a, ...updatedAss } : a
        );

        const newCache = {
          ...state.schedulesCache,
          [scheduleUid]: { ...schedule, assignments: newAss }
        };

        idbSet("schedules_cache", newCache);
        return { schedulesCache: newCache };
      });
      toast.success("STAFF_ATUALIZADO");
    } catch (err) {
      toast.error("ERRO_NA_ALOCACAO");
    }
  },

  /**
   * Publica as vagas da escala para o portal público
   */
  publishVagas: async (uid: string) => {
    try {
      await eventService.publishSchedule(uid);
      // Força revalidação para atualizar is_published e delta_meta
      await get().fetchScheduleDetails(uid, true);
      toast.success("VAGAS_AO_VIVO_NO_PORTAL");
    } catch (err) {
      toast.error("FALHA_AO_PUBLICAR");
    }
  },
}));