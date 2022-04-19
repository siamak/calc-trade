import { Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./localeSwitcher.component";

export default function Footer() {
	const t = useTranslations("footer");
	return (
		<footer>
			<LocaleSwitcher />

			<Text textAlign={"center"} color="gray.500" mt={4} fontStyle="italic">
				{t("disclaimer")}
			</Text>

			<Text textAlign={"center"} color="gray.700" mt={2}>
				{t("copyright.text")}{" "}
				<Text
					as="a"
					fontWeight={500}
					color={"purple.500"}
					_hover={{ color: "gray.700" }}
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
