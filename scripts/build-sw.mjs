// Generates public/sw.js with Workbox after `next build`.
//
// Replaces next-pwa, which only works as a webpack plugin. Running Workbox as a
// post-build step decouples the service worker from the bundler, so the app can
// build with Turbopack.
//
// Key decisions:
//  • generateSW — no custom fetch logic; Workbox strategies cover everything.
//  • skipWaiting: false — new SWs wait until the user confirms the update.
//    PWAProvider posts { type: "SKIP_WAITING" }, which generateSW handles.
//  • Precache: hashed Next static assets, fonts and the manifest. Icons and
//    iOS splash screens (~18 MB) are left to the runtime image cache.

import { generateSW } from "workbox-build";

const ONE_DAY = 24 * 60 * 60;
const ONE_YEAR = 365 * ONE_DAY;

const { count, size, warnings } = await generateSW({
	swDest: "public/sw.js",
	inlineWorkboxRuntime: true,
	mode: "production",
	sourcemap: false,

	skipWaiting: false,
	clientsClaim: true,
	cleanupOutdatedCaches: true,

	globDirectory: ".",
	globPatterns: [
		".next/static/**/*.{js,css,woff,woff2,png,jpg,jpeg,svg,ico,webp,avif}",
		"public/**/*.{json,png,ico,svg,woff,woff2}",
	],
	globIgnores: [
		"public/sw.js",
		"public/sw-custom.js",
		"public/workbox-*.js",
		"public/icons/**",
		"public/splash/**",
	],
	modifyURLPrefix: {
		".next/static/": "/_next/static/",
		"public/": "/",
	},
	// Content-hashed Next assets don't need a revision hash.
	dontCacheBustURLsMatching: /^\/_next\/static\//,
	maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

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
					maxAgeSeconds: ONE_YEAR,
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
					maxAgeSeconds: ONE_YEAR,
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
					maxAgeSeconds: ONE_YEAR,
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
					maxAgeSeconds: 30 * ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
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
					maxAgeSeconds: 7 * ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
				},
			},
		},

		// ── Navigation / HTML documents ──────────────────────────────────
		// NetworkFirst ensures the user always gets the freshest HTML when
		// online.  When offline, the SW falls back to whatever is in cache
		// (populated on previous visits), so the app shell still loads.
		{
			urlPattern: ({ url }) =>
				!url.pathname.startsWith("/api/"),
			handler: "NetworkFirst",
			options: {
				cacheName: "pages",
				networkTimeoutSeconds: 5,
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: ONE_DAY,
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
					maxAgeSeconds: ONE_DAY,
				},
			},
		},
	],
});

warnings.forEach((w) => console.warn(`[sw] ${w}`));
console.log(`[sw] public/sw.js — precached ${count} files (${(size / 1024).toFixed(0)} KiB)`);
