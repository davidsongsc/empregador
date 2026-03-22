import { Plan } from "./iPlan";

export interface AdminPlanState {
    plans: Plan[];
    loading: boolean;
    fetchPlans: () => Promise<void>;
    updatePlan: (id: string, data: Partial<Plan>) => Promise<void>;
    addPlan: (data: Partial<Plan>) => Promise<void>;
}