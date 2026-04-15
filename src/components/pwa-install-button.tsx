"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { useAnalytics } from "@/hooks/use-analytics";

/**
 * Floating install button shown when the browser fires `beforeinstallprompt`
 * and the app has not yet been installed.
 *
 * Placed in the bottom-right corner so it stays out of the way of the main
 * calculator UI.  Hidden automatically once the user installs or dismisses.
 */
export function PWAInstallButton() {
	const { canInstall, isInstalled, installPWA } = usePWA();
	const analytics = useAnalytics();
	const t = useTranslations("pwa");

	const handleInstallClick = async () => {
		const accepted = await installPWA();
		if (accepted) {
			analytics.pwaInstalled();
		}
	};

	// Don't render when the app is already installed or the prompt is not yet
	// available (e.g. iOS Safari, Firefox, first visit with no engagement).
	if (isInstalled || !canInstall) return null;

	return (
		<Button
			onClick={handleInstallClick}
			variant="outline"
			size="sm"
			className="fixed bottom-4 right-4 z-50 shadow-lg gap-2 rounded-full"
		>
			<Download className="h-4 w-4" aria-hidden />
			{t("install.button")}
		</Button>
	);
}
