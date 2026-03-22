import { RoleEnum } from "@/enum/permissionEnum";

export function roleKey(role: RoleEnum): string {
  return `${role.scope}_${role.department}_${role.level}`
}