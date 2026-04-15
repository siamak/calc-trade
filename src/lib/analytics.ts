// Umami analytics helpers
// Umami exposes window.umami.track(eventName, data) for custom events.
// Page views are tracked automatically by the Umami script.

declare global {
	interface Window {
		umami?: {
			track: (eventName: string, data?: Record<string, unknown>) => void;
		};
	}
}

const track = (eventName: string, data?: Record<string, unknown>) => {
	if (typeof window !== "undefined" && window.umami?.track) {
		window.umami.track(eventName, data);
	}
};

export const analytics = {
	formInputChanged: (field: string, value: unknown) => {
		track("form_input_changed", { field, value });
	},

	calculationPerformed: (params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
	}) => {
		track("calculation_performed", params);
	},

	pageViewed: (page: string, locale: string) => {
		track("page_viewed", { page, locale });
	},

	riskRewardRatioChanged: (ratio: number) => {
		track("risk_reward_ratio_changed", { ratio });
	},

	formReset: () => {
		track("form_reset");
	},

	themeChanged: (theme: string) => {
		track("theme_changed", { theme });
	},

	localeChanged: (locale: string) => {
		track("locale_changed", { locale });
	},

	pwaInstallPromptShown: () => {
		track("pwa_install_prompt_shown");
	},

	pwaInstalled: () => {
		track("pwa_installed");
	},

	externalLinkClicked: (url: string, linkType: string) => {
		track("external_link_clicked", { url, linkType });
	},

	errorOccurred: (error: string, context?: string) => {
		track("error_occurred", { error, context });
	},
};

export default analytics;
