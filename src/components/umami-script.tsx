"use client";

import Script from "next/script";
import { flushAnalyticsQueue } from "@/lib/analytics";

const SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
const WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
// Optional comma-separated allow-list (e.g. "calc.siamak.pro") so localhost and
// preview deploys don't pollute production stats.
const DOMAINS = process.env.NEXT_PUBLIC_UMAMI_DOMAINS;
// Optional path prefix (e.g. "/calc") so this app's pages stay distinguishable
// when it shares a Umami website with siamak.pro: "/en/" is reported as
// "/calc/en/".
const PATH_PREFIX = process.env.NEXT_PUBLIC_UMAMI_PATH_PREFIX?.replace(/\/+$/, "");

const BEFORE_SEND = "__calcUmamiBeforeSend";

type UmamiPayload = { url?: string; [key: string]: unknown };

function withPrefix(url: string, prefix: string) {
	// Newer trackers send an absolute URL, older ones a path.
	if (/^https?:\/\//.test(url)) {
		const parsed = new URL(url);
		parsed.pathname = withPrefix(parsed.pathname, prefix);
		return parsed.toString();
	}
	if (url === prefix || url.startsWith(`${prefix}/`)) return url;
	return prefix + (url.startsWith("/") ? url : `/${url}`);
}

// Umami resolves the `data-before-send` callback on window at send time, so it
// must exist before the tracker fires its first pageview.
if (typeof window !== "undefined" && PATH_PREFIX) {
	(window as unknown as Record<string, unknown>)[BEFORE_SEND] = (
		_type: string,
		payload: UmamiPayload,
	) =>
		typeof payload?.url === "string"
			? { ...payload, url: withPrefix(payload.url, PATH_PREFIX) }
			: payload;
}

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
			data-before-send={PATH_PREFIX ? BEFORE_SEND : undefined}
			strategy="afterInteractive"
			onReady={flushAnalyticsQueue}
		/>
	);
}
