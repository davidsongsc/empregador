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
  
  // DEBUG: Delete isso depois, mas agora é essencial:
  // console.log(`[Middleware] Path: ${pathname} | Token: ${!!token}`);

  // 1. ESCAPE PARA ASSETS E HOME (Trava de segurança)
  if (
    pathname === "/" || 
    pathname.startsWith("/_next") || 
    pathname.includes(".") // Pula arquivos (png, jpg, etc)
  ) {
    return NextResponse.next()
  }

  // 2. ROTAS DE AUTENTICAÇÃO (Evita loop de logado tentando logar)
  const isAuthRoute = pathname === "/login" || pathname === "/cadastro"
  if (isAuthRoute) {
    if (token) return NextResponse.redirect(new URL("/dashboard", request.url))
    return NextResponse.next()
  }

  // 3. VERIFICAÇÃO DE MÓDULOS
  const matchedPath = Object.keys(ROUTE_TO_MODULE_MAP).find(path => pathname.startsWith(path))

  if (matchedPath) {
    if (!token) {
      // Se não tem token, criamos a URL de redirecionamento para a Home
      const url = new URL("/", request.url)
      url.searchParams.set("showLogin", "true")
      url.searchParams.set("from", pathname)
      
      // console.log("--- REDIRECIONANDO PARA HOME (SEM TOKEN) ---");
      return NextResponse.redirect(url)
    }

    // ... lógica de jose (decodeJwt) e permissões continua igual
  }

  return NextResponse.next()
}