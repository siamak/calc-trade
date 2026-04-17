"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function HeaderPortal({ children }: { children: React.ReactNode }) {
	const [target, setTarget] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const resolveTarget = () => {
			const el = document.getElementById("header-portal-actions");
			if (!el) return false;
			if (el.dataset.portalReady !== "true") return false;
			setTarget(el);
			return true;
		};

		if (resolveTarget()) return;

		const intervalId = window.setInterval(() => {
			if (resolveTarget()) {
				window.clearInterval(intervalId);
			}
		}, 50);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	if (!target) return null;

	return createPortal(children, target) as React.ReactPortal;
}
