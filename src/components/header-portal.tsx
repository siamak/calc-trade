"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function HeaderPortal({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const el = document.getElementById("header-portal-actions");
	if (!el) return null;

	return createPortal(children, el) as React.ReactPortal;
}
