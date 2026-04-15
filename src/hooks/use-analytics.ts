"use client";

import { analyticsService } from "@/lib/analytics";

/**
 * Returns the analytics service for use in React components.
 * The returned object is stable (module-level singleton) so it will not
 * cause unnecessary re-renders when used as a dependency.
 */
export function useAnalytics() {
	return analyticsService;
}
