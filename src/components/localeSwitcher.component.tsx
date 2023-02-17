import { Select, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
	const { locales, locale, push, reload, pathname } = useRouter();
	const bgSelect = useColorModeValue("gray.200", "gray.700");
	const bgSelectHover = useColorModeValue("gray.300", "gray.600");

	const onClick = async (e: string) => {
		await push(pathname, pathname, { locale: e });
		reload();
	};

	if (locales && locales?.length > 0) {
		return (
			<>
				<Select
					userSelect={"none"}
					variant={"filled"}
					bg={bgSelect}
					_hover={{ bg: bgSelectHover }}
					id="lang"
					defaultValue={locale}
					onChange={(e) => onClick(e.target.value)}
				>
					{locales.map((_locale) => (
						<option key={_locale} value={_locale}>
							{dictFlags[_locale].slug}
						</option>
					))}
				</Select>
			</>
		);
	} else {
		return null;
	}
}
