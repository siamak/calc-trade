"use client";

import { useStatsigClient } from "@statsig/react-bindings";
import { createAnalytics, fallbackAnalytics } from "@/lib/analytics";

export function useAnalytics() {
	const { logEvent } = useStatsigClient();

	// Return analytics functions that use Statsig if available, otherwise fallback
	if (logEvent) {
		return createAnalytics(logEvent);
	}

	return fallbackAnalytics;
}
