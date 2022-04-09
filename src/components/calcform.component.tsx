import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import NumberFormat from "react-number-format";
import {
	FormErrorMessage,
	FormLabel,
	FormControl,
	Input,
	Button,
	InputGroup,
	InputLeftAddon,
	InputRightAddon,
	Text,
	VStack,
	HStack,
	Box,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Alert,
	AlertIcon,
	TableContainer,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Badge,
	TableCaption,
	Divider,
} from "@chakra-ui/react";
import useFormPersist from "../hooks/useFormPersist";
// import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

const rrRatio = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 10];

interface IProps {
	content: { [key: string]: string };
}
export default function HookForm({ content }: IProps) {
	const router = useRouter();
	const t = useTranslations("form");
	const { locale } = router;

	const isRTL = locale === "rtl";
	const {
		// register,
		handleSubmit,
		watch,
		reset,
		setValue,
		getValues,
		control,
		formState: { errors, isSubmitting, isValid },
	} = useForm({
		mode: "onBlur",
	});
	const [marginSize, setMargin] = useState<number>(0);

	useFormPersist(
		"@history",
		{ watch, setValue },
		{
			storage: process.browser && window.localStorage, // default window.sessionStorage
		}
	);

	const values = watch();

	useEffect(() => {
		const { balance, risk, stoploss, leverage } = values;

		const _risk = risk / 100;
		const _sl = stoploss / 100;
		const margin = (balance * _risk) / (_sl * leverage);
		setMargin(Math.round(margin) || 0);
	}, [values, setMargin]);

	const lossRate = useMemo(() => {
		const { balance, risk, stoploss, leverage } = values;

		const _risk = risk / 100;
		const _sl = stoploss / 100;
		const margin = (balance * _risk) / (_sl * leverage);

		return margin * _sl;
	}, [values]);

	const riskCapital = useMemo(() => {
		const { balance, risk } = values;

		const _risk = risk / 100;
		const margin = balance * _risk;

		return margin || 0;
	}, [values]);

	function onSubmit(values: any) {
		return new Promise((resolve: any) => {
			setTimeout(() => {
				alert(JSON.stringify(values, null, 2));
				resolve();
			}, 3000);
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<VStack
				alignItems={"flex-start"}
				mt={4}
				p={[4, 8]}
				bg="white"
				boxShadow={"lg"}
				spacing={4}
				borderRadius={8}
			>
				{/* Account Balance */}
				<FormControl isInvalid={errors.balance}>
					<FormLabel htmlFor="balance">
						{t("balance.label")}
						<Text fontSize="xs" opacity={0.6}>
							{t("balance.subtitle")}
						</Text>
					</FormLabel>
					<InputGroup>
						<InputLeftAddon>$</InputLeftAddon>
						{/* <Input
							id="balance"
							placeholder="Enter your account balance ($1000) ..."
							type={"number"}
							{...register("balance", {
								required: "This is required",
								valueAsNumber: true,
								// min: { value: 1, message: "balance should be number and > 0" },
								validate: {
									positive: (v) => parseInt(v) > 0,
								},
							})}
						/> */}

						<Controller
							control={control}
							name="balance"
							render={({ field: { onChange, name, value } }) => (
								<NumberFormat
									customInput={Input}
									borderRadius={"0 0.375rem 0.375rem 0"}
									placeholder={t("balance.placeholder")}
									allowNegative={false}
									thousandSeparator={true}
									name={name}
									value={value}
									onValueChange={(v) => onChange(v.floatValue)}
								/>
							)}
						/>
					</InputGroup>
					<FormErrorMessage>
						{errors.balance && (errors.balance.message || t("balance.error"))}
					</FormErrorMessage>
				</FormControl>

				{/* Risk */}
				<FormControl isInvalid={errors.risk}>
					<FormLabel htmlFor="risk">
						{t("risk.label")}

						<Text fontSize="xs" opacity={0.6}>
							{t("risk.subtitle")}
						</Text>
					</FormLabel>
					<InputGroup>
						<Controller
							control={control}
							name="risk"
							render={({ field: { onChange, name, value } }) => (
								<NumberFormat
									customInput={Input}
									borderRadius={"0.375rem 0 0 0.375rem"}
									allowNegative={false}
									thousandSeparator={false}
									decimalScale={2}
									fixedDecimalScale
									placeholder={t("risk.placeholder")}
									name={name}
									value={value}
									onValueChange={(v) => onChange(v.floatValue)}
								/>
							)}
						/>
						{/* <Input
							id="risk"
							placeholder="Enter your risk (1%) ..."
							type={"number"}
							pattern="^\d*(\.\d{0,2})?$"
							{...register("risk", {
								// required: "This is required",
								// valueAsNumber: true,
								// validate: {
								// 	positive: (v) => parseInt(v) > 0,
								// },
							})}
						/> */}
						<InputRightAddon>%</InputRightAddon>
					</InputGroup>
					<FormErrorMessage>{errors.risk && (errors.risk.message || t("risk.error"))}</FormErrorMessage>
				</FormControl>

				{/* Stoploss */}
				<FormControl isInvalid={errors.stoploss}>
					<FormLabel htmlFor="stoploss">
						{t("stoploss.label")}
						<Text fontSize="xs" opacity={0.6}>
							{t("stoploss.subtitle")}
						</Text>
					</FormLabel>
					<InputGroup>
						<Controller
							control={control}
							name="stoploss"
							render={({ field: { onChange, name, value } }) => (
								<NumberFormat
									customInput={Input}
									borderRadius={"0.375rem 0 0 0.375rem"}
									allowNegative={false}
									thousandSeparator={false}
									decimalScale={2}
									fixedDecimalScale
									placeholder={t("stoploss.subtitle")}
									name={name}
									value={value}
									onValueChange={(v) => onChange(v.floatValue)}
								/>
							)}
						/>
						{/* <Input
							id="stoploss"
							placeholder="Enter your stoploss (0.5%) ..."
							type={"number"}
							pattern="^\d*(\.\d{0,2})?$"
							{...register("stoploss", {
								// required: "This is required",
								// valueAsNumber: true,
								// pattern: "d*(.d{0,2})?$",
							})}
						/> */}
						<InputRightAddon>%</InputRightAddon>
					</InputGroup>
					<FormErrorMessage>
						{errors.stoploss && (errors.stoploss.message || t("stoploss.error"))}
					</FormErrorMessage>
				</FormControl>

				{/* Leverage */}
				<FormControl isInvalid={errors.leverage}>
					<FormLabel htmlFor="leverage">
						{t("leverage.label")}
						<Text fontSize="xs" opacity={0.6}>
							{t("leverage.subtitle")}
						</Text>
					</FormLabel>

					<HStack pl={5} pr={10} spacing={3} py={6} bg={"gray.100"} borderRadius={"lg"} userSelect="none">
						<Box d="flex" alignItems="center" flexDirection="row">
							<Text fontWeight={"bold"} fontSize="xl" minW={"10"} textAlign="center">
								{getValues("leverage")}
							</Text>
							<Text fontSize="xs" opacity={0.6} minW={"100"} pl={2}>
								{getValues("leverage") === 1 ? t("leverage.spot") : t("leverage.futures")}
							</Text>
						</Box>
						<Slider
							defaultValue={10}
							min={1}
							max={50}
							step={1}
							value={getValues("leverage")}
							onChange={(e) => setValue("leverage", e)}
							focusThumbOnChange={false}
							// onChangeEnd={(e) => setValue("leverage", e)}
						>
							<SliderTrack bg="gray.300">
								<Box position="relative" right={10} />
								<SliderFilledTrack bg="#ff5e28" />
							</SliderTrack>
							<SliderThumb
								boxShadow={"0 3px 6px 0 rgb(109 118 126 / 37%), 0 1px 2px 0 rgb(0 0 0 / 6%)"}
								boxSize={6}
							/>
						</Slider>
					</HStack>
					<FormErrorMessage>{errors.leverage && errors.leverage.message}</FormErrorMessage>
				</FormControl>

				<HStack mt={4}>
					{/* <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
					Calculate
				</Button> */}
					<Button
						bg="gray.300"
						color="gray.600"
						fontWeight={500}
						size="sm"
						isLoading={isSubmitting}
						type="button"
						onClick={() =>
							reset({
								balance: null,
								risk: null,
								stoploss: null,
								leverage: 10,
							})
						}
					>
						{t("actions.clear")}
					</Button>
				</HStack>
			</VStack>

			<VStack
				spacing={4}
				alignItems="flex-start"
				my={4}
				px={8}
				py={5}
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

						{/* <svg
							width={40}
							height={40}
							viewBox="0 0 512 512"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect width={512} height={512} rx={130} fill="#6DB9FF" fillOpacity=".3" />
							<path
								d="M332.7 64.3H179.3c-52.9 0-95.8 43-95.8 95.9v191.6c0 53 43 95.9 95.8 95.9h153.4c52.9 0 95.8-43 95.8-95.9V160.2c0-53-43-95.9-95.8-95.9ZM195.8 383.1a18.9 18.9 0 0 1-13.4 5.5 19.2 19.2 0 0 1-19.4-19.2 19.5 19.5 0 0 1 12-17.6 19.7 19.7 0 0 1 18 1.8 19.5 19.5 0 0 1 8.6 16c0 5-2.1 9.8-5.8 13.5ZM163 292.8c0-2.5.6-5 1.6-7.3A19.1 19.1 0 0 1 193 277a20.3 20.3 0 0 1 7 8.6c1 2.3 1.4 4.8 1.4 7.3a19 19 0 0 1-26.5 17.6 19 19 0 0 1-11.9-17.6Zm109.5 90.3a19.3 19.3 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-1.4.2-2.5.4-3.9l1.1-3.4 1.8-3.5c.7-1 1.5-1.9 2.5-2.8a19.5 19.5 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm0-76.7a19 19 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-5 2.1-10 5.8-13.6 7-7.1 19.9-7.1 27 0 1.7 2 3.2 3.8 4.2 6.3 1 2.3 1.3 4.8 1.3 7.3 0 5.2-1.9 10-5.5 13.6Zm-74-80c-19.7 0-36-16-36-36v-19.1c0-19.8 16-36 36-36h115c19.7 0 36 16 36 36v19.1c0 19.8-16 36-36 36h-115Zm150.6 156.7a19 19 0 0 1-20.8 4 19 19 0 0 1-11.7-17.6c0-5 1.9-10 5.5-13.6a19.4 19.4 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm4.3-83a19.3 19.3 0 0 1-17.9 11.9c-5 0-9.7-2-13.4-5.6a19.1 19.1 0 0 1-5.7-13.6c0-5 2-10 5.7-13.6 7.1-7.1 20-7.1 27 0 3.7 3.6 5.8 8.6 5.8 13.6 0 2.5-.6 5-1.5 7.3Z"
								fill="#0270BF"
							/>
						</svg> */}

						<VStack alignItems="flex-start" spacing={0}>
							<Text fontSize="md" fontWeight={500}>
								{t("riskedCaptial.label")}
							</Text>

							<Text fontSize="xs" opacity={0.6}>
								{t("riskedCaptial.subtitle")}
							</Text>
						</VStack>
					</HStack>
					<Text fontSize="large" color="gray.700" fontWeight={"bold"} lineHeight={1}>
						{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(riskCapital)}
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
							<g fill="#219752">
								<path
									opacity=".40"
									d="M17 7.75c-.19 0-.38-.07-.53-.22 -.29-.29-.29-.77 0-1.06l2.05-2.05c-1.76-1.5-4.03-2.42-6.52-2.42 -5.52 0-10 4.48-10 10 0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-2.49-.92-4.76-2.42-6.52l-2.05 2.05c-.15.15-.34.22-.53.22Z"
								/>
								<path d="M13.75 11.82l-1-.35v-2.22h.08c.51 0 .92.45.92 1 0 .41.34.75.75.75 .41 0 .75-.34.75-.75 0-1.38-1.08-2.5-2.42-2.5h-.08v-.25c0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75v.25h-.3c-1.20999 0-2.2 1.02-2.2 2.28 0 1.46.85 1.93 1.5 2.16l1 .35v2.22h-.08c-.51 0-.92-.45-.92-1 0-.41-.34-.75-.75-.75 -.41 0-.75.34-.75.75 0 1.38 1.08001 2.5 2.42 2.5h.08v.25c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-.25h.3c1.21 0 2.2-1.02 2.2-2.28 0-1.47-.85-1.94-1.5-2.16Zm-3.01-1.06c-.34-.12-.49-.19-.49-.74 0-.43.32-.78.7-.78h.3v1.69l-.51-.17Zm2.31 3.99h-.3v-1.69l.51.18c.34.12.49.19.49.74 0 .42-.32.77-.7.77Z" />
								<path d="M22.6902 1.71024c-.08-.18-.22-.33-.41-.41 -.09-.04-.19-.06001-.29-.06001h-4c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h2.19l-1.6699 1.67001c.38.33.73.68 1.06 1.06l1.6699-1.67v2.2c0 .41.34.75.75.75 .41 0 .75-.34.75-.75v-4c.01-.1-.01-.19-.05-.29Z" />
							</g>
						</svg>

						{/* <svg
							width={40}
							height={40}
							viewBox="0 0 512 512"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect width={512} height={512} rx={130} fill="#6DB9FF" fillOpacity=".3" />
							<path
								d="M332.7 64.3H179.3c-52.9 0-95.8 43-95.8 95.9v191.6c0 53 43 95.9 95.8 95.9h153.4c52.9 0 95.8-43 95.8-95.9V160.2c0-53-43-95.9-95.8-95.9ZM195.8 383.1a18.9 18.9 0 0 1-13.4 5.5 19.2 19.2 0 0 1-19.4-19.2 19.5 19.5 0 0 1 12-17.6 19.7 19.7 0 0 1 18 1.8 19.5 19.5 0 0 1 8.6 16c0 5-2.1 9.8-5.8 13.5ZM163 292.8c0-2.5.6-5 1.6-7.3A19.1 19.1 0 0 1 193 277a20.3 20.3 0 0 1 7 8.6c1 2.3 1.4 4.8 1.4 7.3a19 19 0 0 1-26.5 17.6 19 19 0 0 1-11.9-17.6Zm109.5 90.3a19.3 19.3 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-1.4.2-2.5.4-3.9l1.1-3.4 1.8-3.5c.7-1 1.5-1.9 2.5-2.8a19.5 19.5 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm0-76.7a19 19 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-5 2.1-10 5.8-13.6 7-7.1 19.9-7.1 27 0 1.7 2 3.2 3.8 4.2 6.3 1 2.3 1.3 4.8 1.3 7.3 0 5.2-1.9 10-5.5 13.6Zm-74-80c-19.7 0-36-16-36-36v-19.1c0-19.8 16-36 36-36h115c19.7 0 36 16 36 36v19.1c0 19.8-16 36-36 36h-115Zm150.6 156.7a19 19 0 0 1-20.8 4 19 19 0 0 1-11.7-17.6c0-5 1.9-10 5.5-13.6a19.4 19.4 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm4.3-83a19.3 19.3 0 0 1-17.9 11.9c-5 0-9.7-2-13.4-5.6a19.1 19.1 0 0 1-5.7-13.6c0-5 2-10 5.7-13.6 7.1-7.1 20-7.1 27 0 3.7 3.6 5.8 8.6 5.8 13.6 0 2.5-.6 5-1.5 7.3Z"
								fill="#0270BF"
							/>
						</svg> */}

						<VStack alignItems="flex-start" spacing={0}>
							<Text fontSize="md" fontWeight={500}>
								{t("margin.label")}
							</Text>

							<Text fontSize="xs" opacity={0.6}>
								{t("margin.subtitle")}
							</Text>
						</VStack>
					</HStack>
					<Text fontSize="large" color="gray.700" fontWeight={"bold"} lineHeight={1}>
						{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(marginSize)}
					</Text>
				</HStack>

				{/* 
				<Box>
					<Text fontSize="md" color="gray.500">
						Your position size is
					</Text>
					<Text mt={-1} fontSize="x-large" color="#0270BF" fontWeight={"bold"}>
						{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(marginSize)}
					</Text>
				</Box> */}

				{/* <Alert bg={"#a1ece7"} color="#093e3b" borderRadius={"lg"} status="success">
					<AlertIcon color="#1c746e" />
					Position size is:{" "}
					<Text pl={1} fontWeight={"bold"}>
						${marginSize}
					</Text>
				</Alert> */}
			</VStack>

			<Box mt={4} p={[4, 8]} bg="white" boxShadow={"lg"} borderRadius={8}>
				<TableContainer>
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th py={3} isNumeric>
									{t("result.headings.0")}
								</Th>
								<Th py={3} isNumeric>
									{t("result.headings.1")}
								</Th>
								<Th py={3} isNumeric>
									{t("result.headings.2")}
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{rrRatio.map((r: number) => (
								<Tr background={(r === 2 && "gray.100") || ""} key={r}>
									<Td py={3} isNumeric>
										<code>1:{r}</code>
									</Td>
									<Td py={3} isNumeric>
										<Badge colorScheme="green">
											+ ${(Math.round(r * lossRate * 100) / 100 || 0).toFixed(2)}
										</Badge>
									</Td>
									<Td py={3} isNumeric>
										<Badge colorScheme="red">
											- ${(Math.round(lossRate * 100) / 100 || 0).toFixed(2)}
										</Badge>
									</Td>
								</Tr>
							))}
						</Tbody>
						<TableCaption color="gray.500">{t("result.note")}</TableCaption>
					</Table>
				</TableContainer>
			</Box>

			<Text textAlign={"center"} color="gray.500" mt={8} fontStyle="italic">
				{t("footer.disclaimer")}
			</Text>

			<Text textAlign={"center"} color="gray.700" mt={2}>
				{t("footer.copyright.text")}{" "}
				<Text
					as="a"
					fontWeight={500}
					color={"purple.500"}
					_hover={{ color: "gray.700" }}
					target="_blank"
					href="https://m.siamak.me/"
				>
					{t("footer.copyright.name")}
				</Text>
				.
			</Text>
		</form>
	);
}
