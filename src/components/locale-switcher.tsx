"use client";

import { useParams } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { redirect } from "@/i18n/navigation";

const dictFlags: any = {
	fa: {
		emoji: "🇮🇷",
		text: "فارسی",
		slug: "فارسی",
	},
	en: {
		emoji: "🇺🇸",
		text: "English",
		slug: "English",
	},
};

export default function LocaleSwitcher() {
	const params = useParams();
	const locale = params.locale as string;
	const locales = ["en", "fa"];

	const onClick = async (value: string) => {
		redirect({ href: `/`, locale: value });
	};

	if (locales && locales?.length > 0) {
		return (
			<Select value={locale} onValueChange={onClick}>
				<SelectTrigger className="w-[100px] bg-card">
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
