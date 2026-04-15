/**
 * Analytics service — Umami-backed
 *
 * A single, stable object returned by useAnalytics().  All methods delegate to
 * the Umami track.* helpers in @/lib/umami so that privacy guards, DNT checks,
 * and offline queuing apply automatically.
 *
 * The public method signatures are kept identical to the previous Statsig-based
 * API so that no call site in the app needs to change.
 */

import { track } from "@/lib/umami";

export const analyticsService = {
	// ── Form interactions ────────────────────────────────────────────────────

	/** Only the field *name* is forwarded — never the raw value (may be PII). */
	formInputChanged(field: string, _value: unknown): void {
		track.formInputChanged(field);
	},

	// ── Calculations ──────────────────────────────────────────────────────────

	/**
	 * Core product event.
	 * balance / riskCapital / marginSize are deliberately not forwarded to
	 * Umami — only structural parameters that cannot identify a user.
	 */
	calculationPerformed(params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
	}): void {
		track.calculationPerformed({
			leverage: params.leverage,
			risk_pct: params.risk,
			has_stoploss: params.stoploss > 0,
		});
	},

	// ── Navigation ────────────────────────────────────────────────────────────

	/**
	 * No-op: SPA page views are tracked once via useUmami / UmamiProvider to
	 * prevent duplicates.  This stub exists so call sites don't need to change.
	 */
	pageViewed(_page: string, _locale: string): void {
		// handled by useUmami
	},

	// ── Risk management ───────────────────────────────────────────────────────

	riskRewardRatioChanged(ratio: number): void {
		track.riskRewardChanged(ratio);
	},

	// ── Form reset ────────────────────────────────────────────────────────────

	formReset(): void {
		track.formReset();
	},

	// ── Engagement ────────────────────────────────────────────────────────────

	themeChanged(theme: string): void {
		track.themeChanged(theme);
	},

	localeChanged(locale: string): void {
		track.localeChanged(locale);
	},

	/**
	 * The full URL is never forwarded to Umami (could contain session tokens).
	 * Only the link type string is tracked.
	 */
	externalLinkClicked(_url: string, linkType: string): void {
		track.externalLinkClicked(linkType);
	},

	// ── PWA lifecycle ─────────────────────────────────────────────────────────

	pwaInstallPromptShown(): void {
		track.appInstallPrompted();
	},

	pwaInstalled(): void {
		track.appInstalled();
	},

	// ── Errors ────────────────────────────────────────────────────────────────

	errorOccurred(error: string, context?: string): void {
		track.errorOccurred(error, context);
	},
};
