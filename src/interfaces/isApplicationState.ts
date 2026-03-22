import { ApplicationResult } from "./applicationResult";

export interface ApplicationState {
  // Estado
  data: ApplicationResult[];
  total: number;
  loading: boolean;
  cache: Record<string, { data: ApplicationResult[]; total: number; timestamp: number }>;
  currentRequest: string | null;

  // Actions
  // Unificamos: se passar 'isMyApps', ele usa o serviço do candidato, senão usa o de busca
  fetchApplications: (filters?: any, force?: boolean, isMyApps?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  // Operações Locais (Otimistas)
  removeItem: (id: string) => void;
  addOptimistic: (newApp: any) => void;

  // Helpers
  getStats: () => {
    total: number;
    applied: number;
    withdrawn: number;
    reviewing: number;
  };
}
