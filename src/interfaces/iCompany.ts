export interface Company {
  id: string;
  name: string;
  is_active: boolean;
  average_rate: number;
  members_count: number;
  parent?: string | null;
  subscription?: any;
}