export interface CorporateApplicationsState {
  applications: any[];
  pagination: { count: number; next: string | null; previous: string | null };
  loading: boolean;
  error: string | null;
  
  // Ações
  fetchApplications: (companyId: string, filters?: any) => Promise<void>;
  updateApplicationStatusLocal: (applicationId: string, newStatus: string) => void;
}
