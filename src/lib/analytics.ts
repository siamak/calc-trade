type EventData = Record<string, string | number | boolean | null | undefined>;

declare global {
	interface Window {
		umami?: {
			track: (event: string, data?: EventData) => void;
		};
	}
}

// Events fired before the Umami script has loaded are buffered here and
// flushed from <UmamiScript onReady>. Capped so a blocked script (ad-blockers)
// can't grow it forever.
const MAX_QUEUE = 50;
const queue: Array<[string, EventData | undefined]> = [];

function send(event: string, data?: EventData) {
	if (typeof window === "undefined") return;

	if (window.umami) {
		try {
			window.umami.track(event, data);
		} catch {
			// Never let analytics break the app.
		}
		return;
	}

	if (queue.length < MAX_QUEUE) queue.push([event, data]);
}

export function flushAnalyticsQueue() {
	if (typeof window === "undefined" || !window.umami) return;
	while (queue.length) {
		const [event, data] = queue.shift()!;
		send(event, data);
	}
}

// Continuous inputs (typing, slider drags) settle before we record them, and
// identical consecutive payloads for the same key are dropped.
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const lastSent = new Map<string, string>();

function sendSettled(key: string, event: string, data: EventData, wait: number) {
	const existing = timers.get(key);
	if (existing) clearTimeout(existing);

	timers.set(
		key,
		setTimeout(() => {
			timers.delete(key);
			const signature = JSON.stringify(data);
			if (lastSent.get(key) === signature) return;
			lastSent.set(key, signature);
			send(event, data);
		}, wait),
	);
}

const onceSent = new Set<string>();

function sendOnce(event: string, data?: EventData) {
	if (onceSent.has(event)) return;
	onceSent.add(event);
	send(event, data);
}

export type FormField = "balance" | "risk" | "stoploss" | "leverage";
export type CopiedField = "margin" | "size";
export type ExternalLinkType = "github-profile" | "github-repo" | "telegram";

export const analytics = {
	// ── Calculator ──────────────────────────────────────────────────────
	formInputChanged: (field: FormField, value: number) =>
		sendSettled(`input:${field}`, "form_input_changed", { field, value }, 1000),

	calculationPerformed: (params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
		positionSize: number;
		impossible: boolean;
		liquidationRisk: boolean;
	}) => sendSettled("calculation", "calculation_performed", params, 1500),

	riskRewardRatioChanged: (ratio: number) =>
		sendSettled("rr", "risk_reward_ratio_changed", { ratio }, 800),

	formReset: () => send("form_reset"),

	resultCopied: (field: CopiedField, value: number) =>
		send("result_copied", { field, value }),

	// ── Preferences ─────────────────────────────────────────────────────
	themeChanged: (theme: string) => send("theme_changed", { theme }),

	localeChanged: (from: string, to: string) =>
		send("locale_changed", { from, to }),

	// ── Learn guide / announcement ──────────────────────────────────────
	guideOpened: (source: "banner" | "url") =>
		send("guide_opened", { source }),

	guideClosed: () => send("guide_closed"),

	announcementDismissed: () => send("announcement_dismissed"),

	// ── PWA ─────────────────────────────────────────────────────────────
	pwaInstallPromptShown: () => sendOnce("pwa_install_prompt_shown"),

	pwaInstallClicked: () => send("pwa_install_clicked"),

	pwaInstallPromptResult: (outcome: "accepted" | "dismissed") =>
		send("pwa_install_prompt_result", { outcome }),

	pwaInstalled: () => sendOnce("pwa_installed"),

	pwaStandaloneLaunch: () => sendOnce("pwa_standalone_launch"),

	pwaUpdateShown: () => sendOnce("pwa_update_shown"),

	pwaUpdateApplied: () => send("pwa_update_applied"),

	// ── Network ─────────────────────────────────────────────────────────
	networkStatusChanged: (status: "offline" | "online") =>
		send(`network_${status}`),

	// ── Outbound / errors ───────────────────────────────────────────────
	externalLinkClicked: (url: string, linkType: ExternalLinkType) =>
		send("external_link_clicked", { url, linkType }),

	errorOccurred: (error: string, context?: string) =>
		send("error_occurred", {
			error: error.slice(0, 200),
			context: context?.slice(0, 200),
		}),

	errorRecovered: () => send("error_recovered"),
};

export default analytics;
