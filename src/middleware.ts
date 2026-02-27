import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Tenta recuperar o token de acesso
  const hasAccess = request.cookies.get("access");

  const isPrivateRoute = 
    pathname.startsWith("/vagas") || 
    pathname.startsWith("/perfil") || 
    pathname.startsWith("/anunciar") ||
    pathname.startsWith("/dashboard");

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";

  // --- REGRA 1: ACESSO ÀS ROTAS PRIVADAS ---
  if (isPrivateRoute && !hasAccess) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    
    // Adicionamos um cabeçalho para evitar cache da página de redirecionamento
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // --- REGRA 2: EVITAR LOGIN/CADASTRO SE JÁ LOGADO ---
  if (isAuthRoute && hasAccess) {
    // Se o cara já está logado, forçamos a saída da página de login
    const response = NextResponse.redirect(new URL("/vagas", request.url));
    // Limpamos o cache para garantir que o Next não tente mostrar o formulário de novo
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  // Se nada se aplicar, segue o fluxo normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|img|logop.png).*)",
  ],
};