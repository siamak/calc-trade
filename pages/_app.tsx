import { ChakraProvider, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { NextIntlProvider } from "next-intl";

// 2. Add your color mode config
const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({
	config,
	fonts: {
		heading:
			"Inter, Vazirmatn, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
		body: "Inter, Vazirmatn, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
	},
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
