import { CompanyMemberDetail } from "./iCompanyMember";

export interface Department {
  id: string;
  company: string;
  name: string;
  description: string;
  parent: string | null;
  leaders: CompanyMemberDetail[]; 
  members: CompanyMemberDetail[];
  members_count: number;
  created_at: string;
  updated_at: string;
}
