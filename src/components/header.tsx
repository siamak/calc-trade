import { Heading, HStack, Box } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./localeSwitcher.component";
import ThemeSwitcher from "./themeSwitcher.component";

export default function Header() {
	const t = useTranslations("header");

	return (
		<Box mt={6} mb={8}>
			<HStack
				alignItems={"center"}
				spacing={4}
				justifyContent={"space-between"}
				flexDirection={["column", "row"]}
			>
				<Heading size="lg" flex={"auto"} mb={[4, 0]}>
					{t("heading")}
				</Heading>
				<HStack
					alignItems={"center"}
					flex={"none"}
					justifyContent={"space-between"}
				>
					<LocaleSwitcher />
					<ThemeSwitcher />
				</HStack>
			</HStack>
		</Box>
	);
}
