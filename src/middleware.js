import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const AUTH_PATHS = ["/login", "/register"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("vb_session")?.value;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(sessionToken ? "/dashboard" : "/login", request.url)
    );
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (!sessionToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
