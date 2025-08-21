import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

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

// Apply PWA configuration
const configWithPWA = withPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development",
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
			handler: "CacheFirst",
			options: {
				cacheName: "google-fonts",
				expiration: {
					maxEntries: 4,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
			},
		},
		{
			urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			handler: "CacheFirst",
			options: {
				cacheName: "static-font-assets",
				expiration: {
					maxEntries: 4,
					maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
				},
			},
		},
		{
			urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
			handler: "CacheFirst",
			options: {
				cacheName: "static-image-assets",
				expiration: {
					maxEntries: 64,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\.(?:js)$/i,
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "static-js-assets",
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\.(?:css|less)$/i,
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "static-style-assets",
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\/_next\/image\?url=.+$/i,
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "next-image",
				expiration: {
					maxEntries: 64,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "next-data",
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\.(?:json|xml|csv)$/i,
			handler: "NetworkFirst",
			options: {
				cacheName: "static-data-assets",
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
		{
			urlPattern: /\/api\/.*$/i,
			handler: "NetworkFirst",
			method: "GET",
			options: {
				cacheName: "apis",
				expiration: {
					maxEntries: 16,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
				networkTimeoutSeconds: 10,
			},
		},
		{
			urlPattern: /.*/i,
			handler: "NetworkFirst",
			options: {
				cacheName: "others",
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
				networkTimeoutSeconds: 10,
			},
		},
	],
})(nextConfig);

export default withNextIntl(configWithPWA);
