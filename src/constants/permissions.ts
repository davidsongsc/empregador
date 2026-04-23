import { Module } from "@/enum/moduleEnum";
import { RoleScope, RoleDepartment, RoleLevel } from "@/enum/permissionEnum";

export type PermissionSchema = {
  allowedRoles?: string[];           // Roles que têm acesso garantido (Bypass de depto)
  allowedScopes?: RoleScope[];       // Filtro por Escopo (CLIENT, SAAS, CANDIDATE)
  allowedDepartments?: RoleDepartment[]; // Departamentos autorizados
  minLevel?: RoleLevel;              // Nível hierárquico mínimo para entrar
};

export const MODULE_PERMISSIONS: Record<Module, PermissionSchema> = {
  [Module.DASHBOARD]: {
    allowedScopes: [RoleScope.CLIENT_OFFICE, RoleScope.SAAS],
    minLevel: RoleLevel.JR
  },

  [Module.CANDIDATE_AREA]: {
    allowedScopes: [RoleScope.CANDIDATE],
    minLevel: RoleLevel.INTERN
  },

  [Module.RECRUITMENT]: {
    allowedDepartments: [RoleDepartment.RECRUITMENT, RoleDepartment.MANAGEMENT, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.JR
  },

  [Module.SUPERVISION]: {
    allowedDepartments: [RoleDepartment.RECRUITMENT, RoleDepartment.MANAGEMENT, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.SR // Apenas Sênior ou superior supervisiona
  },

  [Module.COMPANY_MANAGEMENT]: {
    allowedScopes: [RoleScope.CLIENT_OFFICE, RoleScope.SAAS],
    allowedDepartments: [RoleDepartment.MANAGEMENT, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.MANAGER
  },

  [Module.SUPPORT_PANEL]: {
    allowedDepartments: [RoleDepartment.SUPPORT_PANEL, RoleDepartment.TECH, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.JR
  },

  [Module.FINANCE]: {
    allowedDepartments: [RoleDepartment.FINANCE, RoleDepartment.MANAGEMENT, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.JR
  },

  [Module.SALES]: {
    allowedDepartments: [RoleDepartment.SALES, RoleDepartment.MANAGEMENT, RoleDepartment.ADMIN_PANEL],
    minLevel: RoleLevel.JR
  },

  [Module.OPERATIONAL]: {
    allowedDepartments: [
      RoleDepartment.OPERATIONAL,
      RoleDepartment.HOSPITALITY,
      RoleDepartment.MAINTENANCE,

      RoleDepartment.CLEANING,
      RoleDepartment.OPS
    ],
    minLevel: RoleLevel.JR
  },

  [Module.COMPLIANCE]: {
    allowedScopes: [RoleScope.SAAS],
    allowedDepartments: [RoleDepartment.COMPLIANCE, RoleDepartment.ADMIN_PANEL, RoleDepartment.MANAGEMENT],
    minLevel: RoleLevel.PL // Aqui o COMPLIANCE_SR passará pois SR > PL
  },

  [Module.ADMIN_PANEL]: {
    allowedScopes: [RoleScope.SAAS],
    allowedDepartments: [RoleDepartment.ADMIN_PANEL, RoleDepartment.DEV],
    minLevel: RoleLevel.JR
  }
};