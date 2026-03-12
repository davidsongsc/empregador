import { api } from "@/lib/api";
import { CompanyMemberDetail } from "./companies-service";

export const memberService = {
  /**
   * Lista membros de uma empresa específica.
   * Rota: GET /company/companies/{companyId}/members/
   */
  getMembers: async (companyId: string): Promise<CompanyMemberDetail[]> => {
    const res = await api(`/company/companies/${companyId}/members/`);
    
    // Tratamento para paginação do DRF ou retorno direto
    return res.results || res;
  },

  /**
   * Adiciona um perfil como membro da empresa.
   * Rota: POST /company/companies/{companyId}/members/
   */
  addMember: async (companyId: string, data: { profile: string; role: string }) => {
    return await api(`/company/companies/${companyId}/members/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Atualiza a Role de um membro (Técnica Delta/Protocolo 303).
   * Rota: PATCH /company/companies/{companyId}/members/{memberId}/
   */
  updateMemberRole: async (companyId: string, memberId: number, role: string) => {
    return await api(`/company/companies/${companyId}/members/${memberId}/`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  /**
   * Remove um membro da empresa.
   * Rota: DELETE /company/companies/{companyId}/members/{memberId}/
   */
  removeMember: async (companyId: string, memberId: number) => {
    return await api(`/company/companies/${companyId}/members/${memberId}/`, {
      method: "DELETE",
    });
  },
};