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
	Spinner,
	useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import useFormPersist from "../hooks/useFormPersist";

const RiskReward = dynamic(() => import("./riskRewards.component"), {
	loading: () => <Spinner />,
});

const Result = dynamic(() => import("./result.component"), {
	loading: () => <Spinner />,
});

export default function CalcForm() {
	const t = useTranslations("form");
	const bgSlider = useColorModeValue("gray.100", "#2e3345");
	const bgTrack = useColorModeValue("gray.300", "#5c6277");
	const bgAddon = useColorModeValue("gray.100", "#2e3345");
	const bgTrackActive = useColorModeValue("#641ce5", "#6e61ff");
	const bgButtonHover = useColorModeValue("gray.300", "gray.600");
	const bgButtonText = useColorModeValue("gray.600", "gray.100");

	const {
		watch,
		reset,
		setValue,
		getValues,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			balance: 0,
			risk: 0,
			stoploss: 0,
			leverage: 10,
		},
	});
	const [marginSize, setMargin] = useState<number>(0);

	useFormPersist(
		"@history",
		{ watch, setValue },
		{
			storage: process.browser && window.localStorage,
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

	const calculator = useMemo(() => {
		const { balance, risk, stoploss, leverage } = values;

		const _risk = risk / 100;

		return {
			riskCapital: balance * _risk || 0,
			stoploss,
			leverage,
			balance,
		};
	}, [values]);

	return (
		<form>
			<VStack
				alignItems={"flex-start"}
				mt={4}
				p={[4, 8]}
				bg="boxBg"
				boxShadow={"lg"}
				spacing={4}
				borderRadius={8}
			>
				{/* Account Balance */}
				<FormControl>
					<FormLabel htmlFor="balance">
						{t("balance.label")}
						<Text fontSize="xs" opacity={0.6}>
							{t("balance.subtitle")}
						</Text>
					</FormLabel>
					<InputGroup>
						<InputLeftAddon bg={bgAddon}>$</InputLeftAddon>

						<Controller
							control={control}
							name="balance"
							render={({ field: { onChange, name, value } }) => (
								<>
									<NumberFormat
										customInput={Input}
										placeholder={t("balance.placeholder")}
										borderStartRadius={0}
										allowNegative={false}
										thousandSeparator={true}
										type="text"
										inputMode="decimal"
										name={name}
										value={value || ""}
										onValueChange={(v) => onChange(v.floatValue)}
									/>
								</>
							)}
						/>
					</InputGroup>
					<FormErrorMessage>
						{errors.balance && (errors.balance.message || t("balance.error"))}
					</FormErrorMessage>
				</FormControl>

				{/* Risk */}
				<FormControl>
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
									allowNegative={false}
									thousandSeparator={false}
									decimalScale={2}
									borderEndRadius={0}
									type="text"
									inputMode="decimal"
									fixedDecimalScale
									placeholder={t("risk.placeholder")}
									name={name}
									value={value || ""}
									onValueChange={(v) => onChange(v.value)}
								/>
							)}
						/>

						<InputRightAddon bg={bgAddon}>%</InputRightAddon>
					</InputGroup>
					<FormErrorMessage>
						{errors.risk && (errors.risk.message || t("risk.error"))}
					</FormErrorMessage>
				</FormControl>

				{/* Stoploss */}
				<FormControl>
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
									borderEndRadius={0}
									allowNegative={false}
									thousandSeparator={false}
									decimalScale={2}
									fixedDecimalScale
									type="text"
									inputMode="decimal"
									placeholder={t("stoploss.placeholder")}
									name={name}
									value={value || ""}
									onValueChange={(v) => onChange(v.value)}
								/>
							)}
						/>

						<InputRightAddon bg={bgAddon}>%</InputRightAddon>
					</InputGroup>
					<FormErrorMessage>
						{errors.stoploss &&
							(errors.stoploss.message || t("stoploss.error"))}
					</FormErrorMessage>
				</FormControl>

				{/* Leverage */}
				<FormControl>
					<FormLabel htmlFor="leverage">
						{t("leverage.label")}
						<Text fontSize="xs" opacity={0.6}>
							{t("leverage.subtitle")}
						</Text>
					</FormLabel>

					<HStack
						pl={5}
						flexDirection={["column", "row"]}
						spacing={[0, 3]}
						pr={10}
						py={6}
						bg={bgSlider}
						borderRadius={"lg"}
						userSelect="none"
					>
						<Box
							order={[1, 0]}
							mt={[2, 0]}
							d="flex"
							alignItems="center"
							flexDirection="row"
						>
							<Text
								fontWeight={"bold"}
								fontSize="xl"
								minW={"10"}
								textAlign="center"
							>
								{getValues("leverage")}
							</Text>
							<Text fontSize="xs" opacity={0.6} minW={"100"} pl={2}>
								{getValues("leverage") === 1
									? t("leverage.spot")
									: t("leverage.futures")}
							</Text>
						</Box>
						<Slider
							order={[-1, 0]}
							defaultValue={10}
							min={1}
							max={50}
							step={1}
							value={getValues("leverage")}
							onChange={(e) => setValue("leverage", e)}
							focusThumbOnChange={false}
						>
							<SliderTrack bg={bgTrack}>
								<Box position="relative" right={10} />
								<SliderFilledTrack bg={bgTrackActive} />
							</SliderTrack>
							<SliderThumb
								boxShadow={
									"0 3px 6px 0 rgb(109 118 126 / 37%), 0 1px 2px 0 rgb(0 0 0 / 6%)"
								}
								boxSize={6}
							/>
						</Slider>
					</HStack>
					<FormErrorMessage>
						{errors.leverage && errors.leverage.message}
					</FormErrorMessage>
				</FormControl>

				<HStack mt={4}>
					<Button
						bg={bgButtonHover}
						color={bgButtonText}
						fontWeight={500}
						size="sm"
						isLoading={isSubmitting}
						type="button"
						onClick={() =>
							reset({
								balance: 0,
								risk: 0,
								stoploss: 0,
								leverage: 10,
							})
						}
					>
						{t("actions.clear")}
					</Button>
				</HStack>
			</VStack>

			<Result
				marginSize={marginSize}
				balance={calculator.balance}
				riskCapital={calculator.riskCapital}
			/>

			<RiskReward
				lossRate={calculator.riskCapital}
				stoploss={calculator.stoploss}
				leverage={calculator.leverage}
				balance={calculator.balance}
			/>
		</form>
	);
}
