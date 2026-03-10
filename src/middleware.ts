// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose"; // Usamos jose no middleware por ser Edge-compatible

// Mapeamento de permissões: quais roles podem acessar quais caminhos
const ROLE_PERMISSIONS: Record<string, string[]> = {
  // Rotas exclusivas de candidatos
  "/vagas": ["CANDIDATO", "CANDIDATO_VIP", "TALENTO", "DEVELOPER", "SUPER_ADMIN"],
  
  // Rotas de recrutadores e empresas
  "/anunciar": ["RECRUITER", "RECRUITER_VIP", "RECRUITER_LEAD", "COMPANY_ADMIN", "DEVELOPER", "SUPER_ADMIN"],
  
  // Dashboard administrativo e suporte
  "/dashboard": ["SUPPORT_N1", "SUPPORT_N2", "SUPPORT_N3", "MODERATOR", "ADMIN_N1", "ADMIN_N2", "SUPER_ADMIN", "DEVELOPER"],
  
  // Perfil é comum, mas você pode restringir se necessário
  "/perfil": ["ANY"], 
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/cadastro";

  // 1. Se tentar acessar rota de login já estando logado
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/vagas", request.url));
  }

  // 2. Verificação de Rotas Privadas
  const matchedPath = Object.keys(ROLE_PERMISSIONS).find(path => pathname.startsWith(path));

  if (matchedPath) {
    // Se não tem token, tchau.
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decodificamos o cargo do usuário
      const payload = decodeJwt(token);
      const userRole = (payload.role as string) || "";

      const allowedRoles = ROLE_PERMISSIONS[matchedPath];

      // Se a rota exige cargos específicos e o user não tem o cargo certo
      if (!allowedRoles.includes("ANY") && !allowedRoles.includes(userRole)) {
        // Redireciona para uma página de "Sem Permissão" ou volta para a home
        return NextResponse.redirect(new URL("/403", request.url));
      }
    } catch (e) {
      // Token inválido/corrompido
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|img|.*\\.png|.*\\.jpg).*)"],
};