import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Tenta recuperar o token de acesso
  const hasAccess = request.cookies.get("access");
  
  // LOG: Verifique os logs no dashboard da Vercel para confirmar se o cookie chega aqui
  console.log(`[Middleware] Rota: ${pathname} | Cookie presente: ${!!hasAccess}`);

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

    const response = NextResponse.redirect(loginUrl);
    
    // Força o navegador a não cachear o redirecionamento (Evita o loop de login)
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  }

  // --- REGRA 2: EVITAR LOGIN/CADASTRO SE JÁ LOGADO ---
  if (isAuthRoute && hasAccess) {
    const response = NextResponse.redirect(new URL("/vagas", request.url));
    
    // Garante que ao logar, o usuário não consiga voltar para a tela de login pelo "Back"
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match em todas as rotas exceto arquivos estáticos e pastas de sistema
     */
    "/((?!api|_next/static|_next/image|favicon.ico|img|logop.png).*)",
  ],
};