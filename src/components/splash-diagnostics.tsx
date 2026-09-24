"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type Report = {
	screen: string;
	standalone: boolean;
	linkCount: number;
	match: string | null;
	/** Actual pixel size of the matched image, once it has loaded. */
	matchSize: string | null;
	expectedSize: string;
	userAgent: string;
};

function isAppleMobile() {
	const { userAgent, platform, maxTouchPoints } = navigator;
	// iPadOS 13+ reports itself as a Mac; touch points give it away.
	return /iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
}

function readReport(): Report {
	const { width, height } = window.screen;
	const dpr = window.devicePixelRatio;
	const landscape = window.matchMedia("(orientation: landscape)").matches;
	const links = Array.from(
		document.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-startup-image"]'),
	);
	const match = links.find((l) => l.media && window.matchMedia(l.media).matches);
	const [w, h] = [width * dpr, height * dpr].map(Math.round);

	return {
		screen: `${width}×${height} @${dpr}`,
		standalone:
			window.matchMedia("(display-mode: standalone)").matches ||
			(navigator as Navigator & { standalone?: boolean }).standalone === true,
		linkCount: links.length,
		match: match?.getAttribute("href") ?? null,
		matchSize: null,
		expectedSize: landscape ? `${Math.max(w, h)}×${Math.min(w, h)}` : `${Math.min(w, h)}×${Math.max(w, h)}`,
		userAgent: navigator.userAgent,
	};
}

function formatReport(r: Report) {
	return [
		`screen: ${r.screen}`,
		`standalone: ${r.standalone ? "yes" : "no"}`,
		`startup-image links: ${r.linkCount}`,
		`matched: ${r.match ?? "NONE"}`,
		`image size: ${r.matchSize ?? "—"} (expected ${r.expectedSize})`,
		`ua: ${r.userAgent}`,
	].join("\n");
}

/**
 * iOS splash readout: which `apple-touch-startup-image` matches this device.
 * Only rendered on iPhone / iPad, since the splash is iOS-only and there is
 * no other way to debug it on a phone without a Mac.
 */
export function SplashDiagnostics() {
	const [report, setReport] = useState<Report | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!isAppleMobile()) return;
		const update = () => setReport(readReport());
		update();
		const mq = window.matchMedia("(orientation: landscape)");
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	const match = report?.match;
	useEffect(() => {
		if (!match) return;
		const img = new Image();
		img.onload = () =>
			setReport((r) => r && { ...r, matchSize: `${img.naturalWidth}×${img.naturalHeight}` });
		img.src = match;
	}, [match]);

	if (!report) return null;

	const ok = report.match !== null && report.matchSize === report.expectedSize;
	const copy = async () => {
		await navigator.clipboard.writeText(formatReport(report));
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<details className="group mb-4 rounded-lg border border-border/40 text-sm">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-muted-foreground">
				<span>Splash screen diagnostics</span>
				<span className={ok ? "text-emerald-500" : "text-amber-500"}>
					{ok ? "Matched" : report.match ? "Size mismatch" : "No match"}
				</span>
			</summary>
			<div className="flex flex-col gap-3 border-t border-border/40 px-4 py-3">
				<pre className="overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-muted-foreground">
					{formatReport(report)}
				</pre>
				<Button variant="outline" size="sm" className="self-start" onClick={copy}>
					{copied ? <Check /> : <Copy />}
					{copied ? "Copied" : "Copy report"}
				</Button>
			</div>
		</details>
	);
}
