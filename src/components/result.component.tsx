import {
	Text,
	Divider,
	HStack,
	VStack,
	useToast,
	useClipboard,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import React, { memo, useEffect } from "react";

interface IProps {
	riskCapital: number;
	marginSize: number;
}

const Result: React.FC<IProps> = ({ riskCapital, marginSize }: IProps) => {
	const t = useTranslations("result");
	const toast = useToast();
	const { hasCopied, onCopy } = useClipboard(`${marginSize}`);

	useEffect(() => {
		if (hasCopied) {
			toast({
				title: t("clipboard.title"),
				description: `$${marginSize} ${t("clipboard.description")}`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		}
	}, [hasCopied, toast, t, marginSize]);

	return (
		<VStack
			spacing={4}
			alignItems="flex-start"
			my={4}
			p={[4, 8]}
			bg="white"
			boxShadow={"lg"}
			borderRadius={8}
		>
			<HStack flex={1} width="100%" justifyContent={"space-between"}>
				<HStack spacing={4}>
					<svg
						version="1.1"
						width={40}
						height={40}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill="#f21313">
							<path
								opacity=".30"
								d="M21.7605 15.92l-6.4-11.52c-.86-1.55-2.05-2.4-3.36-2.4 -1.31 0-2.50003.85-3.36003 2.4l-6.4 11.52c-.81 1.47-.9 2.88-.25 3.99 .65 1.11 1.93 1.72 3.61 1.72h12.8c1.68 0 2.96-.61 3.61-1.72 .65-1.11.56-2.53-.25-3.99Z"
							/>
							<path d="M12 14.75c-.41 0-.75-.34-.75-.75v-5c0-.41.34-.75.75-.75 .41 0 .75.34.75.75v5c0 .41-.34.75-.75.75Z" />
							<path d="M12 18.0001c-.06 0-.13-.01-.2-.02 -.06-.01-.12-.03-.18-.06 -.06-.02-.12-.05-.18-.09 -.05-.04-.1-.08-.15-.12 -.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71 .05-.04.1-.08.15-.12 .06-.04.12-.07.18-.09 .06-.03.12-.05.18-.06 .13-.03.27-.03.39 0 .07.01.13.03.19.06 .06.02.12.05.18.09 .05.04.1.08.15.12 .18.19.29.45.29.71 0 .26-.11.52-.29.71 -.05.04-.1.08-.15.12 -.06.04-.12.07-.18.09 -.06.03-.12.05-.19.06 -.06.01-.13.02-.19.02Z" />
						</g>
					</svg>

					<VStack alignItems="flex-start" spacing={0}>
						<Text fontSize="md" fontWeight={500}>
							{t("riskedCaptial.label")}
						</Text>

						<Text fontSize="xs" opacity={0.6} maxW={"290px"}>
							{t("riskedCaptial.subtitle")}
						</Text>
					</VStack>
				</HStack>
				<Text
					fontSize="large"
					color="gray.700"
					fontWeight={"bold"}
					lineHeight={1}
				>
					{new Intl.NumberFormat("en-US", {
						style: "currency",
						currency: "USD",
					}).format(riskCapital)}
				</Text>
			</HStack>

			<Divider />

			<HStack flex={1} width="100%" justifyContent={"space-between"}>
				<HStack spacing={4}>
					<svg
						version="1.1"
						viewBox="0 0 24 24"
						width={40}
						height={40}
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill="#009980">
							<path
								opacity=".40"
								d="M17 7.75c-.19 0-.38-.07-.53-.22 -.29-.29-.29-.77 0-1.06l2.05-2.05c-1.76-1.5-4.03-2.42-6.52-2.42 -5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-2.49-.92-4.76-2.42-6.52l-2.05 2.05c-.15.15-.34.22-.53.22Z"
							/>
							<path d="M13.75 11.82l-1-.35v-2.22h.08c.51 0 .92.45.92 1 0 .41.34.75.75.75 .41 0 .75-.34.75-.75 0-1.38-1.08-2.5-2.42-2.5h-.08v-.25c0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75v.25h-.3c-1.20999 0-2.2 1.02-2.2 2.28 0 1.46.85 1.93 1.5 2.16l1 .35v2.22h-.08c-.51 0-.92-.45-.92-1 0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75 0 1.38 1.08001 2.5 2.42 2.5h.08v.25c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-.25h.3c1.21 0 2.2-1.02 2.2-2.28 0-1.47-.85-1.94-1.5-2.16Zm-3.01-1.06c-.34-.12-.49-.19-.49-.74 0-.43.32-.78.7-.78h.3v1.69l-.51-.17Zm2.31 3.99h-.3v-1.69l.51.18c.34.12.49.19.49.74 0 .42-.32.77-.7.77Z" />
							<path d="M22.6902 1.71024c-.08-.18-.22-.33-.41-.41 -.09-.04-.19-.06001-.29-.06001h-4c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h2.19l-1.6699 1.67001c.38.33.73.68 1.06 1.06l1.6699-1.67v2.2c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-4c.01-.1-.01-.19-.05-.29Z" />
						</g>
					</svg>

					<VStack alignItems="flex-start" spacing={0}>
						<Text fontSize="md" fontWeight={500}>
							{t("margin.label")}
						</Text>

						<Text fontSize="xs" opacity={0.6} maxW={"290px"}>
							{t("margin.subtitle")}
						</Text>
					</VStack>
				</HStack>

				<HStack
					onClick={onCopy}
					cursor="pointer"
					spacing={1}
					transition="0.1s opacity"
					_hover={{
						opacity: 0.75,
					}}
					_active={{
						opacity: 0.5,
					}}
					userSelect="none"
				>
					<Text
						fontSize="large"
						color="gray.700"
						fontWeight={"bold"}
						lineHeight={1}
					>
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(marginSize)}
					</Text>

					<svg
						version="1.1"
						viewBox="0 0 24 24"
						width={20}
						height={20}
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill="#666c6f">
							<path d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9h-4.2c-3.5 0-4.9-1.4-4.9-4.9v-4.2c0-3.5 1.4-4.9 4.9-4.9h4.2c3.5 0 4.9 1.4 4.9 4.9Z" />
							<path
								opacity=".40"
								d="M17.0998 2h-4.2c-3.45004 0-4.85003 1.37-4.89003 4.75h3.09003c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89v-4.2c0-3.5-1.4-4.9-4.9-4.9Z"
							/>
						</g>
					</svg>
				</HStack>
			</HStack>
		</VStack>
	);
};

export default memo(Result);
