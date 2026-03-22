export interface BenefitState {
  benefitsByJob: Record<string, any[]>; // Cache em memória por vaga
  loading: boolean;
  
  fetchBenefits: (jobId: string, force?: boolean) => Promise<void>;
  addBenefit: (payload: any) => Promise<void>;
}
