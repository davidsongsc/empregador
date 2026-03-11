import { MODULE_PERMISSIONS } from "@/constants/permissions"
import { Module } from "@/enum/moduleEnum"

export default function checkModuleAccess(userRole: string | undefined, module: Module) {

  if (!userRole) return false

  const allowedRoles = MODULE_PERMISSIONS[module]

  return allowedRoles.includes(userRole)
}