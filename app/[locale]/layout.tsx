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
	const fontClass = isRTL ? "font-persian" : "font-sans";

	return (
		<html lang={locale} dir={dir} suppressHydrationWarning>
			<head>
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
