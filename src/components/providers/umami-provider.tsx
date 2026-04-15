"use client";

/**
 * UmamiProvider
 *
 * A zero-render client component whose only job is to mount the useUmami hook
 * high in the component tree.  Wrap this around (or inside) the app shell in
 * the locale layout so that SPA routing, offline detection, and standalone-mode
 * tracking are active for every page.
 */

import { useUmami } from "@/hooks/use-umami";

export function UmamiProvider({ children }: { children: React.ReactNode }) {
	useUmami();
	return <>{children}</>;
}
