export enum RoleScope {
  CANDIDATE = 'CANDIDATE',
  SAAS = 'SAAS',
  // Divisão do CLIENT por áreas de atuação
  CLIENT_KITCHEN = 'CLIENT_KITCHEN',     // Cozinha e Produção
  CLIENT_FLOOR = 'CLIENT_FLOOR',         // Salão e Atendimento (FOH)
  CLIENT_BAR = 'CLIENT_BAR',             // Bar e Bebidas
  CLIENT_OFFICE = 'CLIENT_OFFICE',       // Administrativo e RH
  CLIENT_FACILITIES = 'CLIENT_FACILITIES', // Limpeza e Manutenção
  CLIENT_OPERATIONAL = 'CLIENT_OPERATIONAL', // Operacional geral (sem especificação de área)
}
export enum RoleDepartment {
  GENERAL = 'GENERAL',
  OPERATIONAL = 'OPERATIONAL',
  FINANCE = 'FINANCE',
  RECRUITMENT = 'RECRUITMENT',
  SALES = 'SALES',
  CS = 'CS',
  SUPPORT_PANEL = 'SUPPORT_PANEL',
  COMPLIANCE = 'COMPLIANCE',
  OPS = 'OPS',
  DEV = 'DEV',
  TECH = 'TECH',
  MANAGEMENT = 'MANAGEMENT',
  ADMIN_PANEL = 'ADMIN_PANEL',
  HOSPITALITY = 'HOSPITALITY',
  MAINTENANCE = 'MAINTENANCE',
  BAR = 'BAR',
  KITCHEN = 'KITCHEN',
  CLEANING = 'CLEANING'
}

export enum RoleLevel {
  INTERN = 'INTERN',
  JR = 'JR',
  PL = 'PL',
  SR = 'SR',
  LEAD = 'LEAD',
  CONFIANCE_LEAD = 'CONFIANCE_LEAD',
  ASSISTANT_MANAGER = 'ASSISTANT_MANAGER',
  MANAGER = 'MANAGER',
  ASSISTANT_DIRECTOR = 'ASSISTANT_DIRECTOR',
  DIRECTOR = 'DIRECTOR',
  ADMIN = 'ADMIN'
}

export type RoleEnum = {
  scope: RoleScope
  department: RoleDepartment
  level: RoleLevel
}

