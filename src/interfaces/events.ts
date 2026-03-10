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
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}