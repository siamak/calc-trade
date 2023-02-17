import React, { memo, useCallback } from "react";
import {
	Text,
	Divider,
	HStack,
	VStack,
	useToast,
	useColorModeValue,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import useCopyToClipboard from "hooks/useCopyToClipboard";

interface IProps {
	riskCapital: number;
	marginSize: number;
	balance: number;
	leverage: number;
	stoploss: number;
	sizeUSDT: number;
}

const Result: React.FC<IProps> = ({
	riskCapital,
	marginSize,
	balance,
	leverage,
	stoploss,
	sizeUSDT,
}: IProps) => {
	const t = useTranslations("result");
	const toast = useToast();
	const [_, saveClipboard] = useCopyToClipboard();
	const foreground = useColorModeValue("gray.700", "gray.100");
	const redColor = useColorModeValue("#f21313", "#ff7070");
	const blueColor = useColorModeValue("#1861ea", "#6299ff");
	const greenColor = useColorModeValue("#0AA586", "#78CEBD");
	const buttonColor = useColorModeValue("#666c6f", "#c1c8cc");

	const isImpossible = marginSize > balance;
	const willLiquidate = leverage * stoploss >= 92;

	const copy = useCallback(
		(text) => {
			saveClipboard(text);
			toast({
				title: t("clipboard.title"),
				description: `$${text} ${t("clipboard.description")}`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		},
		[t, toast, saveClipboard]
	);

	return (
		<VStack
			spacing={4}
			alignItems="flex-start"
			my={6}
			p={[4, 8]}
			bg="boxBg"
			boxShadow={
				"0px 11.3px 10px -62px rgba(0, 0, 0, 0.053), 0px 90px 80px -62px rgba(0, 0, 0, 0.11)"
			}
			borderRadius={8}
		>
			<HStack flex={1} width="100%" justifyContent={"space-between"}>
				<HStack
					spacing={[0, 4]}
					alignItems={["flex-start", "center"]}
					flexDirection={["column", "row"]}
				>
					<svg
						version="1.1"
						width={40}
						height={40}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill={redColor}>
							<path
								opacity=".30"
								d="M21.7605 15.92l-6.4-11.52c-.86-1.55-2.05-2.4-3.36-2.4 -1.31 0-2.50003.85-3.36003 2.4l-6.4 11.52c-.81 1.47-.9 2.88-.25 3.99 .65 1.11 1.93 1.72 3.61 1.72h12.8c1.68 0 2.96-.61 3.61-1.72 .65-1.11.56-2.53-.25-3.99Z"
							/>
							<path d="M12 14.75c-.41 0-.75-.34-.75-.75v-5c0-.41.34-.75.75-.75 .41 0 .75.34.75.75v5c0 .41-.34.75-.75.75Z" />
							<path d="M12 18.0001c-.06 0-.13-.01-.2-.02 -.06-.01-.12-.03-.18-.06 -.06-.02-.12-.05-.18-.09 -.05-.04-.1-.08-.15-.12 -.18-.19-.29-.45-.29-.71 0-.26.11-.52.29-.71 .05-.04.1-.08.15-.12 .06-.04.12-.07.18-.09 .06-.03.12-.05.18-.06 .13-.03.27-.03.39 0 .07.01.13.03.19.06 .06.02.12.05.18.09 .05.04.1.08.15.12 .18.19.29.45.29.71 0 .26-.11.52-.29.71 -.05.04-.1.08-.15.12 -.06.04-.12.07-.18.09 -.06.03-.12.05-.19.06 -.06.01-.13.02-.19.02Z" />
						</g>
					</svg>

					<VStack alignItems="flex-start" spacing={1}>
						<Text fontSize="md" fontWeight={500}>
							{t("riskedCaptial.label")}
						</Text>

						<Text fontSize="xs" opacity={0.6} maxW={"360px"}>
							{t("riskedCaptial.subtitle")}
						</Text>

						{willLiquidate && (
							<Text fontSize="xs" color="red.500" maxW={"360px"}>
								{t("riskedCaptial.error")}
							</Text>
						)}
					</VStack>
				</HStack>
				<Text
					fontSize="large"
					color={willLiquidate ? "red.500" : foreground}
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
				<HStack
					spacing={[0, 4]}
					alignItems={["flex-start", "center"]}
					flexDirection={["column", "row"]}
				>
					<svg
						version="1.1"
						viewBox="0 0 24 24"
						width={40}
						height={40}
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill={blueColor}>
							<path
								opacity=".40"
								d="M17 7.75c-.19 0-.38-.07-.53-.22 -.29-.29-.29-.77 0-1.06l2.05-2.05c-1.76-1.5-4.03-2.42-6.52-2.42 -5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-2.49-.92-4.76-2.42-6.52l-2.05 2.05c-.15.15-.34.22-.53.22Z"
							/>
							<path d="M13.75 11.82l-1-.35v-2.22h.08c.51 0 .92.45.92 1 0 .41.34.75.75.75 .41 0 .75-.34.75-.75 0-1.38-1.08-2.5-2.42-2.5h-.08v-.25c0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75v.25h-.3c-1.20999 0-2.2 1.02-2.2 2.28 0 1.46.85 1.93 1.5 2.16l1 .35v2.22h-.08c-.51 0-.92-.45-.92-1 0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75 0 1.38 1.08001 2.5 2.42 2.5h.08v.25c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-.25h.3c1.21 0 2.2-1.02 2.2-2.28 0-1.47-.85-1.94-1.5-2.16Zm-3.01-1.06c-.34-.12-.49-.19-.49-.74 0-.43.32-.78.7-.78h.3v1.69l-.51-.17Zm2.31 3.99h-.3v-1.69l.51.18c.34.12.49.19.49.74 0 .42-.32.77-.7.77Z" />
							<path d="M22.6902 1.71024c-.08-.18-.22-.33-.41-.41 -.09-.04-.19-.06001-.29-.06001h-4c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h2.19l-1.6699 1.67001c.38.33.73.68 1.06 1.06l1.6699-1.67v2.2c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-4c.01-.1-.01-.19-.05-.29Z" />
						</g>
					</svg>

					<VStack alignItems="flex-start" spacing={1}>
						<Text fontSize="md" fontWeight={500}>
							{t("margin.label")}
						</Text>

						<Text fontSize="xs" opacity={0.6} maxW={"360px"}>
							{t("margin.subtitle")}
						</Text>

						{isImpossible && (
							<Text fontSize="xs" color="red.500" maxW={"360px"}>
								{t("margin.error")}
							</Text>
						)}
					</VStack>
				</HStack>

				<HStack
					onClick={() => {
						copy(String(marginSize));
					}}
					cursor="pointer"
					spacing={1}
					transition="0.1s opacity"
					pointerEvents={isImpossible ? "none" : "auto"}
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
						color={isImpossible ? "red.500" : foreground}
						fontWeight={"bold"}
						lineHeight={1}
					>
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(marginSize)}
					</Text>

					{(isImpossible && (
						<svg
							version="1.1"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<g fill="#E53E3E">
								<path
									opacity=".40"
									d="M16.2391 3.65039h-8.48004c-2.47 0-4.47 2.01-4.47 4.47v9.41001c0 2.46 2.01 4.47 4.47 4.47h8.47004c2.47 0 4.47-2.01 4.47-4.47v-9.41001c.01-2.47-2-4.47-4.46-4.47Z"
								/>
								<path d="M14.3498 2h-4.70003c-1.04 0-1.89.84-1.89 1.88v.94c0 1.04.84 1.88 1.88 1.88h4.71003c1.04 0 1.88-.84 1.88-1.88v-.94c.01-1.04-.84-1.88-1.88-1.88Z" />
								<path d="M14.5295 15.6199l-1.45-1.45 1.4-1.4c.29-.29.29-.77 0-1.06 -.29-.29-.77-.29-1.06 0l-1.4 1.4 -1.45-1.45c-.29-.29-.77005-.29-1.06005 0 -.29.29-.29.77 0 1.06l1.45005 1.45 -1.49005 1.49c-.29.29-.29.77 0 1.06 .15.15.34.22.53.22 .19005 0 .38005-.07.53005-.22l1.49-1.49 1.45 1.45c.15.15.34.22.53.22 .19 0 .38-.07.53-.22 .29-.29.29-.76 0-1.06Z" />
							</g>
						</svg>
					)) || (
						<svg
							version="1.1"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<g fill={buttonColor}>
								<path d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9h-4.2c-3.5 0-4.9-1.4-4.9-4.9v-4.2c0-3.5 1.4-4.9 4.9-4.9h4.2c3.5 0 4.9 1.4 4.9 4.9Z" />
								<path
									opacity=".40"
									d="M17.0998 2h-4.2c-3.45004 0-4.85003 1.37-4.89003 4.75h3.09003c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89v-4.2c0-3.5-1.4-4.9-4.9-4.9Z"
								/>
							</g>
						</svg>
					)}
				</HStack>
			</HStack>

			<Divider />

			<HStack flex={1} width="100%" justifyContent={"space-between"}>
				<HStack
					spacing={[0, 4]}
					alignItems={["flex-start", "center"]}
					flexDirection={["column", "row"]}
				>
					<svg
						version="1.1"
						viewBox="0 0 24 24"
						width={40}
						height={40}
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g fill={greenColor}>
							<path
								opacity=".4"
								d="M19.3 7.91v5.15c0 3.08-1.76 4.4-4.4 4.4H6.11c-.45 0-.88-.04-1.28-.13 -.25-.04-.49-.11-.71-.19 -1.5-.56-2.41-1.86-2.41-4.08V7.9c0-3.08 1.75-4.4 4.39-4.4h8.78c2.24 0 3.85.94 4.28 3.11 .07.4.12.8.12 1.27Z"
							/>
							<path d="M22.3 10.92v5.15c0 3.08-1.76 4.4-4.4 4.4H9.1c-.74 0-1.41-.1-1.99-.32 -1.19-.44-2.01-1.35-2.3-2.81 .4.09.83.13 1.28.13h8.79c2.64 0 4.4-1.32 4.4-4.4V7.92c0-.47-.04-.89-.12-1.28 1.9.4 3.12 1.73 3.12 4.27Z" />
							<path d="M10.49 13.13c1.45 0 2.64-1.19 2.64-2.64 0-1.46-1.19-2.65-2.64-2.65 -1.46 0-2.65 1.18-2.65 2.64 0 1.45 1.18 2.64 2.64 2.64Z" />
							<path d="M4.77 8.25c-.41 0-.75.34-.75.75v3c0 .41.34.75.75.75s.75-.34.75-.75V9c0-.41-.33-.75-.75-.75Z" />
							<path d="M16.21 8.25c-.41 0-.75.34-.75.75v3c0 .41.34.75.75.75s.75-.34.75-.75V9c0-.41-.33-.75-.75-.75Z" />
						</g>
					</svg>

					<VStack alignItems="flex-start" spacing={1}>
						<Text fontSize="md" fontWeight={500}>
							{t("size.label")}
						</Text>

						<Text fontSize="xs" opacity={0.6} maxW={"360px"}>
							{t("size.subtitle")}
						</Text>

						{isImpossible && (
							<Text fontSize="xs" color="red.500" maxW={"360px"}>
								{t("size.error")}
							</Text>
						)}
					</VStack>
				</HStack>

				<HStack
					onClick={() => {
						copy(String(sizeUSDT));
					}}
					cursor="pointer"
					spacing={1}
					transition="0.1s opacity"
					pointerEvents={isImpossible ? "none" : "auto"}
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
						color={isImpossible ? "red.500" : foreground}
						fontWeight={"bold"}
						lineHeight={1}
					>
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(sizeUSDT)}
					</Text>

					{(isImpossible && (
						<svg
							version="1.1"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<g fill="#E53E3E">
								<path
									opacity=".40"
									d="M16.2391 3.65039h-8.48004c-2.47 0-4.47 2.01-4.47 4.47v9.41001c0 2.46 2.01 4.47 4.47 4.47h8.47004c2.47 0 4.47-2.01 4.47-4.47v-9.41001c.01-2.47-2-4.47-4.46-4.47Z"
								/>
								<path d="M14.3498 2h-4.70003c-1.04 0-1.89.84-1.89 1.88v.94c0 1.04.84 1.88 1.88 1.88h4.71003c1.04 0 1.88-.84 1.88-1.88v-.94c.01-1.04-.84-1.88-1.88-1.88Z" />
								<path d="M14.5295 15.6199l-1.45-1.45 1.4-1.4c.29-.29.29-.77 0-1.06 -.29-.29-.77-.29-1.06 0l-1.4 1.4 -1.45-1.45c-.29-.29-.77005-.29-1.06005 0 -.29.29-.29.77 0 1.06l1.45005 1.45 -1.49005 1.49c-.29.29-.29.77 0 1.06 .15.15.34.22.53.22 .19005 0 .38005-.07.53005-.22l1.49-1.49 1.45 1.45c.15.15.34.22.53.22 .19 0 .38-.07.53-.22 .29-.29.29-.76 0-1.06Z" />
							</g>
						</svg>
					)) || (
						<svg
							version="1.1"
							viewBox="0 0 24 24"
							width={24}
							height={24}
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<g fill={buttonColor}>
								<path d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9h-4.2c-3.5 0-4.9-1.4-4.9-4.9v-4.2c0-3.5 1.4-4.9 4.9-4.9h4.2c3.5 0 4.9 1.4 4.9 4.9Z" />
								<path
									opacity=".40"
									d="M17.0998 2h-4.2c-3.45004 0-4.85003 1.37-4.89003 4.75h3.09003c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89v-4.2c0-3.5-1.4-4.9-4.9-4.9Z"
								/>
							</g>
						</svg>
					)}
				</HStack>
			</HStack>
		</VStack>
	);
};

export default memo(Result);
