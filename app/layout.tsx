import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Calc Trade",
	description:
		"Professional calculator for position size, risk and reward calculation in trading",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<head>
				{/* Preload custom fonts for all locales */}
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
				<link
					rel="preload"
					href="/webfont/staticfonts/IRANSansX-Bold.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>

				{/* Google Fonts for English */}
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
			</head>
			<body>{children}</body>
		</html>
	);
}
