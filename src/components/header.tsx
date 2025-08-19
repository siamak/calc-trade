"use client";

import { useTranslations } from "next-intl";
import LocaleSwitcher from "./localeSwitcher.component";
import ThemeSwitcher from "./themeSwitcher.component";

export default function Header() {
	const t = useTranslations("header");
	return (
		<div className="mt-6 mb-8">
			<div className="flex items-center justify-between space-x-4 flex-col md:flex-row">
				<h1 className="text-2xl font-semibold flex-auto mb-4 md:mb-0">
					{t("heading")}
				</h1>
				<div className="flex items-center justify-between flex-none space-x-4">
					<LocaleSwitcher />
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	);
}
