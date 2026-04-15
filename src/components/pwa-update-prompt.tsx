"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";

/**
 * Non-blocking update prompt shown in the bottom-right corner when a new
 * service worker is waiting to activate.
 *
 * The user can dismiss it (does nothing; the SW stays waiting until the next
 * navigation) or click "Update" to immediately activate the new SW and reload
 * the page with the latest assets.
 */
export function PWAUpdatePrompt() {
	const { hasUpdate, applyUpdate } = usePWA();
	const t = useTranslations("pwa");

	if (!hasUpdate) return null;

	return (
		<div
			role="alertdialog"
			aria-label={t("update.title")}
			className={[
				"fixed bottom-20 left-4 right-4",
				"md:left-auto md:right-4 md:w-80",
				"z-[90] rounded-xl border bg-background shadow-xl",
				"p-4 flex items-start gap-3",
				"animate-in slide-in-from-bottom-4 duration-300",
			].join(" ")}
		>
			<span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
				<RefreshCw className="h-4 w-4 text-primary" aria-hidden />
			</span>

			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold">{t("update.title")}</p>
				<p className="mt-0.5 text-xs text-muted-foreground">
					{t("update.description")}
				</p>
			</div>

			<Button
				size="sm"
				className="shrink-0 self-center"
				onClick={applyUpdate}
			>
				{t("update.button")}
			</Button>
		</div>
	);
}
