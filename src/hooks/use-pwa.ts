"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { track } from "@/lib/umami";

interface PWAState {
	isInstalled: boolean;
	isOnline: boolean;
	canInstall: boolean;
	deferredPrompt: any;
}

export function usePWA() {
	const [pwaState, setPwaState] = useState<PWAState>({
		isInstalled: false,
		isOnline: true,
		canInstall: false,
		deferredPrompt: null,
	});
	const analytics = useAnalytics();

	useEffect(() => {
		// Check if app is already installed
		const checkIfInstalled = () => {
			const isStandalone = window.matchMedia(
				"(display-mode: standalone)"
			).matches;
			const isIOSStandalone = (window.navigator as any).standalone === true;

			setPwaState((prev) => ({
				...prev,
				isInstalled: isStandalone || isIOSStandalone,
			}));
		};

		// Handle beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: any) => {
			e.preventDefault();
			setPwaState((prev) => ({
				...prev,
				canInstall: true,
				deferredPrompt: e,
			}));
			analytics.pwaInstallPromptShown();
		};

		// Handle app installed event
		const handleAppInstalled = () => {
			setPwaState((prev) => ({
				...prev,
				isInstalled: true,
				canInstall: false,
				deferredPrompt: null,
			}));
			analytics.pwaInstalled();
		};

		// Handle online/offline events
		const handleOnline = () => {
			setPwaState((prev) => ({ ...prev, isOnline: true }));
		};

		const handleOffline = () => {
			setPwaState((prev) => ({ ...prev, isOnline: false }));

			// Register a background-sync tag so the SW can notify this client
			// to flush queued analytics even if the tab is in the background.
			if ("serviceWorker" in navigator && "SyncManager" in window) {
				navigator.serviceWorker.ready.then((reg) => {
					(reg as ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } })
						.sync?.register("umami-analytics-flush")
						.catch(() => {
							// Background Sync not permitted — online listener handles it.
						});
				});
			}
		};

		// Register service worker and wire up background-sync + SW messaging
		const registerServiceWorker = async () => {
			if (!("serviceWorker" in navigator)) return;

			try {
				const registration = await navigator.serviceWorker.register(
					"/sw-custom.js"
				);
				console.log("Service Worker registered successfully:", registration);

				// When the SW sends UMAMI_FLUSH_QUEUE (via background-sync), flush
				// the offline analytics queue immediately on this client.
				navigator.serviceWorker.addEventListener("message", (event) => {
					if (event.data?.type === "UMAMI_FLUSH_QUEUE") {
						import("@/lib/umami-queue").then(({ flushQueue }) => {
							import("@/lib/umami").then(({ trackEvent }) => {
								flushQueue((name, data) => {
									// Re-use the same send path as the online flush
									const umami = (
										window as Window & {
											umami?: { track: Function };
										}
									).umami;
									umami?.track?.(name, data);
								});
								trackEvent("reconnect_success", { source: "background_sync" });
							});
						});
					}
				});
			} catch (error) {
				console.error("Service Worker registration failed:", error);
			}
		};

		// Check initial state
		checkIfInstalled();
		setPwaState((prev) => ({ ...prev, isOnline: navigator.onLine }));

		// Register service worker
		registerServiceWorker();

		// Add event listeners
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Function to install the PWA
	const installPWA = async () => {
		if (!pwaState.deferredPrompt) return false;

		try {
			pwaState.deferredPrompt.prompt();
			const { outcome } = await pwaState.deferredPrompt.userChoice;

			if (outcome === "accepted") {
				setPwaState((prev) => ({
					...prev,
					isInstalled: true,
					canInstall: false,
					deferredPrompt: null,
				}));
				return true;
			}

			setPwaState((prev) => ({
				...prev,
				deferredPrompt: null,
			}));
			return false;
		} catch (error) {
			console.error("Error installing PWA:", error);
			return false;
		}
	};

	// Function to check for updates and record when a new SW is accepted
	const checkForUpdates = async () => {
		if (!("serviceWorker" in navigator)) return;

		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) return;

		registration.update();

		// If a new service worker is waiting, prompt it to take control and
		// record the update acceptance for product analytics.
		if (registration.waiting) {
			registration.waiting.postMessage({ type: "SKIP_WAITING" });
			track.updateAccepted();
		}
	};

	return {
		...pwaState,
		installPWA,
		checkForUpdates,
	};
}
