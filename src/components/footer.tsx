import { Center, Text, useColorModeValue } from "@chakra-ui/react";
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

			<Center my={5}>
				<iframe
					src="https://ghbtns.com/github-btn.html?user=siamak&repo=calc-trade&type=star&count=true&size=large"
					frameBorder="0"
					scrolling="0"
					width="120"
					height="30"
					title="GitHub"
				></iframe>
			</Center>
		</footer>
	);
}
