/**
 * Analytics aggregation layer
 *
 * Every product event is sent to *two* analytics providers in parallel:
 *   • Statsig  — feature flags, A/B testing, and detailed event streams.
 *   • Umami    — privacy-first, aggregate product metrics; GDPR-friendly.
 *
 * Call sites should use `useAnalytics()` (or `createAnalytics()` in class
 * contexts) rather than importing either provider directly.  This keeps the
 * provider coupling out of product code and makes it easy to add or swap
 * providers later.
 */

import { track } from "@/lib/umami";

// ─── User identity ────────────────────────────────────────────────────────────

/** Returns a stable, random session ID stored in localStorage.
 *  No PII — purely a random string used by Statsig for session continuity. */
export const getOrCreateUserID = (): string => {
	if (typeof window === "undefined") return "anonymous";

	let userId = localStorage.getItem("statsig-user-id");
	if (!userId) {
		userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem("statsig-user-id", userId);
	}
	return userId;
};

// ─── Analytics factory ────────────────────────────────────────────────────────

/**
 * Creates an analytics object bound to a Statsig `logEvent` function.
 * Each method fires Statsig *and* the corresponding Umami event.
 */
export const createAnalytics = (
	logEvent: (
		eventName: string,
		value?: unknown,
		metadata?: Record<string, unknown>
	) => void
) => ({
	// ── Form interactions ────────────────────────────────────────────────────

	formInputChanged(field: string, value: unknown) {
		logEvent("form_input_changed", { field, value, timestamp: Date.now() });
		track.formInputChanged(field);
	},

	// ── Calculations ──────────────────────────────────────────────────────────

	/**
	 * Core product event.
	 * Note: balance and riskCapital are intentionally omitted from Umami to
	 * avoid capturing financial PII.  Only structural parameters are forwarded.
	 */
	calculationPerformed(params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
	}) {
		logEvent("calculation_performed", { ...params, timestamp: Date.now() });
		track.calculationPerformed({
			leverage: params.leverage,
			risk_pct: params.risk,
			has_stoploss: params.stoploss > 0,
		});
	},

	// ── Navigation ────────────────────────────────────────────────────────────

	pageViewed(page: string, locale: string) {
		logEvent("page_viewed", { page, locale, timestamp: Date.now() });
		// Umami page views are handled by useUmami to avoid duplicates.
	},

	// ── Risk management ───────────────────────────────────────────────────────

	riskRewardRatioChanged(ratio: number) {
		logEvent("risk_reward_ratio_changed", { ratio, timestamp: Date.now() });
		track.riskRewardChanged(ratio);
	},

	// ── Form reset ────────────────────────────────────────────────────────────

	formReset() {
		logEvent("form_reset", { timestamp: Date.now() });
		track.formReset();
	},

	// ── Engagement ────────────────────────────────────────────────────────────

	themeChanged(theme: string) {
		logEvent("theme_changed", { theme, timestamp: Date.now() });
		track.themeChanged(theme);
	},

	localeChanged(locale: string) {
		logEvent("locale_changed", { locale, timestamp: Date.now() });
		track.localeChanged(locale);
	},

	externalLinkClicked(url: string, linkType: string) {
		logEvent("external_link_clicked", {
			url,
			linkType,
			timestamp: Date.now(),
		});
		track.externalLinkClicked(linkType);
	},

	// ── PWA ───────────────────────────────────────────────────────────────────

	pwaInstallPromptShown() {
		logEvent("pwa_install_prompt_shown", { timestamp: Date.now() });
		track.appInstallPrompted();
	},

	pwaInstalled() {
		logEvent("pwa_installed", { timestamp: Date.now() });
		track.appInstalled();
	},

	// ── Errors ────────────────────────────────────────────────────────────────

	errorOccurred(error: string, context?: string) {
		logEvent("error_occurred", { error, context, timestamp: Date.now() });
		track.errorOccurred(error, context);
	},
});

// ─── Fallback (no Statsig) ────────────────────────────────────────────────────

/**
 * Used when the Statsig SDK is unavailable (e.g. blocked by an ad blocker).
 * Umami events still fire so aggregate metrics are unaffected.
 */
export const fallbackAnalytics = {
	formInputChanged(field: string, value: unknown) {
		console.log("Analytics: form_input_changed", { field, value });
		track.formInputChanged(field);
	},

	calculationPerformed(params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
	}) {
		console.log("Analytics: calculation_performed", params);
		track.calculationPerformed({
			leverage: params.leverage,
			risk_pct: params.risk,
			has_stoploss: params.stoploss > 0,
		});
	},

	pageViewed(page: string, locale: string) {
		console.log("Analytics: page_viewed", { page, locale });
		// Umami page views handled by useUmami.
	},

	riskRewardRatioChanged(ratio: number) {
		console.log("Analytics: risk_reward_ratio_changed", { ratio });
		track.riskRewardChanged(ratio);
	},

	formReset() {
		console.log("Analytics: form_reset");
		track.formReset();
	},

	themeChanged(theme: string) {
		console.log("Analytics: theme_changed", { theme });
		track.themeChanged(theme);
	},

	localeChanged(locale: string) {
		console.log("Analytics: locale_changed", { locale });
		track.localeChanged(locale);
	},

	externalLinkClicked(url: string, linkType: string) {
		console.log("Analytics: external_link_clicked", { url, linkType });
		track.externalLinkClicked(linkType);
	},

	pwaInstallPromptShown() {
		console.log("Analytics: pwa_install_prompt_shown");
		track.appInstallPrompted();
	},

	pwaInstalled() {
		console.log("Analytics: pwa_installed");
		track.appInstalled();
	},

	errorOccurred(error: string, context?: string) {
		console.log("Analytics: error_occurred", { error, context });
		track.errorOccurred(error, context);
	},
};

export default fallbackAnalytics;
