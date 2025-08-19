import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Container, Spinner } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

const CalcForm = dynamic(() => import("../src/components/calcform.component"), {
	loading: () => <Spinner />,
	ssr: false,
});
const GuideModal = dynamic(() => import("../src/components/guide.modal"), {
	loading: () => <Spinner />,
	ssr: true,
});
const Header = dynamic(() => import("../src/components/header"), {
	loading: () => <Spinner />,
	ssr: true,
});
const Footer = dynamic(() => import("../src/components/footer"), {
	loading: () => <Spinner />,
	ssr: true,
});
// const TelegramCTA = dynamic(() => import("../src/components/telegram.cta"), {
// 	loading: () => <Spinner />,
// });

const Home = () => {
	const router = useRouter();
	const { locale } = router;

	const title = locale === "fa" ? "ماشین حساب ترید" : "Calculate trade";

	return (
		<>
			<NextSeo
				title={title}
				description="calc.siamak.me is a calculator in order that your next trade's profit or loss with our trade assistant calculator. Optimize your strategy and make informed decisions in a single click. Try it now!"
			/>
			<Head>
				<link rel="icon" href="/favicon.ico" />

				<meta name="application-name" content="Calculate trade" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Calculate trade" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta
					name="theme-color"
					content="#F5F6FB"
					media="(prefers-color-scheme: light)"
				/>
				<meta
					name="theme-color"
					content="#101217"
					media="(prefers-color-scheme: dark)"
				/>

				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>

			<Container maxW={"44rem"} py={4}>
				<Header />
				<CalcForm />
				<Footer />
			</Container>

			{/* {locale === "fa" && <TelegramCTA />} */}
			<GuideModal />
		</>
	);
};

export function getStaticProps({ locale }: { locale: string }) {
	return {
		props: {
			messages: {
				...require(`../src/dict/${locale}.json`),
			},
		},
	};
}

export default Home;
