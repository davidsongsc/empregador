import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decodeJwt } from "jose"

import { Module } from "./enum/moduleEnum"
import hasModuleAccess from "./utils/hasModuleAccess"

const ROUTE_TO_MODULE_MAP: Record<string, Module> = {
  "/vagas": Module.RECRUITMENT,
  "/candidato": Module.RECRUITMENT,
  "/anunciar": Module.RECRUITMENT,
  "/recrutamento": Module.RECRUITMENT,
  "/dashboard": Module.DASHBOARD,
  "/empresa": Module.ADMIN_PANEL,
  "/financeiro": Module.FINANCE,
  "/comercial": Module.SALES,
  "/suporte": Module.SUPPORT_PANEL,
  "/admin": Module.ADMIN_PANEL,
  "/operacional": Module.OPERATIONAL
}

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl
  const token = request.cookies.get("access")?.value

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro"

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const matchedPath = Object.keys(ROUTE_TO_MODULE_MAP)
    .find(path => pathname.startsWith(path))

  if (matchedPath) {

    if (!token) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {

      const payload = decodeJwt(token)

      const userRole = payload.role as string

      if (userRole === "SUPER_ADMIN" || userRole === "DEV_SR") {
        return NextResponse.next()
      }

      const moduleKey = ROUTE_TO_MODULE_MAP[matchedPath]

      const hasAccess = hasModuleAccess(userRole, moduleKey)

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/403", request.url))
      }

    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }

  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.png|.*\\.jpg).*)"
  ]
}