import { Role } from "@/enum/permissionEnum";

export function roleKey(role: Role): string {
  return `${role.scope}_${role.department}_${role.level}`
}