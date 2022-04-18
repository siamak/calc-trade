import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Container, Spinner } from "@chakra-ui/react";
import BookTable from "../src/components/book.table";

const CalcForm = dynamic(() => import("../src/components/calcform.component"), {
	loading: () => <Spinner />,
});
const Footer = dynamic(() => import("../src/components/footer"), {
	loading: () => <Spinner />,
});

const Book: NextPage = () => {
	return (
		<>
			<Head>
				<title>Book • Calculate trade</title>
				<meta
					name="description"
					content="Calculate the size of your trade position"
				/>
				<link rel="icon" href="/favicon.ico" />

				<meta name="application-name" content="Calculate trade" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Calculate trade" />
				{/* <meta name="description" content="Best PWA App in the world" /> */}
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#F5F6FB" />

				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="apple-touch-icon"
					sizes="167x167"
					href="/apple-touch-icon.png"
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/favicon.ico" />

				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_2048.png"
					sizes="2048x2732"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_1668.png"
					sizes="1668x2224"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_1536.png"
					sizes="1536x2048"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_1125.png"
					sizes="1125x2436"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_1242.png"
					sizes="1242x2208"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_750.png"
					sizes="750x1334"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple_splash_640.png"
					sizes="640x1136"
				/>
			</Head>

			<Container maxW={"100%"} mt={10}>
				<BookTable />
			</Container>
			<Container maxW={"36rem"} my={10}>
				<Footer />
			</Container>
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

export default Book;
