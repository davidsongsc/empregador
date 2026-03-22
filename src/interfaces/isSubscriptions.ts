import { AdminSubscription } from "./iSubscription";

export interface AdminSubState {
  subscriptions: AdminSubscription[];
  total: number; // Adicionado para refletir o "total" do JSON
  loading: boolean;
  lastUpdate: number | null;
  error: string | null;
  currentRequest: boolean;
  dataHash: string | null; // Para controle de ETag/Delta

  fetchSubscriptions: (force?: boolean) => Promise<void>;
  applyDeltaPatches: (patches: any[]) => void;
  addSubscription: (newSub: AdminSubscription) => void;
  updateSubscription: (id: string | number, data: Partial<AdminSubscription>) => void;
  removeSubscription: (id: string | number) => void;
  clearSubscriptions: () => void;
}
