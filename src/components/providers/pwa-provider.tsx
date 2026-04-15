"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { track } from "@/lib/umami";

interface PWAContextValue {
	/** True when running as an installed PWA (standalone/fullscreen display mode). */
	isInstalled: boolean;
	/** True when the browser reports navigator.onLine. */
	isOnline: boolean;
	/** True when a `beforeinstallprompt` event is available (Chrome/Edge). */
	canInstall: boolean;
	/** True when a new service worker is waiting to activate. */
	hasUpdate: boolean;
	/** Trigger the browser's native install prompt. Returns true on acceptance. */
	installPWA: () => Promise<boolean>;
	/** Send SKIP_WAITING to the waiting SW, then reload to apply the update. */
	applyUpdate: () => Promise<void>;
}

const PWAContext = createContext<PWAContextValue>({
	isInstalled: false,
	isOnline: true,
	canInstall: false,
	hasUpdate: false,
	installPWA: async () => false,
	applyUpdate: async () => {},
});

export function PWAProvider({ children }: { children: React.ReactNode }) {
	const [isInstalled, setIsInstalled] = useState(false);
	const [isOnline, setIsOnline] = useState(true);
	const [canInstall, setCanInstall] = useState(false);
	const [hasUpdate, setHasUpdate] = useState(false);
	// Holds the deferred install prompt — must stay as a ref to avoid
	// stale-closure issues when called from installPWA.
	const deferredPromptRef = useRef<any>(null);
	// Guard against double-reload on controllerchange.
	const reloadingRef = useRef(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		// ── Initial state ──────────────────────────────────────────────────
		setIsOnline(navigator.onLine);

		const mq = window.matchMedia("(display-mode: standalone)");
		const iosStandalone = (navigator as any).standalone === true;
		setIsInstalled(mq.matches || iosStandalone);

		const handleMqChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
		mq.addEventListener("change", handleMqChange);

		// ── Online / offline ───────────────────────────────────────────────
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// ── Install prompt ─────────────────────────────────────────────────
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			deferredPromptRef.current = e;
			setCanInstall(true);
			track.appInstallPrompted();
		};
		const handleAppInstalled = () => {
			deferredPromptRef.current = null;
			setIsInstalled(true);
			setCanInstall(false);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		// ── Service worker registration + update detection ─────────────────
		if ("serviceWorker" in navigator) {
			// Register the Workbox-generated SW (built by next-pwa).
			// sw-custom.js is a deprecated stub that self-unregisters.
			navigator.serviceWorker
				.register("/sw.js")
				.then((reg) => {
					// A SW is already waiting (e.g. page was opened after a deploy
					// without a full reload).
					if (reg.waiting) {
						setHasUpdate(true);
					}

					// New SW found during this page session.
					reg.addEventListener("updatefound", () => {
						const newWorker = reg.installing;
						if (!newWorker) return;

						newWorker.addEventListener("statechange", () => {
							// "installed" + existing controller = new SW waiting.
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								setHasUpdate(true);
							}
						});
					});

					// Poll once after a short delay to catch updates that
					// arrive while the page is already open.
					setTimeout(() => reg.update().catch(() => {}), 5_000);
				})
				.catch(() => {
					// SW registration failed (e.g. file not found during dev);
					// app still works without it.
				});

			// When the controlling SW changes (after SKIP_WAITING), reload
			// so the user gets the freshly cached assets.
			navigator.serviceWorker.addEventListener("controllerchange", () => {
				if (reloadingRef.current) return;
				reloadingRef.current = true;
				window.location.reload();
			});
		}

		return () => {
			mq.removeEventListener("change", handleMqChange);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	// ── installPWA ─────────────────────────────────────────────────────────
	const installPWA = useCallback(async (): Promise<boolean> => {
		const prompt = deferredPromptRef.current;
		if (!prompt) return false;

		try {
			prompt.prompt();
			const { outcome } = await prompt.userChoice;
			deferredPromptRef.current = null;

			if (outcome === "accepted") {
				setIsInstalled(true);
				setCanInstall(false);
				return true;
			}
			// User dismissed — hide the button but keep the prompt ref cleared.
			setCanInstall(false);
			return false;
		} catch {
			return false;
		}
	}, []);

	// ── applyUpdate ────────────────────────────────────────────────────────
	const applyUpdate = useCallback(async (): Promise<void> => {
		const reg = await navigator.serviceWorker.getRegistration().catch(() => null);
		if (!reg) return;

		if (reg.waiting) {
			// Tell the waiting SW to take over immediately.
			// Workbox's generated SW listens for {type: 'SKIP_WAITING'}.
			reg.waiting.postMessage({ type: "SKIP_WAITING" });
			track.updateAccepted();
			// controllerchange listener above will reload the page.
		}
	}, []);

	return (
		<PWAContext.Provider
			value={{ isInstalled, isOnline, canInstall, hasUpdate, installPWA, applyUpdate }}
		>
			{children}
		</PWAContext.Provider>
	);
}

/** Access the PWA state from any client component inside <PWAProvider>. */
export function usePWAContext(): PWAContextValue {
	return useContext(PWAContext);
}
