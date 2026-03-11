// middleware.ts
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
  console.log("---------------------------------");
  console.log("Middleware interceptou:", pathname);

  console.log("Token encontrado?", !!token);
  // 1. Se o usuário já está logado e tenta ir para Login/Cadastro, manda pro Dashboard
  const isAuthRoute = pathname === "/login" || pathname === "/cadastro"
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 2. Verifica se a rota atual exige proteção por módulo
  const matchedPath = Object.keys(ROUTE_TO_MODULE_MAP)
    .find(path => pathname.startsWith(path))

  if (matchedPath) {
    // --- CASO: USUÁRIO NÃO AUTENTICADO ---
    if (!token) {
      const url = request.nextUrl.clone()

      // IMPORTANTE: Redireciona para a raiz (/) para o Modal abrir lá
      // Se você quiser que o modal abra "sobre" a página atual, mude para url.pathname = pathname
      url.pathname = "/"

      // Injeta os parâmetros que o LoginTrigger (no Layout) vai ler
      url.searchParams.set("showLogin", "true")
      url.searchParams.set("from", pathname) // Salva para onde ele queria ir

      return NextResponse.redirect(url)
    }

    // --- CASO: USUÁRIO AUTENTICADO (VERIFICAR PERMISSÃO) ---
    try {
      const payload = decodeJwt(token)
      const userRole = payload.role as string

      // Bypass para Admins/Devs
      if (userRole === "SUPER_ADMIN" || userRole === "DEV_SR") {
        return NextResponse.next()
      }

      const moduleKey = ROUTE_TO_MODULE_MAP[matchedPath]
      const hasAccess = hasModuleAccess(userRole, moduleKey)

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/403", request.url))
      }

    } catch (err) {
      // Token inválido ou expirado -> Chama o Modal de Login
      const url = request.nextUrl.clone()
      url.pathname = "/"
      url.searchParams.set("showLogin", "true")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configuração do Matcher para ignorar arquivos estáticos e APIs
// No final do seu src/middleware.ts
export const config = {
  matcher: [
    /*
     * Captura todas as rotas, exceto:
     * 1. api (requisições de API internas)
     * 2. _next/static (arquivos estáticos)
     * 3. _next/image (otimização de imagens)
     * 4. favicon.ico, png, jpg (arquivos de mídia)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)',
  ],
}