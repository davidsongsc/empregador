import { CompanyMemberDetail } from "@/interfaces/iCompanyMember";
import { api } from "@/lib/api";

/**
 * PROTOCOLO_DELTA_HEADERS
 * Sinalização para o Mainframe Django otimizar a entrega de pacotes.
 */
const DELTA_HEADERS = {
  "X-Protocol-Mode": "DELTA_SYNC",
  "X-Sync-Policy": "CACHE_FIRST",
  "Content-Type": "application/json",
};

export const memberService = {
  /**
   * Recupera uma camada específica de membros (Pagination Layer).
   */
  getMembers: async (companyId: string, page: number = 1): Promise<CompanyMemberDetail> => {
    // A query string ?page= garante que o Django Rest Framework ative o PaginationSerializer
    return await api(`/company/companies/${companyId}/members/?page=${page}`, {
      method: "GET",
      headers: { ...DELTA_HEADERS },
    });
  },

  /**
   * Injeção de novo sujeito na matriz operacional.
   */
  addMember: async (companyId: string, data: { profile: string; role: string }) => {
    // Sanitização preventiva de aspas residuais (Protocolo 303)
    const cleanRole = data.role.replace(/['"]+/g, "").trim();

    return await api(`/company/companies/${companyId}/members/`, {
      method: "POST",
      headers: { ...DELTA_HEADERS },
      body: JSON.stringify({
        profile: data.profile,
        role: cleanRole,
      }),
    });
  },

  /**
   * Atualização de privilégios via Delta Patch.
   */
  updateMemberRole: async (companyId: string, memberId: number, role: string) => {
    const sanitizedRole = role.replace(/['"]+/g, "").trim();

    return await api(`/company/companies/${companyId}/members/${memberId}/`, {
      method: "PATCH",
      headers: {
        ...DELTA_HEADERS,
        "X-Delta-Target": "ROLE_UPDATE",
      },
      body: JSON.stringify({ role: sanitizedRole }),
    });
  },

  /**
   * Encerramento definitivo de protocolo de acesso.
   */
  removeMember: async (companyId: string, memberId: number) => {
    return await api(`/company/companies/${companyId}/members/${memberId}/`, {
      method: "DELETE",
      headers: { ...DELTA_HEADERS },
    });
  },
};