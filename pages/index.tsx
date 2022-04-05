import { Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import HookForm from "../src/components/calcform.component";

const Home: NextPage = () => {
	return (
		<div>
			<Head>
				<title>Calculate trade</title>
				<meta name="description" content="Calculate the size of your trade position" />
				<link rel="icon" href="/favicon.ico" />

				<meta name="application-name" content="Calculate trade" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Calculate trade" />
				{/* <meta name="description" content="Best PWA App in the world" /> */}
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="theme-color" content="#fff" />

				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon.png" />

				{/* <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /> */}
				{/* <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
				<link rel="manifest" href="/manifest.json" />
				{/* <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" /> */}
				<link rel="shortcut icon" href="/favicon.ico" />

				{/* <meta name="twitter:card" content="summary" />
				<meta name="twitter:url" content="https://yourdomain.com" />
				<meta name="twitter:title" content="PWA App" />
				<meta name="twitter:description" content="Best PWA App in the world" />
				<meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
				<meta name="twitter:creator" content="@DavidWShadow" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="PWA App" />
				<meta property="og:description" content="Best PWA App in the world" />
				<meta property="og:site_name" content="PWA App" />
				<meta property="og:url" content="https://yourdomain.com" />
				<meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" /> */}

				<link rel="apple-touch-startup-image" href="/splash/apple_splash_2048.png" sizes="2048x2732" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_1668.png" sizes="1668x2224" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_1536.png" sizes="1536x2048" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_1125.png" sizes="1125x2436" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_1242.png" sizes="1242x2208" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_750.png" sizes="750x1334" />
				<link rel="apple-touch-startup-image" href="/splash/apple_splash_640.png" sizes="640x1136" />
			</Head>

			<Container py={10}>
				<HookForm />
			</Container>
		</div>
	);
};

export default Home;
