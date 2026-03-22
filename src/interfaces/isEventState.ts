import { Event } from "./events";

export interface EventState {
  events: Event[];
  schedulesCache: Record<string, any>; 
  activeEvent: any | null;
  loading: boolean;

  // --- NOVOS CAMPOS DE ESTADO (Para busca e paginação) ---
  count: number;          // Total de registros no banco
  search: string;         // Termo de busca atual
  page: number;           // Página atual
  totalPages: number;     // Total de páginas calculadas

  // --- NOVAS ACTIONS ---
  setSearch: (query: string) => void;
  setPage: (page: number) => void;

  // --- MÉTODOS EXISTENTES ---
  fetchEvents: (forceRefresh?: boolean) => Promise<void>;
  fetchScheduleDetails: (uid: string, forceRefresh?: boolean) => Promise<void>;
  loadFromStorage: () => Promise<void>;
  createEventStructure: (formData: any) => Promise<boolean>;
  publishVagas: (uid: string) => Promise<void>;
  patchRequirement: (scheduleUid: string, reqUid: string, data: any) => Promise<void>;
  patchAssignment: (scheduleUid: string, assUid: string, data: any) => Promise<void>;
}