import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fa"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	if (pathnameHasLocale) return defaultLocale;

	// Check for Accept-Language header
	const acceptLanguage = request.headers.get("accept-language");
	if (acceptLanguage) {
		// Simple parsing - check if Persian is preferred
		if (acceptLanguage.includes("fa") || acceptLanguage.includes("persian")) {
			return "fa";
		}
	}

	return defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
	);

	// Redirect if there is no locale
	if (!pathnameHasLocale) {
		const locale = getLocale(request);
		const newUrl = new URL(`/${locale}${pathname}`, request.url);
		return NextResponse.redirect(newUrl);
	}
}

export const config = {
	matcher: [
		// Skip all internal paths (_next)
		"/((?!_next|api|favicon.ico|webfont|icons|manifest.json|sw.js|workbox|apple|android|splash).*)",
	],
};
