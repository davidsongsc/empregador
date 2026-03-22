export interface StaffRequirement {
  uid: string;
  role: string;
  role_name: string;
  quantity: number;
  remuneration: number;
  total_cost_calculated: number;
}

export interface StaffAssignment {
  uid: string;
  profile: string;
  profile_name: string;
  role: string;
  role_name: string;
  category: 'STAFF' | 'ORGANIZER' | 'GUEST';
  category_display: string;
  check_in: string | null;
  check_out: string | null;
}

export interface EventSchedule {
  uid: string;
  chamada: string;
  event: string; 
  start_time: string;
  end_time: string;
  start_time_display: string;
  end_time_display: string;
  address: string | null;
  is_published: boolean;
  requirements: StaffRequirement[];
  assignments: StaffAssignment[];
  total_staff: number;
  total_cost: number;
}

export interface Event {
  uid: string;
  name: string;
  slug: string;
  description: string;
  owner_company: string;
  owner_company_name: string;
  fixed_organizers: string[];
  sponsors: string[];
  schedules: EventSchedule[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Interface para Alocação de Staff (EventStaffAssignment)
 * Reflete a estrutura do serializer Django e suporta o Protocolo Delta.
 */
export interface EventStaffAssignment {
  // Identificador Único (UUID7)
  uid: string;

  // IDs de Referência (Foreign Keys)
  schedule: string; // UID da escala
  profile: string;  // UID do perfil vinculado
  role: string;     // UID do cargo (Role)

  // Dados Descritivos (Vindos do Serializer read_only)
  profile_name: string;
  role_name: string;
  
  // Categorização
  category: 'STAFF' | 'ORGANIZER' | 'GUEST';
  category_display: string; // Ex: "Staff/Operacional"

  // Controle de Ponto (ISO Strings para compatibilidade Delta)
  // Podem ser null se o staff ainda não chegou ou não saiu
  check_in: string | null;  
  check_out: string | null;

  // Metadados de Sincronia (Opcional, injetado pelo Delta ACK)
  updated_at?: string;
}

/**
 * Interface para Payload de Update (PATCH)
 * Garante que enviemos apenas o necessário no Protocolo Delta.
 */
export interface AssignmentUpdatePayload {
  role?: string;
  category?: 'STAFF' | 'ORGANIZER' | 'GUEST';
  check_in?: string | null;
  check_out?: string | null;
}