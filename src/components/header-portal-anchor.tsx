"use client";

import { useEffect, useState } from "react";

export function HeaderPortalAnchor() {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	return (
		<div
			id="header-portal-actions"
			className="empty:hidden"
			data-portal-ready={isReady ? "true" : "false"}
		/>
	);
}
