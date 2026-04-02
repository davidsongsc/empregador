import { MODULE_PERMISSIONS } from "@/constants/permissions";
import { Module } from "@/enum/moduleEnum";
import { ROLE_MAP, RoleDepartment, RoleLevel, RoleScope } from "@/enum/permissionEnum";
// Interface para o retorno detalhado
export interface AuthSession {
  hasAccess: boolean;
  isSaaS: boolean;
  isClient: boolean;
  isCandidate: boolean;
  department: RoleDepartment | null;
  level: RoleLevel | null;
  isManagerUp: boolean; // Atalho para níveis de gestão
}

export default function checkModuleAccess(
  userRole: string | undefined, 
  module: Module
): AuthSession {
  // Objeto de resposta padrão (sem acesso)
  const denyAccess: AuthSession = {
    hasAccess: false,
    isSaaS: false,
    isClient: false,
    isCandidate: false,
    department: null,
    level: null,
    isManagerUp: false
  };

  if (!userRole) return denyAccess;

  const cleanRole = userRole.replace(/['"]+/g, '').trim();
  const roleInfo = ROLE_MAP[cleanRole];
  const permissions = MODULE_PERMISSIONS[module];

  // Identificadores de Escopo
  const isSaaS = roleInfo?.scope === RoleScope.SAAS;
  const isClient = roleInfo?.scope === RoleScope.CLIENT;
  const isCandidate = roleInfo?.scope === RoleScope.CANDIDATE;

  // Lógica de Nível (Hierarquia)
  const levelsOrder = [
    RoleLevel.INTERN, RoleLevel.JR, RoleLevel.PL, RoleLevel.SR, 
    RoleLevel.LEAD, RoleLevel.MANAGER, RoleLevel.DIRECTOR, RoleLevel.ADMIN
  ];
  const userLevelIndex = roleInfo ? levelsOrder.indexOf(roleInfo.level) : -1;
  const isManagerUp = userLevelIndex >= levelsOrder.indexOf(RoleLevel.MANAGER);

  // --- VALIDAÇÃO DE ACESSO ---
  let hasAccess = false;

  // 1. Bypass Global (Nexus Protocol)
  if (cleanRole === 'SUPER_ADMIN' || cleanRole === 'DEV_SR') {
    hasAccess = true;
  } else if (permissions && roleInfo) {
    // 2. Validação por Matriz
    const roleAllowed = permissions.allowedRoles?.includes(cleanRole);
    const scopeAllowed = !permissions.allowedScopes || permissions.allowedScopes.includes(roleInfo.scope);
    const deptAllowed = !permissions.allowedDepartments || permissions.allowedDepartments.includes(roleInfo.department);
    
    let levelAllowed = true;
    if (permissions.minLevel) {
      const minIndex = levelsOrder.indexOf(permissions.minLevel);
      levelAllowed = userLevelIndex >= minIndex;
    }

    // O acesso só é TRUE se passar em todas as travas ou se for role específica
    hasAccess = roleAllowed || (scopeAllowed && deptAllowed && levelAllowed);
  }

  return {
    hasAccess,
    isSaaS,
    isClient,
    isCandidate,
    department: roleInfo?.department || null,
    level: roleInfo?.level || null,
    isManagerUp
  };
}