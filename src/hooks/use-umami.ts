"use client";

/**
 * useUmami — initialises all Umami tracking concerns for the running page.
 *
 * Responsibilities:
 *   1. Flush the offline queue and listen for future reconnects.
 *   2. Detect and record standalone (installed PWA) opens.
 *   3. Record when the device goes offline.
 *   4. Track SPA page views on every pathname change (avoids duplicates by
 *      triggering only when the path actually changes).
 *
 * Mount this hook exactly once, high in the component tree, via UmamiProvider.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { initOfflineSync, track } from "@/lib/umami";

export function useUmami(): void {
	const pathname = usePathname();
	const params = useParams();
	const locale = (params?.locale as string) ?? "en";

	// Track the previous path so a re-render with the same path never fires
	// a duplicate page_viewed event (React StrictMode double-invokes effects).
	const lastTrackedPath = useRef<string | null>(null);

	// ── 1. Offline queue sync ─────────────────────────────────────────────────
	useEffect(() => {
		return initOfflineSync(); // registers online listener, returns cleanup
	}, []);

	// ── 2. Standalone (installed PWA) detection ───────────────────────────────
	useEffect(() => {
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as Navigator & { standalone?: boolean }).standalone ===
				true;

		if (isStandalone) {
			track.appOpenedStandalone();
		}
	}, []); // runs once on mount

	// ── 3. Offline transition ─────────────────────────────────────────────────
	useEffect(() => {
		function handleOffline() {
			track.offlineModeEntered();
		}

		window.addEventListener("offline", handleOffline);
		return () => window.removeEventListener("offline", handleOffline);
	}, []);

	// ── 4. SPA page view tracking ─────────────────────────────────────────────
	useEffect(() => {
		if (!pathname) return;
		if (pathname === lastTrackedPath.current) return; // deduplicate

		lastTrackedPath.current = pathname;

		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as Navigator & { standalone?: boolean }).standalone ===
				true;

		track.pageViewed({ path: pathname, locale, standalone: isStandalone });
	}, [pathname, locale]);
}
