import { ChakraProvider, extendTheme, type ThemeConfig } from "@chakra-ui/react";

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
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
