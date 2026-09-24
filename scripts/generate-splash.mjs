#!/usr/bin/env node
/**
 * Generates iOS `apple-touch-startup-image` PNGs into public/splash/.
 *
 *   pnpm generate-splash
 *
 * - Device list: src/lib/splash-devices.json (shared with the <head> tags in
 *   src/lib/splash.ts — keep the file naming below in sync with splashFile()).
 * - Background: manifest.json `background_color`, so the iOS splash, the
 *   Android splash and the app's dark `--background` token are one colour.
 * - Mark: the app icon, 128pt × device pixel ratio, centred, clipped to the
 *   iOS icon corner radius.
 */
import { readFile, readdir, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public/splash");
const ICON = path.join(ROOT, "public/icons/ios/1024.png");
const MARK_PT = 128;
/** iOS app-icon corner radius as a fraction of the tile size. */
const CORNER_RADIUS = 0.2237;
/** RGB distance under which a pixel counts as the baked-in corner colour. */
const CORNER_TOLERANCE = 24;

const readJson = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));

/**
 * If the icon has rounded corners baked onto a solid colour, flood-fill that
 * colour from the four corners and make it transparent. Edge pixels get a
 * partial alpha proportional to their distance from the corner colour, so the
 * rounded edge stays anti-aliased instead of leaving a halo.
 */
function knockOutCorners(data, width, height) {
	const at = (x, y) => (y * width + x) * 4;
	const c = at(0, 0);
	const [r0, g0, b0] = [data[c], data[c + 1], data[c + 2]];
	const dist = (i) => Math.hypot(data[i] - r0, data[i + 1] - g0, data[i + 2] - b0);

	// Baked corners = all four corners opaque and the same solid colour. A
	// full-bleed square tile (e.g. a gradient) fails this and is masked instead.
	const corners = [at(0, 0), at(width - 1, 0), at(0, height - 1), at(width - 1, height - 1)];
	const baked = corners.every((i) => data[i + 3] >= 250 && dist(i) <= CORNER_TOLERANCE);
	if (!baked) return false;
	const seen = new Uint8Array(width * height);
	const stack = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]];

	while (stack.length) {
		const [x, y] = stack.pop();
		if (x < 0 || y < 0 || x >= width || y >= height || seen[y * width + x]) continue;
		seen[y * width + x] = 1;
		const i = at(x, y);
		const d = dist(i);
		if (d <= CORNER_TOLERANCE) {
			data[i + 3] = 0;
			stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
		} else if (d <= CORNER_TOLERANCE * 3) {
			// Boundary: fade toward the corner colour instead of a hard cut.
			data[i + 3] = Math.round(data[i + 3] * ((d - CORNER_TOLERANCE) / (CORNER_TOLERANCE * 2)));
		}
	}
	return true;
}

async function buildMark() {
	// Drop the transparent safe-area padding so the tile itself is 128pt.
	const { data, info } = await sharp(ICON)
		.ensureAlpha()
		.trim({ threshold: 1 })
		.raw()
		.toBuffer({ resolveWithObject: true });

	const knocked = knockOutCorners(data, info.width, info.height);
	const size = Math.min(info.width, info.height);
	const r = Math.round(size * CORNER_RADIUS);
	const mask = Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}"><rect width="${info.width}" height="${info.height}" rx="${r}" ry="${r}"/></svg>`,
	);

	const raw = sharp(data, { raw: info });
	const mark = await (knocked ? raw : raw.composite([{ input: mask, blend: "dest-in" }]))
		.png()
		.toBuffer();
	return { mark, knocked };
}

async function main() {
	const [devices, manifest] = await Promise.all([
		readJson("src/lib/splash-devices.json"),
		readJson("public/manifest.json"),
	]);
	const background = manifest.background_color;
	if (!/^#[0-9a-f]{6}$/i.test(background ?? "")) {
		throw new Error(`manifest.background_color must be a #rrggbb hex, got ${background}`);
	}

	await mkdir(OUT_DIR, { recursive: true });
	const stale = (await readdir(OUT_DIR)).filter((f) => /^splash-.*\.png$/.test(f));
	await Promise.all(stale.map((f) => unlink(path.join(OUT_DIR, f))));

	const { mark, knocked } = await buildMark();

	const jobs = devices.flatMap(({ width, height, ratio }) => {
		const pw = width * ratio;
		const ph = height * ratio;
		return [
			[pw, ph],
			[ph, pw],
		].map(([w, h]) => ({ w, h, markPx: MARK_PT * ratio }));
	});

	const names = new Set();
	for (const { w, h } of jobs) {
		const name = `splash-${w}x${h}.png`;
		if (names.has(name)) throw new Error(`Duplicate splash size ${name}`);
		names.add(name);
	}

	await Promise.all(
		jobs.map(async ({ w, h, markPx }) => {
			const resized = await sharp(mark)
				.resize(markPx, markPx, { fit: "contain", background: "#0000", kernel: "lanczos3" })
				.toBuffer();
			await sharp({ create: { width: w, height: h, channels: 3, background } })
				.composite([
					{ input: resized, left: Math.round((w - markPx) / 2), top: Math.round((h - markPx) / 2) },
				])
				.removeAlpha()
				.png({ compressionLevel: 9, palette: false })
				.toFile(path.join(OUT_DIR, `splash-${w}x${h}.png`));
		}),
	);

	console.log(
		`generate-splash: ${jobs.length} images on ${background}` +
			` (removed ${stale.length} stale; corners ${knocked ? "knocked out" : "masked"})`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
