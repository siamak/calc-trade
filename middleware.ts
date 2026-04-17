import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
	matcher: [
		// Skip all internal and non-localized asset paths.
		"/((?!_next|api|favicon.ico|webfont|icons|manifest.json|sw.js|workbox|apple|android|splash).*)",
	],
};
