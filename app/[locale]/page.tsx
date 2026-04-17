import { Suspense } from "react";
import Header from "@/components/header";
import CalcForm from "@/components/calc-form";
import Footer from "@/components/footer";
import { PWAInstallButton } from "@/components/pwa-install-button";
import { Metadata } from "next";
import { RiskManagementGuide } from "@/components/risk-management-guide";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
	params: Promise<{
		locale: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const title = locale === "fa" ? "ماشین حساب ترید" : "Calculate trade";

	return {
		title,
		description:
			"calc.siamak.me is a calculator in order that your next trade's profit or loss with our trade assistant calculator. Optimize your strategy and make informed decisions in a single click. Try it now!",
		applicationName: "Calculate trade",
		appleWebApp: {
			capable: true,
			statusBarStyle: "default",
			title: "Calculate trade",
		},
		formatDetection: {
			telephone: false,
		},
		icons: {
			apple: "/apple-touch-icon.png",
			shortcut: "/favicon.ico",
		},
		manifest: "/manifest.json",
	};
}

function HeaderSkeleton() {
	return (
		<div className="flex items-center justify-between gap-4 flex-col md:flex-row">
			<div className="flex items-center gap-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-5 w-8 rounded-full" />
			</div>
			<div className="flex items-center gap-2">
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-9 w-9 rounded-md" />
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<>
			<main className="container mx-auto max-w-xl p-4">
				<RiskManagementGuide />
				<Suspense fallback={<HeaderSkeleton />}>
					<Header />
				</Suspense>
				<CalcForm />
				<Footer />
			</main>

			{/* PWA Components */}
			<PWAInstallButton />
		</>
	);
}
