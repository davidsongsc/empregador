import { api } from "@/lib/api";

export interface Company {
  id: string;
  name: string;
  is_active: boolean;
  average_rate: number;
  members_count: number;
  parent?: string | null;
  subscription?: any;
}

export interface CompanyMemberDetail {
  id: number;
  profile: number;
  profile_name: string;
  role: string;
  joined_at: string;
}

export interface Department {
  id: string;
  company: string;
  name: string;
  description: string;
  parent: string | null;
  leaders_detail: CompanyMemberDetail[]; // Onde o Mario está
  members_count: number;
  created_at: string;
  updated_at: string;
}

export const departmentService = {
  // O Django filtra no backend pelo Header X-Company-ID que sua api envia
  getDepartments: () => api("/company/departments/"),

  createDepartment: (data: Partial<Department>) =>
    api("/company/departments/", { method: "POST", body: JSON.stringify(data) }),

  updateDepartment: (id: string, data: Partial<Department>) =>
    api(`/company/departments/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteDepartment: (id: string) =>
    api(`/company/departments/${id}/`, { method: "DELETE" }),
};
export const companyService = {
  // --- CORE COMPANIES (GLOBAL & ADMIN) ---

  getCompanies: async (page: number = 1, search: string = "", activeOnly: boolean = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(activeOnly && { is_active: "true" })
    });
    return await api(`/company/companies/?${params.toString()}`);
  },

  getCompanyById: async (id: string) => {
    return await api(`/company/companies/${id}/`);
  },

  getMyCompanies: async () => {
    return await api("/company/companies/my-companies/");
  },

  createCompany: async (data: { name: string; is_active?: boolean }) => {
    return await api("/company/companies/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    return await api(`/company/companies/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  rateCompany: async (id: string, rate: number) => {
    return await api(`/company/companies/${id}/rate/`, {
      method: "POST",
      body: JSON.stringify({ rate }),
    });
  },

  // --- INTERNAL STRUCTURE (DEPARTMENTS) ---

  /**
   * Busca departamentos. 
   * Se o companyId não for passado, o backend filtrará via Header X-Company-ID
   */
  getDepartments: async (companyId?: string): Promise<Department[]> => {
    const url = companyId ? `/company/departments/?company=${companyId}` : "/company/departments/";
    const res = await api(url);

    // 1. Se o Django enviou com paginação padrão (results: [])
    if (res.results && Array.isArray(res.results)) {
      return res.results;
    }

    // 2. TRATAMENTO PARA O ESPALHAMENTO DA SUA API {...data}
    // Removemos a chave 'ok' para sobrar apenas os índices "0", "1", etc.
    const { ok, ...items } = res;

    // Transformamos o objeto {0: {...}, 1: {...}} em um Array real [...]
    const arrayData = Object.values(items).filter(
      (i: any) => i && typeof i === 'object' && ('id' in i || 'name' in i)
    ) as Department[];

    return arrayData;
  },
  createDepartment: async (data: Partial<Department>) => {
    return await api("/departments/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateDepartment: async (id: string, data: Partial<Department>) => {
    return await api(`/departments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteDepartment: async (id: string) => {
    return await api(`/departments/${id}/`, {
      method: "DELETE",
    });
  }
};