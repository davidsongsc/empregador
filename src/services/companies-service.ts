import { Company } from "@/interfaces/iCompany";
import { Department } from "@/interfaces/iDepartament";
import { api } from "@/lib/api";

export const departmentService = {
  // O Django filtra no backend pelo Header X-Company-ID que sua api envia

  getDepartments: async (companyId: string): Promise<Department[]> => {
    // Agora a URL obrigatoriamente segue o padrão aninhado
    const res = await api(`/api/v1/departments/${companyId}`);
    return res.results || res;
  },
  createDepartment: async (companyId: string, data: Partial<Department>) => {
    return await api(`/api/v1/departments/${companyId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateDepartment: async (companyId: string, deptId: string, data: Partial<Department>) => {
    return await api(`/api/v1/departments/${deptId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteDepartment: async (companyId: string, deptId: string) => {
    return await api(`/api/v1/departments/${deptId}`, {
      method: "DELETE",
    });
  }
};
export const companyService = {
  // --- CORE COMPANIES (GLOBAL & ADMIN) ---

  getCompanies: async (page: number = 1, search: string = "", activeOnly: boolean = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(activeOnly && { is_active: "true" })
    });
    return await api(`/api/v1/companies/?${params.toString()}`);
  },

  getCompanyById: async (id: string) => {
    return await api(`/api/v1/companies/${id}`);
  },

  getMyCompanies: async () => {
    return await api("/api/v1/companies/me");
  },

  createCompany: async (data: { name: string; is_active?: boolean }) => {
    return await api("/api/v1/companies/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCompany: async (id: string, data: Partial<Company>) => {
    return await api(`/api/v1/companies/${id}`, {
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
};