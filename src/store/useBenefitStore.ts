import { create } from 'zustand';
import { benefitService } from '@/services/jobBenefitService';
import { toast } from '@/components/Notification';

interface BenefitState {
  benefitsByJob: Record<string, any[]>; // Cache em memória por vaga
  loading: boolean;
  
  fetchBenefits: (jobId: string, force?: boolean) => Promise<void>;
  addBenefit: (payload: any) => Promise<void>;
}

export const useBenefitStore = create<BenefitState>((set, get) => ({
  benefitsByJob: {},
  loading: false,

  fetchBenefits: async (jobId: string, force = false) => {
    if (get().loading) return;
    
    set({ loading: true });
    try {
      const data = await benefitService.getJobBenefits(jobId, force);
      const items = data?.items || [];
      
      set((state) => ({
        benefitsByJob: { ...state.benefitsByJob, [jobId]: items },
        loading: false
      }));
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar benefícios.");
      set({ loading: false });
    }
  },

  addBenefit: async (payload) => {
    try {
      await benefitService.createBenefit(payload);
      // Refresh automático do cache após criação
      await get().fetchBenefits(payload.job_id, true);
      toast.success("Benefício adicionado ao protocolo da vaga.");
    } catch (err: any) {
      toast.error(err.message);
    }
  }
}));