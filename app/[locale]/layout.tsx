import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
		{ media: "(prefers-color-scheme: dark)", color: "#101217" },
	],
};

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
		<>
			{/* Umami analytics - loaded after interaction so it doesn't block paint */}
			{process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
				process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
					<Script
						src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
						data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
						strategy="afterInteractive"
					/>
				)}

			<div dir={dir} className={`bg-background text-foreground ${fontClass}`}>
				<NuqsAdapter>
					<NextIntlClientProvider>
						<ErrorBoundary>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
								disableTransitionOnChange
							>
								<PWAProvider>
									<OfflineBanner />
									{children}
									<PWAUpdatePrompt />
									<Toaster />
								</PWAProvider>
							</ThemeProvider>
						</ErrorBoundary>
					</NextIntlClientProvider>
				</NuqsAdapter>
			</div>
		</>
	);
}

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fa" }];
}
