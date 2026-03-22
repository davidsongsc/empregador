import { create } from "zustand";
import { adminPlanService } from "@/services/adminPlanService";
import { toast } from "@/components/Notification";
import { AdminPlanState } from "@/interfaces/isPlan";
import { Plan } from "@/interfaces/iPlan";

export const useAdminPlanStore = create<AdminPlanState>((set, get) => ({
    plans: [],
    loading: false,

    fetchPlans: async () => {
        set({ loading: true });
        try {
            const response = await adminPlanService.getAllPlans();
            // Como sua API retorna { ok: true, results: [] } ou { ok: true, ...array }
            // Precisamos garantir que pegamos apenas os itens do plano
            console.log(response);
            const rawData = response as any;
            const plansArray = Array.isArray(rawData) ? rawData : (rawData.results || []);

            // Filtrar apenas objetos válidos (removendo o campo 'ok' se ele vier solto)
            const cleanPlans = plansArray.filter((item: any) => item && typeof item === 'object' && item.id);

            set({ plans: cleanPlans, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error("SYSTEM_FAILURE: Link de dados corrompido.");
        }
    },

    updatePlan: async (id: string, data: Partial<Plan>) => {
        const previous = get().plans;
        // Update Otimista
        set({
            plans: previous.map(p => p.id === id ? { ...p, ...data } : p)
        });

        try {
            await adminPlanService.updatePlan(id, data);
        } catch (error) {
            set({ plans: previous });
            toast.error("SYNC_ERROR: Parâmetros rejeitados pelo núcleo.");
        }
    },

    addPlan: async (data: Partial<Plan>) => {
        try {
            await adminPlanService.createPlan(data);
            get().fetchPlans();
            toast.success("NEW_PROTOCOL: Unidade de serviço inicializada.");
        } catch (error) {
            toast.error("DENIED: Falha ao criar protocolo.");
        }
    }
}));