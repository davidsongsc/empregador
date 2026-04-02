import { useAuthStore } from "@/store/useAuthStore";

/**
 * Recupera o vínculo (membership) da empresa ativa no momento.
 * Útil para checar a role específica do usuário na empresa selecionada.
 */
export const getActiveMembership = () => {
  // Acessamos o estado ATUAL da store sem usar hooks
  const { user, activeCompanyId } = useAuthStore.getState();
  // 1. Verificação de integridade da árvore de dados
  const memberships = user?.profile?.memberships;
  if (!memberships || !activeCompanyId) {
    return null;
  }

  const activeMembership = memberships.find(membership => membership.company_id === activeCompanyId);
  return activeMembership;
};