import { api } from "@/lib/api";

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    days_duration: number;
    max_collaborators: number;
    max_active_jobs: number;
    is_active: boolean;
}

export const adminPlanService = {
    getAllPlans: async (): Promise<Plan[]> => {
        const response = await api("/subscriptions/admin/plans-management/");

        // 1. Se o Django retornar um objeto com 'results' (Paginação)
        if (response.results && Array.isArray(response.results)) {
            return response.results;
        }

        // 2. Se a sua 'api' transformou o Array em Objeto indexado devido ao {...data}
        // Removemos a chave 'ok' e transformamos o resto de volta em Array
        const { ok, ...dataWithoutOk } = response;
        const possibleArray = Object.values(dataWithoutOk);

        if (possibleArray.length > 0) {
            return possibleArray as Plan[];
        }

        return [];
    },

    createPlan: async (data: Partial<Plan>): Promise<Plan> => {
        // POST e PATCH funcionam bem com o seu {...data} pois retornam Objetos únicos
        return api("/subscriptions/admin/plans-management/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updatePlan: async (id: string, data: Partial<Plan>): Promise<Plan> => {
        return api(`/subscriptions/admin/${id}/plan-detail/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    // No seu adminPlanService.ts
    deletePlan: async (id: string): Promise<boolean> => {
        const res = await api(`/subscriptions/admin/${id}/plan-detail/`, {
            method: "DELETE",
        });
        return res.ok; // Sua api retorna { ok: true } para status 204
    },
};