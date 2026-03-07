import { api } from "@/lib/api";

/**
 * Serviço responsável pela comunicação com os endpoints de Empresas (Companies)
 */
export const companyService = {
    /**
     * Lista todas as empresas com suporte a paginação, filtros e pesquisa.
     * O backend deve retornar o CompanySimpleSerializer para listagem.
     */
    getCompanies: async (page: number = 1, search: string = "", activeOnly: boolean = false): Promise<any> => {
        const params: any = {
            page: page.toString(),
            ...(search && { search }),
            ...(activeOnly && { is_active: "true" })
        };

        const query = new URLSearchParams(params).toString();

        return await api(`/company/companies/?${query}`, {
            method: "GET"
        });
    },

    /**
     * Obtém os detalhes completos de uma empresa, incluindo membros e média de avaliação.
     * @param id UUID da empresa
     */
    getCompanyById: async (id: string): Promise<any> => {
        if (!id) throw new Error("ID da empresa é obrigatório");
        return await api(`/company/companies/${id}/`, {
            method: "GET"
        });
    },

    /**
     * Cria uma nova empresa. 
     * O campo 'created_by' é preenchido automaticamente pelo backend via serializer.
     */
    createCompany: async (data: { name: string; is_active?: boolean }): Promise<any> => {
        return await api("/company/companies/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    /**
     * Atualiza os dados de uma empresa.
     */
    updateCompany: async (id: string, data: any): Promise<any> => {
        if (!id) throw new Error("ID da empresa é obrigatório para atualização");
        return await api(`/company/companies/${id}/`, {
            method: "PATCH", // Usamos PATCH para atualizações parciais
            body: JSON.stringify(data),
        });
    },

    /**
     * Remove uma empresa permanentemente.
     */
    deleteCompany: async (id: string): Promise<any> => {
        return await api(`/company/companies/${id}/`, {
            method: "DELETE",
        });
    },

    /**
     * Envia uma avaliação para a empresa (Rota customizada via @action na ViewSet).
     * @param id UUID da empresa
     * @param rate Valor de 0 a 5
     */
    rateCompany: async (id: string, rate: number): Promise<any> => {
        return await api(`/company/companies/${id}/rate/`, {
            method: "POST",
            body: JSON.stringify({ rate }),
        });
    },
    getDepartments: async (companyId: string) => {
        return await api(`/departments/?company=${companyId}`, { method: "GET" });
    },

    createDepartment: async (data: { company: string; name: string; description?: string }) => {
        return await api("/departments/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    updateDepartment: async (id: string, data: any) => {
        return await api(`/departments/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },
    /**
     * Busca as empresas onde o usuário logado é membro.
     */
    getMyCompanies: async (): Promise<any> => {
        return await api("/company/companies/my-companies/", {
            method: "GET",
        });
    }
};