import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PWAProvider } from "@/components/providers/pwa-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { OfflineBanner } from "@/components/offline-banner";
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt";

import "../globals.css";

type Props = {
	children: React.ReactNode;
	params: Promise<{
		locale: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const isRTL = locale === "fa";

	const titles = {
		fa: "ماشین حساب ترید - Siamak Mokhtari",
		en: "Trade Calculator - Siamak Mokhtari",
	};

	const descriptions = {
		fa: "ماشین حساب حرفه‌ای برای محاسبه سایز پوزیشن، ریسک و ریوارد در ترید",
		en: "Professional calculator for position size, risk and reward calculation in trading",
	};

	return {
		title: titles[locale as keyof typeof titles] || titles.en,
		description:
			descriptions[locale as keyof typeof descriptions] || descriptions.en,
		other: {
			dir: isRTL ? "rtl" : "ltr",
		},
		manifest: "/manifest.json",
		themeColor: [
			{ media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
			{ media: "(prefers-color-scheme: dark)", color: "#101217" },
		],
		appleWebApp: {
			capable: true,
			statusBarStyle: "default",
			title: titles[locale as keyof typeof titles] || titles.en,
		},
		formatDetection: {
			telephone: false,
		},
		openGraph: {
			type: "website",
			locale: locale,
			url: "https://calc-trade.vercel.app",
			title: titles[locale as keyof typeof titles] || titles.en,
			description:
				descriptions[locale as keyof typeof descriptions] || descriptions.en,
			siteName: "Calc Trade",
		},
		twitter: {
			card: "summary_large_image",
			title: titles[locale as keyof typeof titles] || titles.en,
			description:
				descriptions[locale as keyof typeof descriptions] || descriptions.en,
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	const isRTL = locale === "fa";
	const dir = isRTL ? "rtl" : "ltr";
	const fontClass = isRTL ? "font-persian" : "font-english";

	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<head>
				{/* Core PWA / browser meta */}
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />

				<meta name="application-name" content="Calc Trade" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Calc Trade" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />

				{/* theme-color for light / dark mode */}
				<meta
					name="theme-color"
					content="#ffffff"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#101217"
					media="(prefers-color-scheme: dark)"
				/>
			</head>

			{/* Google Analytics — loaded after interaction so it doesn't block paint */}
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-FDNZT3M442', { page_path: window.location.pathname });
				`}
			</Script>

			{/* Umami Analytics */}
			{process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
				<Script
					src={`${process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is"}/script.js`}
					data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
					strategy="afterInteractive"
				/>
			)}

			<body dir={dir} className={`bg-background text-foreground ${fontClass}`}>
				<NuqsAdapter>
					<NextIntlClientProvider>
						<ErrorBoundary>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								{/*
								 * PWAProvider mounts once per locale layout and owns all
								 * service-worker registration, online/offline state, install
								 * prompt, and update detection.  Every component that calls
								 * usePWA() reads from this shared context — no duplicate
								 * registrations or divergent state.
								 */}
								<PWAProvider>
									{/* Offline / reconnected banner — pinned to top of viewport */}
									<OfflineBanner />

									{children}

									{/* Update-available prompt — bottom-right corner */}
									<PWAUpdatePrompt />

									<Toaster />
								</PWAProvider>
							</ThemeProvider>
						</ErrorBoundary>
					</NextIntlClientProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fa" }];
}
