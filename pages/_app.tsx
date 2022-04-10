import { ChakraProvider, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { NextIntlProvider } from "next-intl";
import "../styles/globals.css";

// 2. Add your color mode config
const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({
	config,

	styles: {
		global: {
			"html, body": {
				background: "#F5F6FB",
			},
		},
	},
});

function MyApp({ Component, pageProps }: any) {
	return (
		<NextIntlProvider messages={pageProps.messages}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</NextIntlProvider>
	);
}

export default MyApp;
