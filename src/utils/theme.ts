import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
const config: ThemeConfig = {
	initialColorMode: "light",
	useSystemColorMode: true,
};

const theme = extendTheme({
	config,

	semanticTokens: {
		colors: {
			error: "red.500",
			background: {
				default: "#F5F6FB",
				_dark: "#101217",
			},

			boxBg: {
				default: "#FFFFFF",
				_dark: "#1F2332",
			},

			foreground: {
				default: "gray.700",
				_dark: "gray.200",
			},
		},
	},

	styles: {
		global: {
			"html, body": {
				background: "background",
				color: "foreground",
				fontFeatureSettings: `"calt", "tnum"`,
			},
		},
	},
});

export default theme;
