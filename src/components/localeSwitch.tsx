import { Divider, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const dictFlags: any = {
	fa: {
		emoji: "🇮🇷",
		text: "Persian",
	},
	en: {
		emoji: "🇺🇸",
		text: "English",
	},
};
export default function LocaleSwitcher() {
	const t = useTranslations("footer");
	const { locales, locale, push, reload, pathname } = useRouter();

	const onClick = async (e: string) => {
		await push(pathname, pathname, { locale: e });
		reload();
	};

	if (locales && locales?.length > 0) {
		return (
			<>
				<FormControl mt={6} mb={4} d="flex" alignItems={"center"}>
					<FormLabel w={"50%"} htmlFor="lang" mb={0}>
						{t("lang")}
					</FormLabel>
					<Select
						userSelect={"none"}
						variant={"filled"}
						bg="gray.200"
						_hover={{ bg: "gray.300" }}
						id="lang"
						defaultValue={locale}
						onChange={(e) => onClick(e.target.value)}
					>
						{locales.map((_locale) => (
							<option key={_locale} value={_locale}>
								{dictFlags[_locale].emoji} {dictFlags[_locale].text}
							</option>
						))}
					</Select>
				</FormControl>
				<Divider />
			</>
		);
	} else {
		return null;
	}
}