export const ROLE_MAP: Record<string, RoleEnum> = {
  // =========================================================
  // CLIENTES (ORGANIZAÇÕES)
  // =========================================================

  // Operacional
  'CLIENT_OPERATIONAL_INTERN': { scope: RoleScope.CLIENT_OPERATIONAL, department: RoleDepartment.OPERATIONAL, level: RoleLevel.INTERN },
  'CLIENT_OPERATIONAL_JR': { scope: RoleScope.CLIENT_OPERATIONAL, department: RoleDepartment.OPERATIONAL, level: RoleLevel.JR },
  'CLIENT_OPERATIONAL_PL': { scope: RoleScope.CLIENT_OPERATIONAL, department: RoleDepartment.OPERATIONAL, level: RoleLevel.PL },
  'CLIENT_OPERATIONAL_SR': { scope: RoleScope.CLIENT_OPERATIONAL, department: RoleDepartment.OPERATIONAL, level: RoleLevel.SR },
  // Hospitalidade / Cozinha
  'CLIENT_COOK_JR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.HOSPITALITY, level: RoleLevel.JR },
  'CLIENT_COOK_PL': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.HOSPITALITY, level: RoleLevel.PL },
  'CLIENT_COOK_SR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.HOSPITALITY, level: RoleLevel.SR },

  'CLIENT_KITCHEN_ASSISTANT_JR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.JR },
  'CLIENT_KITCHEN_ASSISTANT_PL': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.PL },
  'CLIENT_KITCHEN_ASSISTANT_SR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.SR },

  'CLIENT_CHEF_DE_CUISINE': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.MANAGER },
  'CLIENT_GRIDDLE_COOK_JR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.JR },
  'CLIENT_GRIDDLE_COOK_PL': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.PL },
  'CLIENT_GRIDDLE_COOK_SR': { scope: RoleScope.CLIENT_KITCHEN, department: RoleDepartment.KITCHEN, level: RoleLevel.SR },

  'CLIENT_BARTENDER_JR': { scope: RoleScope.CLIENT_BAR, department: RoleDepartment.BAR, level: RoleLevel.JR },
  'CLIENT_BARTENDER_PL': { scope: RoleScope.CLIENT_BAR, department: RoleDepartment.BAR, level: RoleLevel.PL },
  'CLIENT_BARTENDER_SR': { scope: RoleScope.CLIENT_BAR, department: RoleDepartment.BAR, level: RoleLevel.SR },

  // Atendimento
  'CLIENT_RECEPTIONIST_JR': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.JR },
  'CLIENT_RECEPTIONIST_PL': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.PL },
  'CLIENT_RECEPTIONIST_SR': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.SR },
  'CLIENT_ATTENDANT_JR': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.JR },
  'CLIENT_ATTENDANT_PL': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.PL },
  'CLIENT_ATTENDANT_SR': { scope: RoleScope.CLIENT_FLOOR, department: RoleDepartment.OPERATIONAL, level: RoleLevel.SR },
  // Financeiro
  'CLIENT_FINANCE_JR': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.FINANCE, level: RoleLevel.JR },
  'CLIENT_FINANCE_PL': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.FINANCE, level: RoleLevel.PL },
  'CLIENT_FINANCE_SR': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.FINANCE, level: RoleLevel.SR },

  // Recrutamento Interno do Cliente
  'CLIENT_RECRUITER_INTERN': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.RECRUITMENT, level: RoleLevel.INTERN },
  'CLIENT_RECRUITER_JR': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.RECRUITMENT, level: RoleLevel.JR },
  'CLIENT_RECRUITER_PL': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.RECRUITMENT, level: RoleLevel.PL },
  'CLIENT_RECRUITER_SR': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.RECRUITMENT, level: RoleLevel.SR },
  'CLIENT_RECRUITER_LEAD': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.RECRUITMENT, level: RoleLevel.LEAD },

  // Gestão
  'CLIENT_MANAGER': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.MANAGEMENT, level: RoleLevel.MANAGER },
  'CLIENT_ADMIN': { scope: RoleScope.CLIENT_OFFICE, department: RoleDepartment.MANAGEMENT, level: RoleLevel.ADMIN },

  // Facilities
  'CLIENT_CLEANING_ASSISTANT': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.CLEANING, level: RoleLevel.JR },

  'CLIENT_CLEANING_SUPERVISOR': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.CLEANING, level: RoleLevel.SR },
  'CLIENT_CLEANING_MANAGER': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.CLEANING, level: RoleLevel.MANAGER },

  'CLIENT_MAINTENANCE_SUPERVISOR': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.MAINTENANCE, level: RoleLevel.SR },
  'CLIENT_MAINTENANCE_MANAGER': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.MAINTENANCE, level: RoleLevel.MANAGER },
  'CLIENT_MAINTENANCE_ASSISTANT': { scope: RoleScope.CLIENT_FACILITIES, department: RoleDepartment.MAINTENANCE, level: RoleLevel.JR },

  // =========================================================
  // CANDIDATOS
  // =========================================================
  'CANDIDATE_INTERN': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.INTERN },
  'CANDIDATE_JR': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.JR },
  'CANDIDATE_PL': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.PL },
  'CANDIDATE_SR': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.SR },
  'CANDIDATE_VIP': { scope: RoleScope.CANDIDATE, department: RoleDepartment.GENERAL, level: RoleLevel.SR },

  // =========================================================
  // SAAS INTERNO (NEXUS TEAM)
  // =========================================================

  // Financeiro SaaS
  'FINANCE_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.INTERN },
  'FINANCE_JR': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.JR },
  'FINANCE_PL': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.PL },
  'FINANCE_SR': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.SR },
  'FINANCE_MANAGER': { scope: RoleScope.SAAS, department: RoleDepartment.FINANCE, level: RoleLevel.MANAGER },

  // Comercial SaaS
  'SALES_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.INTERN },
  'SALES_JR': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.JR },
  'SALES_PL': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.PL },
  'SALES_SR': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.SR },
  'SALES_DIRECTOR': { scope: RoleScope.SAAS, department: RoleDepartment.SALES, level: RoleLevel.DIRECTOR },

  // Customer Success SaaS
  'CS_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.CS, level: RoleLevel.INTERN },
  'CS_JR': { scope: RoleScope.SAAS, department: RoleDepartment.CS, level: RoleLevel.JR },
  'CS_PL': { scope: RoleScope.SAAS, department: RoleDepartment.CS, level: RoleLevel.PL },
  'CS_SR': { scope: RoleScope.SAAS, department: RoleDepartment.CS, level: RoleLevel.SR },

  // Recrutamento SaaS
  'RECRUITER_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.INTERN },
  'RECRUITER_JR': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.JR },
  'RECRUITER_PL': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.PL },
  'RECRUITER_SR': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.SR },
  'RECRUITER_LEAD': { scope: RoleScope.SAAS, department: RoleDepartment.RECRUITMENT, level: RoleLevel.LEAD },

  // Tecnologia e Dev
  'DEV_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.DEV, level: RoleLevel.INTERN },
  'DEV_JR': { scope: RoleScope.SAAS, department: RoleDepartment.DEV, level: RoleLevel.JR },
  'DEV_PL': { scope: RoleScope.SAAS, department: RoleDepartment.DEV, level: RoleLevel.PL },
  'DEV_SR': { scope: RoleScope.SAAS, department: RoleDepartment.DEV, level: RoleLevel.SR },

  // Suporte SaaS
  'SUPPORT_INTERN': { scope: RoleScope.SAAS, department: RoleDepartment.SUPPORT_PANEL, level: RoleLevel.INTERN },
  'SUPPORT_JR': { scope: RoleScope.SAAS, department: RoleDepartment.SUPPORT_PANEL, level: RoleLevel.JR },
  'SUPPORT_PL': { scope: RoleScope.SAAS, department: RoleDepartment.SUPPORT_PANEL, level: RoleLevel.PL },
  'SUPPORT_SR': { scope: RoleScope.SAAS, department: RoleDepartment.SUPPORT_PANEL, level: RoleLevel.SR },

  // Operações e Admin SaaS
  'OPS_SAAS_JR': { scope: RoleScope.SAAS, department: RoleDepartment.OPS, level: RoleLevel.JR },
  'OPS_SAAS_PL': { scope: RoleScope.SAAS, department: RoleDepartment.OPS, level: RoleLevel.PL },
  'OPS_SAAS_SR': { scope: RoleScope.SAAS, department: RoleDepartment.OPS, level: RoleLevel.SR },

  'ADMIN_SAAS_N1': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.JR },
  'ADMIN_SAAS_N2': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.PL },
  'ADMIN_SAAS_N3': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.SR },
  'SUPER_ADMIN': { scope: RoleScope.SAAS, department: RoleDepartment.ADMIN_PANEL, level: RoleLevel.ADMIN },

  // Compliance
  'COMPLIANCE_JR': { scope: RoleScope.SAAS, department: RoleDepartment.COMPLIANCE, level: RoleLevel.JR },
  'COMPLIANCE_PL': { scope: RoleScope.SAAS, department: RoleDepartment.COMPLIANCE, level: RoleLevel.PL },
  'COMPLIANCE_SR': { scope: RoleScope.SAAS, department: RoleDepartment.COMPLIANCE, level: RoleLevel.SR }
};