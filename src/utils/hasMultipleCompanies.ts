import { UserData } from "@/interfaces/userData"

type Empresa = {
  id: string
  name: string
  role: string
  is_active: boolean
}

type Profile = {
  empresas: Empresa[]
}

type User = {
  profile?: UserData['profile']
}

export function hasMultipleCompanies(user: User): boolean {
  return (user.profile?.empresas?.length ?? 0) >= 2
}