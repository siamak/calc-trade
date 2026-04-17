import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./locale-switcher";
import ThemeSwitcher from "./theme-switcher";
import { Badge } from "./ui/badge";

export default async function Header() {
	const t = await getTranslations("header");

	return (
		<div className="flex items-center justify-between gap-4 flex-col md:flex-row">
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
				/>
			</div>
		</div>
	);
}
