/**
 * Umami Analytics — privacy-first tracking utility
 *
 * This module is the single integration point for Umami across the entire app.
 * All raw `window.umami.track()` calls are centralised here so that:
 *
 *   • PII can never leak into analytics (sanitizeData strips sensitive keys).
 *   • Do Not Track is respected at the call site.
 *   • Opt-out preference is honoured without touching every component.
 *   • Offline events are queued and replayed on reconnect.
 *   • TypeScript enforces the event taxonomy at compile time.
 *
 * ─── Event taxonomy ──────────────────────────────────────────────────────────
 *
 * Naming convention:  {noun}_{verb}   (snake_case, past-tense verb)
 *
 * Category          Event name                  Why it matters
 * ──────────────    ──────────────────────────  ─────────────────────────────
 * Navigation        page_viewed                 SPA route changes (manual)
 * Core product      calculation_performed       Primary action — funnel depth
 * Core product      form_reset                  Drop-off signal
 * Core product      risk_reward_changed         Feature engagement depth
 * Core product      form_input_changed          Field-level engagement
 * Engagement        theme_changed               UX preference signal
 * Engagement        locale_changed              Internationalisation usage
 * Engagement        external_link_clicked       Outbound traffic intent
 * PWA               app_install_prompted        Install funnel top
 * PWA               app_installed               Install funnel conversion
 * PWA               app_opened_standalone       Installed PWA usage
 * PWA               offline_mode_entered        Reliability / network quality
 * PWA               reconnect_success           Network recovery + queue flush
 * PWA               update_accepted             SW update adoption rate
 * Errors            error_occurred              General runtime errors
 * Errors            error_boundary_triggered    Fatal component crashes
 */

import { enqueueEvent, flushQueue } from "@/lib/umami-queue";

// ─── Event taxonomy types ─────────────────────────────────────────────────────

export type UmamiEventName =
	// Navigation
	| "page_viewed"
	// Core product
	| "calculation_performed"
	| "form_reset"
	| "risk_reward_changed"
	| "form_input_changed"
	// Engagement
	| "theme_changed"
	| "locale_changed"
	| "external_link_clicked"
	// PWA lifecycle
	| "app_install_prompted"
	| "app_installed"
	| "app_opened_standalone"
	| "offline_mode_entered"
	| "reconnect_success"
	| "update_accepted"
	// Errors
	| "error_occurred"
	| "error_boundary_triggered";

/** Allowed value types for event payload properties (Umami constraint). */
export type UmamiEventData = Record<string, string | number | boolean>;

// ─── Strongly-typed payloads for key events ───────────────────────────────────

interface PageViewedData {
	path: string;
	locale: string;
	standalone: boolean;
}

interface CalculationData {
	/** Leverage multiplier (no balance/P&L values to avoid financial PII). */
	leverage: number;
	/** Risk percentage bucket, not the raw capital amount. */
	risk_pct: number;
	/** Whether a stop-loss was configured. */
	has_stoploss: boolean;
}

// ─── Privacy guards ───────────────────────────────────────────────────────────

/** Respect the browser's Do Not Track signal. */
function isDNT(): boolean {
	if (typeof navigator === "undefined") return false;
	return (
		navigator.doNotTrack === "1" ||
		(window as Window & { doNotTrack?: string }).doNotTrack === "1"
	);
}

const OPT_OUT_KEY = "umami_opt_out";

/** Keys that could inadvertently carry personally identifiable information. */
const PII_KEYS = new Set([
	"email",
	"name",
	"phone",
	"address",
	"ip",
	"user_id",
	"account",
	"password",
	"token",
	"secret",
	"balance", // financial PII
	"capital",
	"amount",
]);

/**
 * Remove any keys that could carry PII and coerce values to primitives
 * accepted by Umami's data model.
 */
