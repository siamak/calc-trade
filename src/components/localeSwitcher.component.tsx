"use client";

import { useParams, useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const dictFlags: any = {
	fa: {
		emoji: "🇮🇷",
		text: "فارسی",
		slug: "Fa - فا",
	},
	en: {
		emoji: "🇺🇸",
		text: "English",
		slug: "En",
	},
};

export default function LocaleSwitcher() {
	const params = useParams();
	const router = useRouter();
	const locale = params.locale as string;
	const locales = ["en", "fa"];

	const onClick = async (value: string) => {
		const currentPath = window.location.pathname;
		const newPath = currentPath.replace(`/${locale}`, `/${value}`);
		router.push(newPath);
		window.location.reload();
	};

	if (locales && locales?.length > 0) {
		return (
			<Select value={locale} onValueChange={onClick}>
				<SelectTrigger className="w-[120px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{locales.map((_locale) => (
						<SelectItem key={_locale} value={_locale}>
							{dictFlags[_locale].slug}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	} else {
		return null;
	}
}
