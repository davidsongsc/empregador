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
    const cleanRole = data.role.replace(/['"]+/g, '');

    return await api(`/company/companies/${companyId}/members/`, {
      method: "POST",
      body: JSON.stringify({
        profile: data.profile,
        role: cleanRole
      }),
    });
  },

  /**
   * Atualiza a Role de um membro (Técnica Delta/Protocolo 303).
   * Rota: PATCH /company/companies/{companyId}/members/{memberId}/
   */
  updateMemberRole: async (companyId: string, memberId: number, role: string) => {
    // 1. Limpeza radical de qualquer aspa que venha do estado
    const sanitizedRole = role.replace(/['"]+/g, '').trim();

    // 2. LOG DE DIAGNÓSTICO (Remova após testar)
    console.log("PAYLOAD_DELTA:", sanitizedRole);

    return await api(`/company/companies/${companyId}/members/${memberId}/`, {
      method: "PATCH",
      // Certifique-se de que 'sanitizedRole' é uma string pura sem aspas extras
      body: JSON.stringify({ role: sanitizedRole }),
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