import { useAuthStore } from "@/store/useAuthStore";
import { RoleLevel, RoleScope, ROLE_MAP } from "@/enum/permissionEnum";

// Pesos numéricos para comparação lógica de hierarquia
const LEVEL_WEIGHT: Record<RoleLevel, number> = {
  [RoleLevel.INTERN]: 1,
  [RoleLevel.JR]: 2,
  [RoleLevel.PL]: 3,
  [RoleLevel.SR]: 4,
  [RoleLevel.LEAD]: 5,
  [RoleLevel.MANAGER]: 6,
  [RoleLevel.DIRECTOR]: 7,
  [RoleLevel.ADMIN]: 8,
};

export const getActiveMembership = () => {
  const { user, activeCompanyId } = useAuthStore.getState();
  const memberships = user?.profile?.memberships;
  if (!memberships || !activeCompanyId) return null;

  return memberships.find(m => m.company_id === activeCompanyId) || null;
};

/**
 * Valida se o usuário logado tem autoridade sobre um membro específico.
 */
export const canManageMember = (targetMemberRole: string, targetProfileId: string): boolean => {
  const { user } = useAuthStore.getState();
  const myProfileId = user?.profile?.id;
  const myMembership = getActiveMembership();

  // 1. BLOQUEIO DE AUTO-EDIÇÃO: Nunca pode editar o próprio perfil
  if (targetProfileId === myProfileId) return false;

  if (!myMembership) return false;

  const myData = ROLE_MAP[myMembership.role];
  const targetData = ROLE_MAP[targetMemberRole];

  if (!myData || !targetData) return false;

  const myWeight = LEVEL_WEIGHT[myData.level];
  const targetWeight = LEVEL_WEIGHT[targetData.level];

  // --- REGRA DE HIERARQUIA ABSOLUTA ---
  // Você SÓ gerencia quem tem peso MENOR que o seu. 
  // Se for igual (Igualdade) ou maior (Superior), o acesso é negado.
  if (myWeight <= targetWeight) return false;

  // --- REGRA DE ESCOPO (DEPARTAMENTO) ---
  if (myData.scope === RoleScope.SAAS) {
    return myWeight >= LEVEL_WEIGHT[RoleLevel.PL];
  }

  if (myData.scope === targetData.scope || myData.scope === RoleScope.CLIENT_OFFICE) {
    return true; // Já validamos o peso acima, então aqui apenas confirmamos o setor
  }

  return false;
};