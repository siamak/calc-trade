import {
	ScaleFade,
	Box,
	useColorModeValue,
	useDisclosure,
	Heading,
	Text,
	Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect } from "react";

export default function TelegramCTA() {
	const bgColor = useColorModeValue("gray.200", "#22222E");
	const fontColor = useColorModeValue("gray.800", "gray.100");
	const btnBgColor = useColorModeValue("blackAlpha.300", "whiteAlpha.100");
	const btnColor = useColorModeValue("blackAlpha.600", "whiteAlpha.700");
	const btnHoverColor = useColorModeValue("blackAlpha.400", "whiteAlpha.300");
	const logo = useColorModeValue("/moneify-light.png", "/moneify.png");
	const { isOpen, onToggle } = useDisclosure();

	useEffect(() => {
		if (!isOpen) {
			onToggle();
		}
	}, []);

	return (
		<ScaleFade initialScale={0.8} in={isOpen}>
			<Box
				position={"fixed"}
				left={[0, 4]}
				bottom={[0, 4]}
				right={[0, "auto"]}
				pt={[0, 6]}
				pb={[0, 8]}
				px={[4, 10]}
				display={["none", "flex"]}
				flexDirection={["row", "column"]}
				color={fontColor}
				bg={bgColor}
				rounded={[0, "2xl"]}
				shadow="lg"
				textAlign={["left", "center"]}
				zIndex={9}
			>
				<Box
					p={2}
					top={4}
					left={4}
					bg={btnBgColor}
					d="inline-flex"
					position="absolute"
					_hover={{
						bg: btnHoverColor,
					}}
					color={btnColor}
					zIndex={2}
					borderRadius={10}
					onClick={() => onToggle()}
					cursor={"pointer"}
				>
					<svg
						version="1.1"
						viewBox="0 0 24 24"
						width={"1.5em"}
						height={"1.5em"}
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<path
							d="M12 2c-5.51 0-10 4.49-10 10 0 5.51 4.49 10 10 10 5.51 0 10-4.49 10-10 0-5.51-4.49-10-10-10Zm3.36 12.3c.29.29.29.77 0 1.06 -.15.15-.34.22-.53.22 -.19 0-.38-.07-.53-.22l-2.3-2.3 -2.3 2.3c-.15.15-.34.22-.53.22 -.19 0-.38-.07-.53-.22 -.29-.29-.29-.77 0-1.06l2.3-2.3 -2.3-2.3c-.29-.29-.29-.77 0-1.06 .29-.29.77-.29 1.06 0l2.3 2.3 2.3-2.3c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.3 2.3 2.3 2.3Z"
							fill="currentColor"
						/>
					</svg>
				</Box>

				<Image
					alt="مرجع قیمت تتر در ایران"
					src={logo}
					width={180}
					height={190}
				/>

				<Box>
					<Heading size={"md"} mt={-8} mb={3}>
						مرجع قیمت تتر در ایران
					</Heading>
					<Text>💵 قصد خرید یا فروش تتر دارید؟</Text>
				</Box>
				<Button
					as="a"
					href="https://t.me/+UTSJBK_CmZszYzRk"
					target={"_blank"}
					mt={4}
					rounded={"20px"}
					w={["8rem", "auto"]}
					isFullWidth
					colorScheme={"blue"}
				>
					کانال تلگرام
				</Button>
			</Box>
		</ScaleFade>
	);
}
