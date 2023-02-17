import React from "react";
import {
	Box,
	useColorModeValue,
	Heading,
	Text,
	Button,
	HStack,
} from "@chakra-ui/react";
import Image from "next/image";

export default function TelegramMobile() {
	const brColor = useColorModeValue("#4a8fcd", "#75cbef");
	const fontColor = useColorModeValue("gray.800", "gray.100");
	const logo = useColorModeValue("/moneify-light.png", "/moneify.png");

	return (
		<Box
			position={"relative"}
			display={"flex"}
			color={fontColor}
			flexDirection={"column"}
			alignItems={"flex-start"}
			mt={4}
			border="1px solid"
			borderColor={brColor}
			p={[4, 8]}
			bg="boxBg"
			boxShadow={
				"0px 11.3px 10px -62px rgba(0, 0, 0, 0.053), 0px 90px 80px -62px rgba(0, 0, 0, 0.11)"
			}
			borderRadius={8}
		>
			<HStack justifyItems={"center"}>
				<Image
					alt="مرجع قیمت تتر در ایران"
					src={logo}
					objectPosition="right"
					width={72}
					height={72}
				/>

				<Box>
					<Heading mt={-3} size={"md"} mb={2}>
						مرجع قیمت تتر در ایران
					</Heading>
					<Text opacity={0.5}>💵 قصد خرید یا فروش تتر دارید؟</Text>
				</Box>
			</HStack>

			<Button
				as="a"
				href="https://t.me/+UTSJBK_CmZszYzRk"
				target={"_blank"}
				mt={0}
				rounded={"20px"}
				colorScheme={"blue"}
			>
				کانال تلگرام
			</Button>
		</Box>
	);
}
