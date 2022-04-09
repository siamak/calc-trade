const withPWA = require("next-pwa");

module.exports = withPWA({
	pwa: {
		dest: "public",
		disable: process.env.NODE_ENV === "development",
	},
	reactStrictMode: true,
	i18n: {
		locales: ["default", "en", "fa"],
		defaultLocale: "default",
		localeDetection: true,
	},
	trailingSlash: true,
});
