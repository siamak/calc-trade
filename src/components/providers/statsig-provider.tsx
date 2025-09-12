"use client";

import { LogLevel, StatsigProvider } from "@statsig/react-bindings";
import { getOrCreateUserID } from "@/lib/analytics";

interface StatsigProviderWrapperProps {
	children: React.ReactNode;
}

export function StatsigProviderWrapper({
	children,
}: StatsigProviderWrapperProps) {
	const userId = getOrCreateUserID();

	return (
		<StatsigProvider
			sdkKey={
				process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || "client-key-placeholder"
			}
			user={{
				userID: userId,
				custom: {
					locale:
						typeof window !== "undefined" ? window.navigator.language : "en",
					platform: "web",
					userAgent:
						typeof window !== "undefined" ? window.navigator.userAgent : "",
				},
			}}
			options={{ logLevel: LogLevel.Debug }}
			loadingComponent={<div>Loading...</div>}
		>
			{children}
		</StatsigProvider>
	);
}
