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
  ADMIN_PANEL = 'ADMIN_PANEL'
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

