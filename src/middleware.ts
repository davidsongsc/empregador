import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // No Middleware do Next.js, o cookie deve ser lido via request.cookies
  const hasAccess = request.cookies.has("access");
  
  // Log para depuração local (veja no terminal do VS Code, não no navegador)
  console.log(`[Middleware] Path: ${pathname} | Autenticado: ${hasAccess}`);

  const isPrivateRoute =
    pathname.startsWith("/vagas") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/anunciar") ||
    pathname.startsWith("/dashboard");

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";

  // --- REGRA 1: PROTEÇÃO DE ROTAS PRIVADAS ---
  if (isPrivateRoute && !hasAccess) {
    const loginUrl = new URL("/login", request.url);
    // Preserva a rota original para redirecionar após o login
    loginUrl.searchParams.set("from", pathname);

    const response = NextResponse.redirect(loginUrl);
    // Limpa qualquer cache de redirecionamento para evitar loops infinitos
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  }

  // --- REGRA 2: REDIRECIONAR SE JÁ LOGADO (EVITA TELA DE LOGIN) ---
  if (isAuthRoute && hasAccess) {
    // Se o usuário já tem o cookie, mandamos para o dashboard ou vagas
    return NextResponse.redirect(new URL("/vagas", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matcher otimizado: ignora arquivos de sistema e pastas de mídia
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.png|.*\\.jpg).*)",
  ],
};