"use client";

import Script from "next/script";
import { flushAnalyticsQueue } from "@/lib/analytics";

const SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Optional comma-separated allow-list (e.g. "calc.siamak.me") so localhost and
// preview deploys don't pollute production stats.
const DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;

/**
 * Loads the Umami tracker after hydration and flushes any events that were
 * queued before it was ready.
 */
export function UmamiScript() {
	if (!SCRIPT_URL || !WEBSITE_ID) return null;

	return (
		<Script
			src={SCRIPT_URL}
			data-website-id={WEBSITE_ID}
			data-domains={DOMAINS || undefined}
			strategy="afterInteractive"
			onReady={flushAnalyticsQueue}
		/>
	);
}
