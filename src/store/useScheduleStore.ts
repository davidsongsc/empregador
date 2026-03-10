import { create } from "zustand";
import { scheduleService } from "@/services/scheduleService";
import { toast } from "@/components/Notification";

/**
 * Interface para o estado da Store de Escalas
 */
interface ScheduleState {
    schedules: any[];
    count: number;
    activeSchedule: any | null;
    loading: boolean;
    error: string | null;

    // Ações
    fetchSchedules: (page?: number, search?: string) => Promise<void>;
    fetchScheduleDetails: (uid: string) => Promise<void>;
    updateSchedule: (uid: string, data: any) => Promise<boolean>;
    createSchedule: (data: any) => Promise<any>;
    deleteSchedule: (uid: string) => Promise<void>;
    clearActiveSchedule: () => void;
}

/**
 * Zustand Store para gestão centralizada de Escalas (Schedules)
 */
export const useScheduleStore = create<ScheduleState>((set, get) => ({
    schedules: [],
    count: 0,
    activeSchedule: null,
    loading: false,
    error: null,

    /**
     * Procura a lista de escalas com suporte a paginação e filtros
     */
    fetchSchedules: async (page = 1, search = "") => {
        set({ loading: true, error: null });
        try {
            const data = await scheduleService.getSchedules(page, search);
            set({ 
                schedules: data.results || [], 
                count: data.count || 0,
                loading: false 
            });
        } catch (err) {
            set({ error: "Falha ao carregar escalas", loading: false });
            toast.error("Erro ao carregar lista de escalas");
        }
    },

    /**
     * Procura os detalhes completos de uma escala específica
     */
    fetchScheduleDetails: async (uid: string) => {
        if (!uid) return;
        set({ loading: true, error: null });
        try {
            const data = await scheduleService.getScheduleByUid(uid);
            set({ activeSchedule: data, loading: false });
        } catch (err) {
            set({ error: "Escala não encontrada", loading: false });
            toast.error("Erro ao carregar detalhes da escala");
        }
    },

    /**
     * Atualiza os dados de uma escala e sincroniza o estado local
     */
    updateSchedule: async (uid: string, data: any) => {
        set({ loading: true });
        try {
            const updated = await scheduleService.updateSchedule(uid, data);
            
            // Atualização otimista do estado local
            set((state) => ({
                activeSchedule: updated,
                schedules: state.schedules.map(s => s.uid === uid ? updated : s),
                loading: false
            }));

            toast.success("Escala atualizada com sucesso!");
            return true;
        } catch (err) {
            set({ loading: false });
            toast.error("Erro ao guardar alterações na escala");
            return false;
        }
    },

    /**
     * Cria uma nova escala e adiciona-a à lista local
     */
    createSchedule: async (data: any) => {
        set({ loading: true });
        try {
            const newSchedule = await scheduleService.createSchedule(data);
            set((state) => ({
                schedules: [newSchedule, ...state.schedules],
                count: state.count + 1,
                loading: false
            }));
            toast.success("Escala criada com sucesso!");
            return newSchedule;
        } catch (err) {
            set({ loading: false });
            toast.error("Erro ao criar nova escala");
            return null;
        }
    },

    /**
     * Remove uma escala e atualiza a lista local
     */
    deleteSchedule: async (uid: string) => {
        set({ loading: true });
        try {
            await scheduleService.deleteSchedule(uid);
            set((state) => ({
                schedules: state.schedules.filter(s => s.uid !== uid),
                count: state.count - 1,
                loading: false,
                activeSchedule: state.activeSchedule?.uid === uid ? null : state.activeSchedule
            }));
            toast.success("Escala removida com sucesso");
        } catch (err) {
            set({ loading: false });
            toast.error("Erro ao remover escala");
        }
    },

    /**
     * Limpa a escala ativa (útil ao desmontar componentes de edição)
     */
    clearActiveSchedule: () => set({ activeSchedule: null, error: null }),
}));