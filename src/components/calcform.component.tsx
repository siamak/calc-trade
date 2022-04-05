import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
	Divider,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import useFormPersist from "../hooks/useFormPersist";

export default function HookForm() {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		getValues,
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
			<VStack spacing={6}>
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
						<Input
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
						<Input
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
						/>
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
						<Input
							id="stoploss"
							placeholder="Enter your stoploss (0.5%) ..."
							type={"number"}
							pattern="^\d*(\.\d{0,2})?$"
							{...register("stoploss", {
								// required: "This is required",
								// valueAsNumber: true,
								// pattern: "d*(.d{0,2})?$",
							})}
						/>
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

					<HStack pl={5} pr={10} spacing={6} py={6} bg={"gray.100"} borderRadius={"lg"}>
						<Box d="flex" alignItems="center" flexDirection="row">
							<Text fontWeight={"bold"} fontSize="xl" minW={"10"} textAlign="center">
								{getValues("leverage")}
							</Text>
							<Text fontSize="xs" opacity={0.6} minW={"20"} pl={2}>
								{getValues("leverage") === 1 ? "Spot trade" : "Futures trade"}
							</Text>
						</Box>
						<Slider
							defaultValue={10}
							min={1}
							max={50}
							step={1}
							onChange={(e) => setValue("leverage", e)}
							// onChangeEnd={(e) => setValue("leverage", e)}
						>
							<SliderTrack bg="gray.300">
								<Box position="relative" bg={"yellow"} right={10} />
								<SliderFilledTrack bg="tomato" />
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
			</VStack>

			<Box my={4}>
				<Alert bg={"#a1ece7"} color="#093e3b" borderRadius={"lg"} status="success">
					<AlertIcon color="#1c746e" />
					Position size is:{" "}
					<Text pl={1} fontWeight={"bold"}>
						${marginSize}
					</Text>
				</Alert>
			</Box>
			{/* <Divider /> */}

			<HStack mt={4}>
				{/* <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
					Calculate
				</Button> */}
				<Button
					bg="gray.300"
					color="gray.700"
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

			<Divider mt={4} />

			<Text color="gray.500" mt={1} fontStyle="italic">
				We do not store your data on servers. Data will be stored on your device.
			</Text>

			<Text color="gray.700" mt={4}>
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