function sanitizeData(
	data?: Record<string, unknown>
): UmamiEventData | undefined {
	if (!data) return undefined;

	const safe: UmamiEventData = {};
	for (const [key, value] of Object.entries(data)) {
		if (PII_KEYS.has(key.toLowerCase())) continue;

		if (
			typeof value === "string" ||
			typeof value === "number" ||
			typeof value === "boolean"
		) {
			safe[key] = value;
		} else {
			safe[key] = String(value);
		}
	}

	return Object.keys(safe).length > 0 ? safe : undefined;
}

// ─── Umami bridge ─────────────────────────────────────────────────────────────

/** Send directly to the Umami global injected by the script tag. */
function sendToUmami(name: string, data?: UmamiEventData): void {
	const umami = (window as Window & { umami?: { track: Function } }).umami;
	if (typeof umami?.track === "function") {
		umami.track(name, data);
	}
	// If the script hasn't loaded yet the event is silently skipped here.
	// Offline events are already handled upstream via the queue.
}

// ─── Core public function ─────────────────────────────────────────────────────

/**
 * Track a named event with an optional data payload.
 *
 * This is the only function that should call `window.umami.track` — all
 * higher-level helpers funnel through here so privacy guards apply everywhere.
 */
export function trackEvent(
	name: UmamiEventName,
	data?: UmamiEventData
): void {
	if (typeof window === "undefined") return; // SSR guard
	if (isDNT()) return; // Respect Do Not Track
	if (localStorage.getItem(OPT_OUT_KEY) === "1") return; // Respect opt-out

	const safeData = sanitizeData(data as Record<string, unknown>);

	if (!navigator.onLine) {
		enqueueEvent(name, safeData);
		return;
	}

	sendToUmami(name, safeData);
}

// ─── Opt-out / opt-in controls ────────────────────────────────────────────────

/**
 * User-facing preference controls.
 * Expose these through a settings UI to maintain GDPR compliance.
 */
export const analyticsConsent = {
	optOut(): void {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(OPT_OUT_KEY, "1");
		}
	},
	optIn(): void {
		if (typeof localStorage !== "undefined") {
			localStorage.removeItem(OPT_OUT_KEY);
		}
	},
	isOptedOut(): boolean {
		if (typeof localStorage === "undefined") return false;
		return localStorage.getItem(OPT_OUT_KEY) === "1";
	},
};

// ─── Offline sync initialiser ─────────────────────────────────────────────────

/**
 * Attach an `online` listener that flushes the offline event queue and records
 * a `reconnect_success` event when the network is restored.
 *
 * Call once at app initialisation (e.g. inside a `useEffect`).
 * Returns a cleanup function.
 */
export function initOfflineSync(): () => void {
	if (typeof window === "undefined") return () => {};

	function handleOnline() {
		const flushed = flushQueue((name, data) => sendToUmami(name, data));
		if (flushed > 0) {
			// Record recovery only when there were queued events.
			trackEvent("reconnect_success", { queued_events: flushed });
		}
	}

	window.addEventListener("online", handleOnline);
	return () => window.removeEventListener("online", handleOnline);
}

// ─── Typed event helpers ──────────────────────────────────────────────────────

/**
 * Convenience wrappers with strongly-typed arguments.
 * Import `track` instead of `trackEvent` in product code so the compiler
 * enforces the correct payload shape for each event.
 *
 * Usage:
 *   import { track } from "@/lib/umami";
 *   track.calculationPerformed({ leverage: 10, risk_pct: 1, has_stoploss: true });
 */
