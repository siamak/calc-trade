"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePWA } from "@/hooks/use-pwa";

/**
 * Thin banner pinned to the top of the viewport that communicates network
 * status to the user.
 *
 * Behaviour:
 * - Hidden while online and no prior offline session has occurred.
 * - Yellow "offline" strip while the device has no network.
 * - Green "back online" strip for 3 s after connectivity is restored, then
 *   fades out so it doesn't permanently occupy space.
 */
export function OfflineBanner() {
	const { isOnline } = usePWA();
	const t = useTranslations("pwa");

	// Whether we have ever been offline in this session — used to decide
	// whether to show the "back online" flash on reconnect.
	const wasOfflineRef = useRef(false);
	const [visible, setVisible] = useState(false);
	const [reconnected, setReconnected] = useState(false);
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!isOnline) {
			// Went offline — clear any pending hide timer and show offline strip.
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
			wasOfflineRef.current = true;
			setReconnected(false);
			setVisible(true);
		} else if (wasOfflineRef.current) {
			// Back online after being offline — briefly flash the green strip.
			setReconnected(true);
			setVisible(true);
			hideTimerRef.current = setTimeout(() => {
				setVisible(false);
				setReconnected(false);
			}, 3_000);
		}

		return () => {
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		};
	}, [isOnline]);

	if (!visible) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			className={[
				"fixed top-0 inset-x-0 z-[100] flex items-center justify-center gap-2",
				"px-4 py-2 text-sm font-medium text-white",
				"transition-all duration-300",
				reconnected
					? "bg-green-500"
					: "bg-amber-500",
			].join(" ")}
		>
			{reconnected ? (
				<>
					<Wifi className="h-4 w-4 shrink-0" aria-hidden />
					{t("offline.reconnected")}
				</>
			) : (
				<>
					<WifiOff className="h-4 w-4 shrink-0" aria-hidden />
					{t("offline.message")}
				</>
			)}
		</div>
	);
}
