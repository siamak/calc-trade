/**
 * sw-custom.js — DEPRECATED
 *
 * This file is kept at its original URL so that browsers with the old service
 * worker registration don't hit a 404.  Its only job now is to unregister
 * itself so that the Workbox-generated /sw.js can take sole control.
 *
 * The migration path for existing users:
 *   1. Browser fetches this updated sw-custom.js (byte-changed → triggers update).
 *   2. install fires → skipWaiting() so this SW activates immediately.
 *   3. activate fires → unregister() removes this SW registration from the browser.
 *   4. Next page load: /sw.js (registered by PWAProvider) becomes the active SW.
 */

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		self.registration
			.unregister()
			.then(() => self.clients.matchAll({ type: "window" }))
			.then((clients) => {
				// Reload each controlled tab so PWAProvider can register /sw.js.
				clients.forEach((client) => {
					if (client.url && "navigate" in client) {
						client.navigate(client.url);
					}
				});
			}),
	);
});
