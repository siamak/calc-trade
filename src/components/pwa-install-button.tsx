"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export function PWAInstallButton() {
	const { canInstall, isInstalled, installPWA } = usePWA();

	if (isInstalled || !canInstall) {
		return null;
	}

	return (
		<Button
			onClick={installPWA}
			variant="ghost"
			className="fixed bottom-4 right-4 z-50 shadow-lg"
			size="sm"
		>
			<Download className="w-4 h-4 mr-2" />
			Install App
		</Button>
	);
}
