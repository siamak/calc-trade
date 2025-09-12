// Get or create a unique user ID
export const getOrCreateUserID = (): string => {
	if (typeof window === "undefined") return "anonymous";

	let userId = localStorage.getItem("statsig-user-id");
	if (!userId) {
		userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		localStorage.setItem("statsig-user-id", userId);
	}
	return userId;
};

// Event tracking functions - these will be used with the useStatsig hook
export const createAnalytics = (
	logEvent: (
		eventName: string,
		value?: any,
		metadata?: Record<string, any>
	) => void
) => ({
	// Form interactions
	formInputChanged: (field: string, value: any) => {
		logEvent("form_input_changed", {
			field,
			value,
			timestamp: Date.now(),
		});
	},

	// Calculation events
	calculationPerformed: (params: {
		balance: number;
		risk: number;
		stoploss: number;
		leverage: number;
		marginSize: number;
		riskCapital: number;
	}) => {
		logEvent("calculation_performed", {
			...params,
			timestamp: Date.now(),
		});
	},

	// User engagement
	pageViewed: (page: string, locale: string) => {
		logEvent("page_viewed", {
			page,
			locale,
			timestamp: Date.now(),
		});
	},

	// Risk management interactions
	riskRewardRatioChanged: (ratio: number) => {
		logEvent("risk_reward_ratio_changed", {
			ratio,
			timestamp: Date.now(),
		});
	},

	// Form reset
	formReset: () => {
		logEvent("form_reset", {
			timestamp: Date.now(),
		});
	},

	// Theme changes
	themeChanged: (theme: string) => {
		logEvent("theme_changed", {
			theme,
			timestamp: Date.now(),
		});
	},

	// Locale changes
	localeChanged: (locale: string) => {
		logEvent("locale_changed", {
			locale,
			timestamp: Date.now(),
		});
	},

	// PWA interactions
	pwaInstallPromptShown: () => {
		logEvent("pwa_install_prompt_shown", {
			timestamp: Date.now(),
		});
	},

	pwaInstalled: () => {
		logEvent("pwa_installed", {
			timestamp: Date.now(),
		});
	},

	// External links
	externalLinkClicked: (url: string, linkType: string) => {
		logEvent("external_link_clicked", {
			url,
			linkType,
			timestamp: Date.now(),
		});
	},

	// Error tracking
	errorOccurred: (error: string, context?: string) => {
		logEvent("error_occurred", {
			error,
			context,
			timestamp: Date.now(),
		});
	},
});

// Fallback analytics for when Statsig is not available
export const fallbackAnalytics = {
	formInputChanged: (field: string, value: any) => {
		console.log("Analytics: form_input_changed", { field, value });
	},
	calculationPerformed: (params: any) => {
		console.log("Analytics: calculation_performed", params);
	},
	pageViewed: (page: string, locale: string) => {
		console.log("Analytics: page_viewed", { page, locale });
	},
	riskRewardRatioChanged: (ratio: number) => {
		console.log("Analytics: risk_reward_ratio_changed", { ratio });
	},
	formReset: () => {
		console.log("Analytics: form_reset");
	},
	themeChanged: (theme: string) => {
		console.log("Analytics: theme_changed", { theme });
	},
	localeChanged: (locale: string) => {
		console.log("Analytics: locale_changed", { locale });
	},
	pwaInstallPromptShown: () => {
		console.log("Analytics: pwa_install_prompt_shown");
	},
	pwaInstalled: () => {
		console.log("Analytics: pwa_installed");
	},
	externalLinkClicked: (url: string, linkType: string) => {
		console.log("Analytics: external_link_clicked", { url, linkType });
	},
	errorOccurred: (error: string, context?: string) => {
		console.log("Analytics: error_occurred", { error, context });
	},
};

export default fallbackAnalytics;
