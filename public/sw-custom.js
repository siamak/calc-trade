// Custom Service Worker for Calc Trade PWA
const CACHE_NAME = "calc-trade-v1";
const STATIC_CACHE = "calc-trade-static-v1";
const DYNAMIC_CACHE = "calc-trade-dynamic-v1";

// Files to cache immediately
const STATIC_FILES = [
	"/",
	"/manifest.json",
	"/favicon.ico",
	"/icon.png",
	"/apple-touch-icon.png",
	"/icons/android/android-launchericon-192-192.png",
	"/icons/android/android-launchericon-512-512.png",
	"/webfont/IRANSansXV.woff2",
	"/webfont/IRANSansXV.woff",
	"/webfont/staticfonts/IRANSansX-Regular.woff",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				return cache.addAll(STATIC_FILES);
			})
			.then(() => {
				return self.skipWaiting();
			})
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				return self.clients.claim();
			})
	);
});

// Fetch event - handle different caching strategies
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	// Handle different types of requests
	if (url.pathname === "/") {
		// Homepage - Network First with fallback to cache
		event.respondWith(networkFirst(request, DYNAMIC_CACHE));
	} else if (url.pathname.startsWith("/api/")) {
		// API requests - Network First with fallback to cache
		event.respondWith(networkFirst(request, DYNAMIC_CACHE));
	} else if (isStaticAsset(url.pathname)) {
		// Static assets - Cache First with fallback to network
		event.respondWith(cacheFirst(request, STATIC_CACHE));
	} else {
		// Other requests - Network First with fallback to cache
		event.respondWith(networkFirst(request, DYNAMIC_CACHE));
	}
});

// Network First strategy
async function networkFirst(request, cacheName) {
	try {
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}
		return networkResponse;
	} catch (error) {
		const cachedResponse = await caches.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}
		throw error;
	}
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
	const cachedResponse = await caches.match(request);
	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}
		return networkResponse;
	} catch (error) {
		// Return a fallback response for critical assets
		if (request.url.includes("manifest.json")) {
			return new Response(
				JSON.stringify({
					name: "Calc Trade",
					short_name: "Calc Trade",
					description: "Calculate the size of your trade position",
					start_url: "/",
					display: "standalone",
					theme_color: "#FFFFFF",
					background_color: "#FFFFFF",
				}),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
		}
		throw error;
	}
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
	const staticExtensions = [
		".js",
		".css",
		".png",
		".jpg",
		".jpeg",
		".gif",
		".svg",
		".ico",
		".woff",
		".woff2",
	];
	return staticExtensions.some((ext) => pathname.endsWith(ext));
}

// ─── Background sync ─────────────────────────────────────────────────────────

self.addEventListener("sync", (event) => {
	if (event.tag === "background-sync") {
		event.waitUntil(doBackgroundSync());
	}

	// When the app queues analytics while offline it registers this tag.
	// On reconnect the browser fires this sync event even if the tab is hidden,
	// so we notify all open clients to flush their localStorage queue.
	if (event.tag === "umami-analytics-flush") {
		event.waitUntil(notifyClientsToFlushAnalytics());
	}
});

async function doBackgroundSync() {
	console.log("Background sync triggered");
}

async function notifyClientsToFlushAnalytics() {
	const clients = await self.clients.matchAll({ type: "window" });
	for (const client of clients) {
		client.postMessage({ type: "UMAMI_FLUSH_QUEUE" });
	}
}

// ─── SW update messaging ──────────────────────────────────────────────────────

// Allow the page to trigger an immediate SW takeover after an update is
// detected (used by usePWA → checkForUpdates → registration.waiting.postMessage)
self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

// Push notification handling
self.addEventListener("push", (event) => {
	const options = {
		body: event.data ? event.data.text() : "New update available!",
		icon: "/icons/android/android-launchericon-192-192.png",
		badge: "/icons/android/android-launchericon-96-96.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
		actions: [
			{
				action: "explore",
				title: "Open App",
				icon: "/icons/android/android-launchericon-96-96.png",
			},
			{
				action: "close",
				title: "Close",
				icon: "/icons/android/android-launchericon-96-96.png",
			},
		],
	};

	event.waitUntil(self.registration.showNotification("Calc Trade", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	if (event.action === "explore") {
		event.waitUntil(clients.openWindow("/"));
	}
});

