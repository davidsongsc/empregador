import { MODULE_PERMISSIONS } from "@/constants/permissions"
import { Module } from "@/enum/moduleEnum"

export default function checkModuleAccess(userRole: string | undefined, module: Module): boolean {
  if (!userRole) return false;

  // 1. SANITIZAÇÃO DE SEGURANÇA (Protocolo Delos)
  // Garante que role vinda de cookies/localStorage não contenha aspas residuais
  const cleanRole = userRole.replace(/['"]+/g, '').trim();

  // 2. RECUPERAÇÃO DE MATRIZ
  const allowedRoles = MODULE_PERMISSIONS[module];

  // 3. BYPASS GLOBAL (Protocolo Nexus)
  // Super Admin e Dev Senior sempre ignoram restrições de módulo
  if (cleanRole === 'SUPER_ADMIN' || cleanRole === 'DEV_SR') return true;

  if (!allowedRoles) {
    console.warn(`[SECURITY] Módulo ${module} sem permissões definidas.`);
    return false;
  }

  return allowedRoles.includes(cleanRole);
}