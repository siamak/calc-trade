"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAnalytics } from "@/hooks/use-analytics";

export function PageTracker() {
	const params = useParams();
	const locale = params.locale as string;
	const analytics = useAnalytics();

	useEffect(() => {
		analytics.pageViewed("/", locale);
	}, [locale, analytics]);

	return null;
}
