import {
	Box,
	Text,
	Slider,
	FormControl,
	FormLabel,
	HStack,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Divider,
	SimpleGrid,
	useColorModeValue,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";

interface IProps {
	lossRate: number;
	stoploss: number;
	leverage: number;
	balance: number;
}

const RiskReward: React.FC<IProps> = ({
	lossRate,
	stoploss,
	leverage,
	balance,
}: IProps) => {
	const t = useTranslations("riskReward");
	const bgSlider = useColorModeValue("gray.100", "#2e3345");
	const bgTrack = useColorModeValue("gray.300", "#5c6277");
	const bgTrackActive = useColorModeValue("#009980", "#17e2c0");

	const greenColor = useColorModeValue("#009980", "#17e2c0");
	const purpleColor = useColorModeValue("purple.500", "#9086ff");
	const blueColor = useColorModeValue("blue.500", "blue.300");
	const blackColor = useColorModeValue("gray.800", "gray.400");

	const [value, setValue] = useState<number>(2);
	const pnl = Math.round(value * lossRate * 100) / 100 || 0;

	return (
		<Box
			mt={6}
			p={[4, 8]}
			bg="boxBg"
			boxShadow={
				"0px 11.3px 10px -62px rgba(0, 0, 0, 0.053), 0px 90px 80px -62px rgba(0, 0, 0, 0.11)"
			}
			borderRadius={8}
		>
			{/* Reward Slider */}
			<FormControl>
				<FormLabel htmlFor="RewardSlider">
					{t("rewardSlider.label")}
					<Text fontSize="xs" opacity={0.6}>
						{t("rewardSlider.subtitle")}
					</Text>
				</FormLabel>

				<HStack
					pl={5}
					pr={10}
					flexDirection={["column", "row"]}
					spacing={[0, 3]}
					py={6}
					bg={bgSlider}
					borderRadius={"lg"}
					userSelect="none"
				>
					<Box
						display={"flex"}
						order={[1, 0]}
						mt={[2, 0]}
						alignItems="center"
						flexDirection="row"
						flex={"none"}
						flexWrap={"nowrap"}
					>
						<Text
							fontWeight={"bold"}
							fontSize="lg"
							minW={"8"}
							textAlign="center"
							opacity={0.6}
						>
							1
						</Text>
						<Text
							fontWeight={"bold"}
							fontSize="lg"
							minW={"4"}
							textAlign="center"
							opacity={0.6}
						>
							:
						</Text>

						<Text
							fontWeight={"bold"}
							fontSize="lg"
							minW={"10"}
							textAlign="center"
						>
							{value}
						</Text>
					</Box>
					<Slider
						order={[-1, 0]}
						defaultValue={2}
						min={1}
						max={50}
						step={0.5}
						value={value}
						onChange={(e) => setValue(e)}
						focusThumbOnChange={false}
						flex={"auto"}
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
			</FormControl>

			<SimpleGrid mt={4} minChildWidth="200px" spacing={4}>
				<Stat>
					<StatLabel>{t("pnl.label")}</StatLabel>
					<StatNumber color={greenColor}>
						~
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(pnl)}
					</StatNumber>
					<StatHelpText opacity={0.6}>{t("pnl.subtitle")}</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>{t("ptb.label")}</StatLabel>
					<StatNumber color={purpleColor}>
						+{((pnl / balance) * 100 || 0).toFixed(2)}%
					</StatNumber>
					<StatHelpText opacity={0.6}>{t("ptb.subtitle")}</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>{t("percent.label")}</StatLabel>
					<StatNumber fontSize={"lg"} lineHeight={2} color={blackColor}>
						+{(stoploss * value || 0).toFixed(2)}%
					</StatNumber>
					<StatHelpText opacity={0.6}>{t("percent.subtitle")}</StatHelpText>
				</Stat>

				<Stat>
					<StatLabel>{t("roe.label")}</StatLabel>
					<StatNumber fontSize={"lg"} lineHeight={2} color={blueColor}>
						+{(stoploss * value * leverage || 0).toFixed(2)}%
					</StatNumber>
					<StatHelpText opacity={0.6}>{t("roe.subtitle")}</StatHelpText>
				</Stat>
			</SimpleGrid>

			<Divider mt={3} />
			<Text color="gray.500" fontWeight={500} mt={2} fontSize={"xs"}>
				{t("note")}
			</Text>
		</Box>
	);
};

export default memo(RiskReward);
