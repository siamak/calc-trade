import devices from "./splash-devices.json";

export type SplashDevice = (typeof devices)[number];
export type SplashOrientation = "portrait" | "landscape";

export const SPLASH_DIR = "/splash";

/** Pixel size of the image iOS expects for a device + orientation. */
export function splashSize(d: SplashDevice, orientation: SplashOrientation) {
	const w = d.width * d.ratio;
	const h = d.height * d.ratio;
	return orientation === "portrait" ? { w, h } : { w: h, h: w };
}

export function splashFile(d: SplashDevice, orientation: SplashOrientation) {
	const { w, h } = splashSize(d, orientation);
	return `splash-${w}x${h}.png`;
}

export function splashMedia(d: SplashDevice, orientation: SplashOrientation) {
	return `(device-width: ${d.width}px) and (device-height: ${d.height}px) and (-webkit-device-pixel-ratio: ${d.ratio}) and (orientation: ${orientation})`;
}

const ORIENTATIONS: SplashOrientation[] = ["portrait", "landscape"];

/** `metadata.appleWebApp.startupImage` — one entry per device × orientation. */
export const appleStartupImages = devices.flatMap((d) =>
	ORIENTATIONS.map((o) => ({
		url: `${SPLASH_DIR}/${splashFile(d, o)}`,
		media: splashMedia(d, o),
	})),
);

/**
 * Next 15+ `appleWebApp.capable` only emits the unprefixed
 * `mobile-web-app-capable`; iOS still needs the prefixed tag for splash.
 */
export const appleCapableMeta = { "apple-mobile-web-app-capable": "yes" };

export { devices as splashDevices };