export const track = {
	// ── Navigation ────────────────────────────────────────────────────────────

	/**
	 * Manual SPA page view.
	 * Why: Next.js App Router changes the URL without a full reload; Umami's
	 * auto-tracking won't fire reliably, so we trigger it from usePathname().
	 */
	pageViewed(data: PageViewedData): void {
		trackEvent("page_viewed", data as unknown as UmamiEventData);
	},

	// ── Core product ──────────────────────────────────────────────────────────

	/**
	 * User completed a trade calculation.
	 * Why: This is the primary success action — tracking it measures funnel
	 * depth and feature adoption.  We deliberately omit balance/P&L values to
	 * avoid capturing financial PII.
	 */
	calculationPerformed(data: CalculationData): void {
		trackEvent("calculation_performed", data as unknown as UmamiEventData);
	},

	/**
	 * User reset the calculator form.
	 * Why: Repeated resets before a calculation can signal confusion or friction.
	 */
	formReset(): void {
		trackEvent("form_reset");
	},

	/**
	 * User changed the risk/reward ratio.
	 * Why: Indicates deeper engagement with the risk management features.
	 */
	riskRewardChanged(ratio: number): void {
		trackEvent("risk_reward_changed", { ratio });
	},

	/**
	 * User interacted with a specific form field.
	 * Why: Reveals which fields cause the most friction or are most used.
	 * Only the field *name* is tracked — never the value.
	 */
	formInputChanged(field: string): void {
		trackEvent("form_input_changed", { field });
	},

	// ── Engagement ────────────────────────────────────────────────────────────

	/**
	 * User switched the colour theme.
	 * Why: Informs whether dark mode support is worth investing in.
	 */
	themeChanged(theme: string): void {
		trackEvent("theme_changed", { theme });
	},

	/**
	 * User switched the app language.
	 * Why: Shows Persian vs English audience split and locale feature usage.
	 */
	localeChanged(locale: string): void {
		trackEvent("locale_changed", { locale });
	},

	/**
	 * User clicked an outbound link.
	 * Why: Measures interest in external resources without tracking the full URL
	 * (which could contain session tokens).  Only `type` is captured.
	 */
	externalLinkClicked(type: string): void {
		trackEvent("external_link_clicked", { type });
	},

	// ── PWA lifecycle ─────────────────────────────────────────────────────────

	/**
	 * Browser showed the install-to-homescreen prompt.
	 * Why: Top of the install funnel — divide installed/prompted for conversion.
	 */
	appInstallPrompted(): void {
		trackEvent("app_install_prompted");
	},

	/**
	 * User accepted the install prompt.
	 * Why: Bottom of the install funnel — the key PWA conversion metric.
	 */
	appInstalled(): void {
		trackEvent("app_installed");
	},

	/**
	 * App was opened in standalone (installed) mode.
	 * Why: Proves installed users actually return and re-open the app.
	 */
	appOpenedStandalone(): void {
		trackEvent("app_opened_standalone");
	},

	/**
	 * Device went offline while the app was open.
	 * Why: Measures how often offline-first features are exercised.
	 */
	offlineModeEntered(): void {
		trackEvent("offline_mode_entered");
	},

	/**
	 * Device came back online (fired inside initOfflineSync after queue flush).
	 * Why: Validates the offline queue round-trip end-to-end.
	 */
	reconnectSuccess(queuedEvents: number): void {
		trackEvent("reconnect_success", { queued_events: queuedEvents });
	},

	/**
	 * User accepted a service worker update.
	 * Why: Tracks update adoption velocity.
	 */
	updateAccepted(): void {
		trackEvent("update_accepted");
	},

	// ── Errors ────────────────────────────────────────────────────────────────

	/**
	 * A runtime error was caught (e.g. failed API call, unexpected state).
	 * Why: Error rate is a leading indicator of product quality.
	 * Message is truncated to 200 chars to avoid logging stack traces / PII.
	 */
	errorOccurred(message: string, context?: string): void {
		trackEvent("error_occurred", {
			message: message.slice(0, 200),
			context: (context ?? "").slice(0, 100),
		});
	},

	/**
	 * React Error Boundary caught a component crash.
	 * Why: Fatal UI crashes are the worst user experience — track them separately
	 * so they surface in dashboards without diluting generic error counts.
	 * Only the first line of the component stack is captured (no user data).
	 */
	errorBoundaryTriggered(componentStack?: string): void {
		const location =
			componentStack?.split("\n").find((l) => l.trim().startsWith("at "))?.trim().slice(0, 100) ??
			"unknown";
		trackEvent("error_boundary_triggered", { location });
	},
};
