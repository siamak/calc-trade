import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
		themeColor: "#FFFFFF",
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
	// Ensure that the incoming `locale` is valid
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
				{/* PWA Meta Tags */}
				<meta name="application-name" content="Calc Trade" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Calc Trade" />
				<meta
					name="description"
					content="Professional calculator for position size, risk and reward calculation in trading"
				/>
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="msapplication-config" content="/browserconfig.xml" />
				<meta name="msapplication-TileColor" content="#FFFFFF" />
				<meta name="msapplication-tap-highlight" content="no" />
				<meta name="theme-color" content="#FFFFFF" />

				{/* PWA Icons */}
				<link rel="apple-touch-icon" href="/icons/ios/180.png" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/icons/ios/32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/icons/ios/16.png"
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="mask-icon" href="/icon.png" color="#FFFFFF" />
				<link rel="shortcut icon" href="/favicon.ico" />

				{/* Persian fonts for RTL */}
				{isRTL && (
					<>
						<link
							rel="preload"
							href="/webfont/IRANSansXV.woff2"
							as="font"
							type="font/woff2"
							crossOrigin="anonymous"
						/>
						<link
							rel="preload"
							href="/webfont/IRANSansXV.woff"
							as="font"
							type="font/woff"
							crossOrigin="anonymous"
						/>
						<link
							rel="preload"
							href="/webfont/staticfonts/IRANSansX-Regular.woff"
							as="font"
							type="font/woff"
							crossOrigin="anonymous"
						/>
					</>
				)}

				{/* English fonts for LTR */}
				{!isRTL && (
					<>
						<link rel="preconnect" href="https://fonts.googleapis.com" />
						<link
							rel="preconnect"
							href="https://fonts.gstatic.com"
							crossOrigin="anonymous"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
							rel="stylesheet"
						/>
					</>
				)}
			</head>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-FDNZT3M442', { page_path: window.location.pathname });
				`}
			</Script>

			<Script id="pwa-install-prompt" strategy="afterInteractive">
				{`
					let deferredPrompt;

					window.addEventListener('beforeinstallprompt', (e) => {
						e.preventDefault();
						deferredPrompt = e;

						// Show install button or notification
						const installButton = document.getElementById('install-pwa');
						if (installButton) {
							installButton.style.display = 'block';
						}
					});

					window.addEventListener('appinstalled', () => {
						deferredPrompt = null;
						const installButton = document.getElementById('install-pwa');
						if (installButton) {
							installButton.style.display = 'none';
						}
					});

					// Handle offline/online status
					window.addEventListener('online', () => {
						document.body.classList.remove('offline');
						document.body.classList.add('online');
					});

					window.addEventListener('offline', () => {
						document.body.classList.remove('online');
						document.body.classList.add('offline');
					});

					// Check initial connection status
					if (!navigator.onLine) {
						document.body.classList.add('offline');
					} else {
						document.body.classList.add('online');
					}
				`}
			</Script>

			<body dir={dir} className={`bg-background text-foreground ${fontClass}`}>
				<NextIntlClientProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fa" }];
}
