import Header from "@/components/header";
import CalcForm from "@/components/calcform.component";
import Footer from "@/components/footer";
import GuideModal from "@/components/guide.modal";
import { Metadata } from "next";

// Force dynamic rendering to prevent prerendering issues with client components
export const dynamic = "force-dynamic";

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

export default function Page() {
	return (
		<>
			<div className="container mx-auto max-w-3xl py-4">
				<Header />
				<CalcForm />
				<Footer />
				<GuideModal />
			</div>
		</>
	);
}
