import { useState, useEffect } from "react";

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
		};

		// Handle app installed event
		const handleAppInstalled = () => {
			setPwaState((prev) => ({
				...prev,
				isInstalled: true,
				canInstall: false,
				deferredPrompt: null,
			}));
		};

		// Handle online/offline events
		const handleOnline = () => {
			setPwaState((prev) => ({ ...prev, isOnline: true }));
		};

		const handleOffline = () => {
			setPwaState((prev) => ({ ...prev, isOnline: false }));
		};

		// Register service worker
		const registerServiceWorker = async () => {
			if ("serviceWorker" in navigator) {
				try {
					const registration = await navigator.serviceWorker.register(
						"/sw-custom.js"
					);
					console.log("Service Worker registered successfully:", registration);
				} catch (error) {
					console.error("Service Worker registration failed:", error);
				}
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

	// Function to check for updates
	const checkForUpdates = async () => {
		if ("serviceWorker" in navigator) {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				registration.update();
			}
		}
	};

	return {
		...pwaState,
		installPWA,
		checkForUpdates,
	};
}

