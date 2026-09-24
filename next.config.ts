import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	reactStrictMode: true,

	images: {
		domains: [],
	},

	experimental: {
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},

	env: {},

	async headers() {
		return [
			{
				source: "/fa/:path*",
				headers: [{ key: "Content-Language", value: "fa" }],
			},
			{
				source: "/en/:path*",
				headers: [{ key: "Content-Language", value: "en" }],
			},
		];
	},

	trailingSlash: true,
};

// The service worker is generated after the build by scripts/build-sw.mjs.
export default withNextIntl(nextConfig);
