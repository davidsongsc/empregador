import { getActiveMembership } from "./userHelpers";
import { ROLE_MAP, RoleLevel } from "@/enum/permissionEnum";

/**
 * Define a hierarquia numérica dos níveis para comparação.
 * Quanto maior o índice, maior a autoridade.
 */
const LEVEL_HIERARCHY: RoleLevel[] = [
  RoleLevel.INTERN, // 0
  RoleLevel.JR,     // 1
  RoleLevel.PL,     // 2
  RoleLevel.SR,     // 3
  RoleLevel.LEAD,   // 4
  RoleLevel.MANAGER,// 5
  RoleLevel.DIRECTOR,// 6
  RoleLevel.ADMIN    // 7
];

/**
 * Mapeamento de requisitos para índices da hierarquia.
 */
const REQUIREMENT_MAP: Record<"low" | "mid" | "high", RoleLevel> = {
  low: RoleLevel.INTERN, // Qualquer um entra
  mid: RoleLevel.PL,     // Precisa ser no mínimo Pleno
  high: RoleLevel.SR     // Precisa ser no mínimo Sênior
};

export const checkLevel = (requirement: "low" | "mid" | "high"): boolean => {
  const activeMembership = getActiveMembership();
  const roleStr = activeMembership?.role;

  if (!roleStr) return false;

  // 1. SANITIZAÇÃO E BYPASS (God Mode)
  const cleanRole = roleStr.replace(/['"]+/g, '').trim();
  if (cleanRole === 'SUPER_ADMIN' || cleanRole === 'DEV_SR' || cleanRole === 'ADMIN_SAAS_N2') {
    return true;
  }

  // 2. RECUPERAÇÃO DE DADOS DO ROLE_MAP
  // Não precisamos mais de split('_') ou de pesos manuais!
  const roleInfo = ROLE_MAP[cleanRole];
  
  if (!roleInfo) {
    console.warn(`[SECURITY] Role ${cleanRole} não encontrada no ROLE_MAP.`);
    return false;
  }

  // 3. COMPARAÇÃO HIERÁRQUICA
  const userLevelIndex = LEVEL_HIERARCHY.indexOf(roleInfo.level);
  const requiredLevelIndex = LEVEL_HIERARCHY.indexOf(REQUIREMENT_MAP[requirement]);

  // Se o índice do usuário for maior ou igual ao exigido, retorna true
  return userLevelIndex >= requiredLevelIndex;
};