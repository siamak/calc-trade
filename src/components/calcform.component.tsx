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
} from "@chakra-ui/react";
import useFormPersist from "../hooks/useFormPersist";

const rrRatio = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 10];
export default function HookForm() {
	const {
		register,
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
						Account balance
						<Text fontSize="xs" opacity={0.6}>
							How much money do you have?
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
									placeholder="Enter your account balance ($1,000) ..."
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
						{errors.balance && (errors.balance.message || "Balance should be number")}
					</FormErrorMessage>
				</FormControl>

				{/* Risk */}
				<FormControl isInvalid={errors.risk}>
					<FormLabel htmlFor="risk">
						Risk (%)
						<Text fontSize="xs" opacity={0.6}>
							How much risk are you willing to take?
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
									placeholder="Enter your risk (1.00%) ..."
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
					<FormErrorMessage>
						{errors.risk && (errors.risk.message || "Risk should be number")}
					</FormErrorMessage>
				</FormControl>

				{/* Stoploss */}
				<FormControl isInvalid={errors.stoploss}>
					<FormLabel htmlFor="stoploss">
						Stop loss (%)
						<Text fontSize="xs" opacity={0.6}>
							How much percent are you willing to lose on stop-loss?
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
									placeholder="Enter your stoploss (0.50%) ..."
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
						{errors.stoploss && (errors.stoploss.message || "Stop-loss should be number")}
					</FormErrorMessage>
				</FormControl>

				{/* Leverage */}
				<FormControl isInvalid={errors.leverage}>
					<FormLabel htmlFor="leverage">
						Leverage
						<Text fontSize="xs" opacity={0.6}>
							What is the size of your leverage?
						</Text>
					</FormLabel>

					<HStack pl={5} pr={10} spacing={3} py={6} bg={"gray.100"} borderRadius={"lg"} userSelect="none">
						<Box d="flex" alignItems="center" flexDirection="row">
							<Text fontWeight={"bold"} fontSize="xl" minW={"10"} textAlign="center">
								{getValues("leverage")}
							</Text>
							<Text fontSize="xs" opacity={0.6} minW={"100"} pl={2}>
								{getValues("leverage") === 1 ? "Spot trade" : "Futures trade"}
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
					<FormErrorMessage>
						{errors.leverage && (errors.leverage.message || "Leverage should be number")}
					</FormErrorMessage>
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
						Clear
					</Button>
				</HStack>
			</VStack>

			<HStack spacing={4} my={4} px={8} py={5} bg="white" boxShadow={"lg"} borderRadius={8}>
				<svg width={64} height={64} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width={512} height={512} rx={130} fill="#6DB9FF" fillOpacity=".3" />
					<path
						d="M332.7 64.3H179.3c-52.9 0-95.8 43-95.8 95.9v191.6c0 53 43 95.9 95.8 95.9h153.4c52.9 0 95.8-43 95.8-95.9V160.2c0-53-43-95.9-95.8-95.9ZM195.8 383.1a18.9 18.9 0 0 1-13.4 5.5 19.2 19.2 0 0 1-19.4-19.2 19.5 19.5 0 0 1 12-17.6 19.7 19.7 0 0 1 18 1.8 19.5 19.5 0 0 1 8.6 16c0 5-2.1 9.8-5.8 13.5ZM163 292.8c0-2.5.6-5 1.6-7.3A19.1 19.1 0 0 1 193 277a20.3 20.3 0 0 1 7 8.6c1 2.3 1.4 4.8 1.4 7.3a19 19 0 0 1-26.5 17.6 19 19 0 0 1-11.9-17.6Zm109.5 90.3a19.3 19.3 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-1.4.2-2.5.4-3.9l1.1-3.4 1.8-3.5c.7-1 1.5-1.9 2.5-2.8a19.5 19.5 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm0-76.7a19 19 0 0 1-13.6 5.6c-5 0-9.8-2-13.4-5.6a19.2 19.2 0 0 1-5.8-13.6c0-5 2.1-10 5.8-13.6 7-7.1 19.9-7.1 27 0 1.7 2 3.2 3.8 4.2 6.3 1 2.3 1.3 4.8 1.3 7.3 0 5.2-1.9 10-5.5 13.6Zm-74-80c-19.7 0-36-16-36-36v-19.1c0-19.8 16-36 36-36h115c19.7 0 36 16 36 36v19.1c0 19.8-16 36-36 36h-115Zm150.6 156.7a19 19 0 0 1-20.8 4 19 19 0 0 1-11.7-17.6c0-5 1.9-10 5.5-13.6a19.4 19.4 0 0 1 27 0 19.3 19.3 0 0 1 0 27.2Zm4.3-83a19.3 19.3 0 0 1-17.9 11.9c-5 0-9.7-2-13.4-5.6a19.1 19.1 0 0 1-5.7-13.6c0-5 2-10 5.7-13.6 7.1-7.1 20-7.1 27 0 3.7 3.6 5.8 8.6 5.8 13.6 0 2.5-.6 5-1.5 7.3Z"
						fill="#0270BF"
					/>
				</svg>

				<Box>
					<Text fontSize="md" color="gray.500">
						Your position size is
					</Text>
					<Text mt={-1} fontSize="x-large" color="#0270BF" fontWeight={"bold"}>
						{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(marginSize)}
					</Text>
				</Box>
				{/* <Alert bg={"#a1ece7"} color="#093e3b" borderRadius={"lg"} status="success">
					<AlertIcon color="#1c746e" />
					Position size is:{" "}
					<Text pl={1} fontWeight={"bold"}>
						${marginSize}
					</Text>
				</Alert> */}
			</HStack>

			<Box mt={4} p={[4, 8]} bg="white" boxShadow={"lg"} borderRadius={8}>
				<TableContainer>
					<Table variant="simple" size="sm">
						<Thead>
							<Tr>
								<Th py={3} isNumeric>
									Risk/Reward Ratio
								</Th>
								<Th py={3} isNumeric>
									Profit
								</Th>
								<Th py={3} isNumeric>
									Loss
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
						<TableCaption color="gray.500">Note: does not account for exchange fees.</TableCaption>
					</Table>
				</TableContainer>
			</Box>

			<Text textAlign={"center"} color="gray.500" mt={8} fontStyle="italic">
				We do not store your data on servers. Data will be stored on your device.
			</Text>

			<Text textAlign={"center"} color="gray.700" mt={2}>
				Created by{" "}
				<Text
					as="a"
					fontWeight={500}
					color={"purple.500"}
					_hover={{ color: "gray.700" }}
					target="_blank"
					href="https://m.siamak.me/"
				>
					Siamak
				</Text>
				.
			</Text>

			{/* <pre>{JSON.stringify({ errors, isSubmitting, isValid }, null, 2)}</pre> */}
		</form>
	);
}
