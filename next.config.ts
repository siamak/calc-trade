import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	reactStrictMode: true,

	images: {
		domains: [],
	},

	experimental: {
		optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
	},

	webpack: (config) => {
		return config;
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

// ── PWA configuration ──────────────────────────────────────────────────────
//
// Strategy: Workbox generateSW (via next-pwa).
//
// Why generateSW and not injectManifest?
// This app has no complex custom fetch logic — all caching requirements are
// expressible through Workbox's built-in strategies.  generateSW keeps the
// configuration colocated here and requires zero SW boilerplate.
//
// Key decisions:
//  • register: false  — We register /sw.js manually in PWAProvider so we can
//    intercept the `updatefound` event and show a user-facing update prompt.
//  • skipWaiting: false — New SWs wait until the user confirms the update.
//    PWAProvider sends SKIP_WAITING when the user clicks "Update".
//  • buildExcludes   — Prevents next-pwa from precaching the middleware
//    manifest (not needed by the SW) and the deprecated sw-custom.js.
//
const configWithPWA = withPWA({
	dest: "public",

	// We handle registration in PWAProvider for update-lifecycle control.
	register: false,

	// Do NOT auto-activate new SWs; let the user trigger the reload.
	skipWaiting: false,

	// Disable in development so hot-reload isn't blocked by a stale SW.
	disable: process.env.NODE_ENV === "development",

	// Keep the precache manifest lean — exclude files the SW doesn't need.
	buildExcludes: [
		/middleware-manifest\.json$/,
		/sw-custom\.js$/,
		/chunks\/pages\/_error\.js$/,
	],

	// ── Runtime caching rules ────────────────────────────────────────────
	// Listed from most-specific to least-specific.  Workbox evaluates rules
	// in order and stops at the first match.
	runtimeCaching: [
		// ── Google Fonts stylesheet ──────────────────────────────────────
		// The CSS is tiny and changes rarely; serve from cache immediately.
		{
			urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
			handler: "CacheFirst",
			options: {
				cacheName: "google-fonts-stylesheets",
				expiration: {
					maxEntries: 4,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
			},
		},

		// ── Google Fonts binary assets ───────────────────────────────────
		// Fonts are immutable; cache them permanently (up to 10 files).
		{
			urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
			handler: "CacheFirst",
			options: {
				cacheName: "google-fonts-webfonts",
				expiration: {
					maxEntries: 10,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
			},
		},

		// ── Local webfonts (IRANSans, etc.) ─────────────────────────────
		// Self-hosted fonts are served with long-lived headers; cache them
		// for a year to make repeat visits instant.
		{
			urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
			handler: "CacheFirst",
			options: {
				cacheName: "static-font-assets",
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
				},
			},
		},

		// ── Images ──────────────────────────────────────────────────────
		// Icons, splash screens, and other images rarely change.
		{
			urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
			handler: "CacheFirst",
			options: {
				cacheName: "static-image-assets",
				expiration: {
					maxEntries: 128,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
				},
			},
		},

		// ── Next.js image optimisation endpoint ─────────────────────────
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

		// ── JS bundles ──────────────────────────────────────────────────
		// Serve the cached version instantly and update in the background.
		// Content-hashed filenames mean a new deploy gets new URLs anyway.
		{
			urlPattern: /\.(?:js)$/i,
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "static-js-assets",
				expiration: {
					maxEntries: 64,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},

		// ── CSS ──────────────────────────────────────────────────────────
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

		// ── Next.js data prefetch payloads (_next/data) ──────────────────
		// These are short-lived and should be refreshed frequently.
		{
			urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
			handler: "NetworkFirst",
			options: {
				cacheName: "next-data",
				networkTimeoutSeconds: 5,
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},

		// ── Markdown content API (/api/content/…) ───────────────────────
		// Returns educational markdown that changes infrequently.
		// NetworkFirst with a short timeout keeps content fresh while still
		// serving cached copy offline.
		{
			urlPattern: /\/api\/content\/.*/i,
			handler: "NetworkFirst",
			method: "GET",
			options: {
				cacheName: "api-content",
				networkTimeoutSeconds: 8,
				expiration: {
					maxEntries: 16,
					maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
				},
			},
		},

		// ── Other API routes ─────────────────────────────────────────────
		// Default to NetworkFirst so responses are always fresh when online.
		// NOTE: Do NOT cache POST/PUT/DELETE — this rule is GET-only.
		{
			urlPattern: /\/api\/.*/i,
			handler: "NetworkFirst",
			method: "GET",
			options: {
				cacheName: "api-others",
				networkTimeoutSeconds: 10,
				expiration: {
					maxEntries: 16,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},

		// ── Navigation / HTML documents ──────────────────────────────────
		// NetworkFirst ensures the user always gets the freshest HTML when
		// online.  When offline, the SW falls back to whatever is in cache
		// (populated on previous visits), so the app shell still loads.
		{
			urlPattern: ({ url }: { url: URL }) =>
				!url.pathname.startsWith("/api/"),
			handler: "NetworkFirst",
			options: {
				cacheName: "pages",
				networkTimeoutSeconds: 5,
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},

		// ── Catch-all ────────────────────────────────────────────────────
		// Any request not matched above (static JSON, XML, misc assets).
		// NetworkFirst with a generous timeout.
		{
			urlPattern: /.*/i,
			handler: "NetworkFirst",
			options: {
				cacheName: "others",
				networkTimeoutSeconds: 10,
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 24 * 60 * 60, // 24 hours
				},
			},
		},
	],
})(nextConfig);

export default withNextIntl(configWithPWA);
