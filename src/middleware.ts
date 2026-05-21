import { NextRequest, NextResponse } from "next/server";

const SPANISH_LOCALES = /^es\b/i;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo actúa en la raíz "/"
  if (pathname !== "/") return NextResponse.next();

  const acceptLanguage = req.headers.get("accept-language") ?? "";

  // El header tiene formato: "es-CO,es;q=0.9,en;q=0.8"
  // Tomar el primer idioma preferido
  const primaryLocale = acceptLanguage.split(",")[0].trim();
  const locale = SPANISH_LOCALES.test(primaryLocale) ? "es" : "en";

  return NextResponse.redirect(new URL(`/${locale}`, req.url));
}

export const config = {
  matcher: "/",
};
