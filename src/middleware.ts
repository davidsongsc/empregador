import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hasAccess = request.cookies.get("access");

  if (!hasAccess && request.nextUrl.pathname.startsWith("/vagas")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}