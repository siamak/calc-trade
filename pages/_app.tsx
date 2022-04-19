import {
	ChakraProvider,
} from "@chakra-ui/react";
import Script from "next/script";
import { NextIntlProvider } from "next-intl";
import { RtlProvider } from "../src/components/rtl.provider";
import theme from "../src/utils/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: any) {
	return (
		<NextIntlProvider messages={pageProps.messages}>
			<ChakraProvider theme={theme}>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-FDNZT3M442"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-FDNZT3M442', { page_path: window.location.pathname });
					`}
				</Script>
				<RtlProvider>
					<Component {...pageProps} />
				</RtlProvider>
			</ChakraProvider>
		</NextIntlProvider>
	);
}

export default MyApp;
