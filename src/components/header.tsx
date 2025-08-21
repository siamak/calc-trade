"use client";

import { useTranslations } from "next-intl";
import LocaleSwitcher from "./locale-switcher";
import ThemeSwitcher from "./theme-switcher";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export default function Header() {
	const t = useTranslations("header");
	return (
		<>
			<div className="flex items-center justify-between space-x-4 flex-col md:flex-row">
				<div className="flex items-center gap-2">
					<h1 className="text-2xl font-semibold flex-auto">{t("heading")}</h1>
					<Badge variant="outline" className="-mb-1">
						V2
					</Badge>
				</div>

				<div className="flex items-center justify-between flex-none gap-2">
					<LocaleSwitcher />
					<ThemeSwitcher />
					<div
						id="header-portal-actions"
						className="empty:hidden"
						aria-hidden
					/>
				</div>
			</div>
		</>
	);
}

export function HeaderPortal({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const portalActions = document.getElementById("header-portal-actions");
	if (!portalActions) return null;

	return createPortal(children, portalActions) as React.ReactPortal;
}
