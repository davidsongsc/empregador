export enum RoleScope {
  CANDIDATE = 'CANDIDATE',
  CLIENT = 'CLIENT',
  SAAS = 'SAAS'
}

export enum RoleDepartment {
  GENERAL = 'GENERAL',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  RECRUITMENT = 'RECRUITMENT',
  SALES = 'SALES',
  SUPPORT_PANEL = 'SUPPORT_PANEL',
  TECH = 'TECH',
  MANAGEMENT = 'MANAGEMENT',
  ADMIN_PANEL = 'ADMIN_PANEL',
  HOSPITALITY = 'HOSPITALITY',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING'
}

export enum RoleLevel {
  INTERN = 'INTERN',
  JR = 'JR',
  PL = 'PL',
  SR = 'SR',
  LEAD = 'LEAD',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN'
}

export type Role = {
  scope: RoleScope
  department: RoleDepartment
  level: RoleLevel
}

export const ROLE_MAP: Record<string, Role> = {
  // --- CLIENTES ---
  'CLIENT_OPERATIONAL_INTERN': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.INTERN },
  'CLIENT_OPERATIONAL_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.JR },
  'CLIENT_OPERATIONAL_PL': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.PL },
  'CLIENT_OPERATIONAL_SR': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.SR },
  'CLIENT_FINANCE_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.FINANCE, level: RoleLevel.JR },
  'CLIENT_FINANCE_PL': { scope: RoleScope.CLIENT, department: RoleDepartment.FINANCE, level: RoleLevel.PL },
  'CLIENT_FINANCE_SR': { scope: RoleScope.CLIENT, department: RoleDepartment.FINANCE, level: RoleLevel.SR },
  'CLIENT_MANAGER': { scope: RoleScope.CLIENT, department: RoleDepartment.MANAGEMENT, level: RoleLevel.MANAGER },
  'CLIENT_ADMIN': { scope: RoleScope.CLIENT, department: RoleDepartment.MANAGEMENT, level: RoleLevel.ADMIN },

  // --- CANDIDATOS ---
  'CANDIDATE_INTERN': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.INTERN },
  'CANDIDATE_JR': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.JR },
  'CANDIDATE_PL': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.PL },
  'CANDIDATE_SR': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.SR },
  'CANDIDATE_VIP': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.SR },
  'CLIENT_COOK_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.JR },
  'CLIENT_COOK_PL': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.PL },
  'CLIENT_COOK_SR': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.SR },

  'CLIENT_KITCHEN_ASSISTANT_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.JR },
  'CLIENT_KITCHEN_ASSISTANT_PL': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.PL },

  'CLIENT_CHEF_DE_CUISINE': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.MANAGER },

  'CLIENT_GRIDDLE_COOK_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.JR }, // Chapeiro

  // --- FRONT OF HOUSE / ATENDIMENTO ---
  'CLIENT_RECEPTIONIST_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.JR },
  'CLIENT_ATTENDANT_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.OPERATIONS, level: RoleLevel.JR },
  'CLIENT_BARTENDER_JR': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.JR },
  'CLIENT_BARTENDER_PL': { scope: RoleScope.CLIENT, department: RoleDepartment.HOSPITALITY, level: RoleLevel.PL },

  // --- FACILITIES / MANUTENÇÃO ---
  'CLIENT_CLEANING_ASSISTANT': { scope: RoleScope.CLIENT, department: RoleDepartment.CLEANING, level: RoleLevel.JR },
  'CLIENT_MAINTENANCE_ASSISTANT': { scope: RoleScope.CLIENT, department: RoleDepartment.MAINTENANCE, level: RoleLevel.JR },
  
  // --- SAAS (INTERNO) ---
  'FIN_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.INTERN },
  'FIN_JR': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.JR },
  'FIN_MANAGER': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.MANAGER },

  'SALES_JR': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.JR },
  'SALES_DIRECTOR': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.DIRECTOR },

  'RECRUITER_JR': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.JR },
  'RECRUITER_LEAD': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.LEAD },

  'DEV_SR': { scope: RoleScope.SAAS, department: RoleDepartment.TECH, level: RoleLevel.SR },

  'ADMIN_SAAS_N1': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.JR },
  'SUPER_ADMIN': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.ADMIN },
};