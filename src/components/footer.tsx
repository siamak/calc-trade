import { Text, useColorModeValue } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./localeSwitcher.component";
import ThemeSwitcher from "./themeSwitcher.component";

export default function Footer() {
	const t = useTranslations("footer");
	const linkColor = useColorModeValue("purple.500", "purple.300");

	return (
		<footer>
			<LocaleSwitcher />
			<ThemeSwitcher />

			<Text textAlign={"center"} color={"gray.500"} mt={4} fontStyle="italic">
				{t("disclaimer")}
			</Text>

			<Text textAlign={"center"} color={"gray.500"} my={3}>
				{t("copyright.text")}{" "}
				<Text
					as="a"
					fontWeight={500}
					color={linkColor}
					_hover={{ color: "gray.500" }}
					target="_blank"
					href="https://m.siamak.me/"
				>
					{t("copyright.name")}
				</Text>
				.
			</Text>
		</footer>
	);
}
