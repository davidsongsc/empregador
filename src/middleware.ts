import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Tenta recuperar o token de acesso (ajuste o nome se for "refresh")
  const hasAccess = request.cookies.get("access");

  // 2. Definição de Rotas
  // Rotas que EXIGEM login
  const isPrivateRoute = 
    pathname.startsWith("/vagas") || 
    pathname.startsWith("/perfil") || 
    pathname.startsWith("/anunciar") ||
    pathname.startsWith("/dashboard");

  // Rotas que NÃO podem ser acessadas se já estiver logado (Auth Routes)
  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";

  // --- REGRA 1: ACESSO ÀS ROTAS PRIVADAS ---
  if (isPrivateRoute && !hasAccess) {
    const loginUrl = new URL("/login", request.url);
    
    // Guardamos a página atual para onde ele deve voltar após o login
    // Ex: /login?from=/anunciar
    loginUrl.searchParams.set("from", pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // --- REGRA 2: EVITAR LOGIN/CADASTRO SE JÁ LOGADO ---
  if (isAuthRoute && hasAccess) {
    // Se o cara já está logado e tenta ir pro login, manda para /vagas
    return NextResponse.redirect(new URL("/vagas", request.url));
  }

  // Se nada se aplicar, segue o fluxo normal
  return NextResponse.next();
}

// O Matcher é crucial para a performance no 3G, pois evita rodar o middleware em 
// arquivos de imagem, fontes ou scripts do Next.js.
export const config = {
  matcher: [
    /*
     * Match em todas as rotas exceto:
     * 1. api (rotas de API)
     * 2. _next/static (arquivos estáticos)
     * 3. _next/image (otimização de imagens)
     * 4. favicon.ico, img, logop.png (arquivos na pasta public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img|logop.png).*)",
  ],
};