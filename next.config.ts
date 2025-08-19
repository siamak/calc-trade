import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	// Enable React strict mode for better development experience
	reactStrictMode: true,

	// Optimize images (if you plan to use Next.js Image component)
	images: {
		domains: [], // Add any external domains for images here
	},

	// Enable experimental features if needed
	experimental: {
		// Enable if you need server components optimization
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},

	// Custom webpack configuration for better build optimization
	webpack: (config) => {
		// Handle any custom webpack configurations here
		return config;
	},

	// Environment variables (if needed)
	env: {
		// Add any custom environment variables here
	},

	// Custom headers for RTL support and Persian language
	async headers() {
		return [
			{
				source: "/fa/:path*",
				headers: [
					{
						key: "Content-Language",
						value: "fa",
					},
				],
			},
			{
				source: "/en/:path*",
				headers: [
					{
						key: "Content-Language",
						value: "en",
					},
				],
			},
		];
	},
	trailingSlash: true,
};

export default withNextIntl(nextConfig);
