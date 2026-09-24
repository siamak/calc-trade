// Kill-switch service worker for the legacy calc-trade.netlify.app origin.
// Replaces the old PWA worker, wipes its caches, unregisters, and sends open
// tabs to the same path on calc.siamak.pro.
const NEW_ORIGIN = "https://calc.siamak.pro";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((key) => caches.delete(key)));
			await self.registration.unregister();

			const clients = await self.clients.matchAll({ type: "window" });
			for (const client of clients) {
				const { pathname, search, hash } = new URL(client.url);
				client.navigate(NEW_ORIGIN + pathname + search + hash);
			}
		})(),
	);
});
