import { MODULE_PERMISSIONS } from "@/constants/permissions";
import { Module } from "@/enum/moduleEnum";
import { ROLE_MAP, RoleLevel, RoleScope, RoleDepartment } from "@/enum/permissionEnum";

export interface ModuleAuth {
  hasAccess: boolean;
  isSaaS: boolean;
  isClient: boolean;
  isManagerUp: boolean;
  department: RoleDepartment | null;
  level: RoleLevel | null;
}

export default function hasModuleAccess(
  userRole: string | undefined, 
  module: Module
): ModuleAuth {
  const deny: ModuleAuth = {
    hasAccess: false,
    isSaaS: false,
    isClient: false,
    isManagerUp: false,
    department: null,
    level: null
  };

  if (!userRole) return deny;

  const cleanRole = userRole.replace(/['"]+/g, '').trim();
  const roleInfo = ROLE_MAP[cleanRole];
  const permissions = MODULE_PERMISSIONS[module];

  // LOG DE SEGURANÇA: Se a role não existe no mapeamento
  if (!roleInfo) {
    console.error(`[SECURITY] Role "${cleanRole}" não indexada no ROLE_MAP.`);
    return deny;
  }

  // Se o módulo não existe na matriz de permissões
  if (!permissions) {
    console.warn(`[SECURITY] Módulo "${module}" sem regras definidas em MODULE_PERMISSIONS.`);
    return deny;
  }

  // Hierarquia de Níveis
  const levelsOrder = [
    RoleLevel.INTERN, RoleLevel.JR, RoleLevel.PL, RoleLevel.SR, 
    RoleLevel.LEAD, RoleLevel.MANAGER, RoleLevel.DIRECTOR, RoleLevel.ADMIN
  ];
  
  const userLevelIdx = levelsOrder.indexOf(roleInfo.level);
  const isManagerUp = userLevelIdx >= levelsOrder.indexOf(RoleLevel.MANAGER);

  // --- VALIDAÇÃO POR MATRIZ ---
  
  // A) BYPASS GLOBAL (Protocolo Nexus)
  const isGodMode = cleanRole === 'SUPER_ADMIN' || cleanRole === 'DEV_SR';

  // B) MATCH DE ESCOPO
  const scopeMatch = !permissions.allowedScopes || 
                     permissions.allowedScopes.some(s => String(s) === String(roleInfo.scope));

  // C) MATCH DE DEPARTAMENTO
  const deptMatch = !permissions.allowedDepartments || 
                    permissions.allowedDepartments.some(d => String(d) === String(roleInfo.department));
  
  // D) MATCH DE NÍVEL
  let levelMatch = true;
  if (permissions.minLevel) {
    const minLevelIdx = levelsOrder.indexOf(permissions.minLevel);
    levelMatch = userLevelIdx >= minLevelIdx;
  }

  const hasAccess = isGodMode || (scopeMatch && deptMatch && levelMatch);

  // DEBUG PARA RESOLUÇÃO DE PROBLEMAS (Remova em produção)
  if (!hasAccess && roleInfo.department === "FINANCE") {
     console.group(`Auth Debug: ${module}`);
     console.log("Role:", cleanRole);
     console.log("Scope Match:", scopeMatch, "(Allowed:", permissions.allowedScopes, ")");
     console.log("Dept Match:", deptMatch, "(Allowed:", permissions.allowedDepartments, ")");
     console.log("Level Match:", levelMatch, `(User: ${userLevelIdx}, Min: ${permissions.minLevel})`);
     console.groupEnd();
  }

  return {
    hasAccess,
    isSaaS: roleInfo.scope === RoleScope.SAAS,
    isClient: roleInfo.scope === RoleScope.CLIENT_OFFICE,
    isManagerUp,
    department: roleInfo.department,
    level: roleInfo.level
  };
}