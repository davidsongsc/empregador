import { Event } from "./events";

export interface EventState {
  events: Event[];
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

