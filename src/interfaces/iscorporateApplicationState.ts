import { JobApplication, PaginatedResponse } from "./applicationResult";

export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface ApplicationState {
  applications: JobApplication[]
  pagination: Pagination
  loading: boolean
  error: string | null
}

export interface CorporateApplicationsState {
  applications: JobApplication[];
  pagination: PaginatedResponse<JobApplication>;
  loading: boolean;
  error: string | null;

  // Ações
  fetchApplications: (filters?: any) => Promise<void>;
  updateApplicationStatusLocal: (applicationId: string, newStatus: string) => void;
}
