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
	StatGroup,
	StatHelpText,
	StatLabel,
	StatNumber,
	Divider,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface IProps {
	lossRate: number;
}
// const rrRatio = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 10];

const RiskReward: React.FC<IProps> = ({ lossRate }: IProps) => {
	const t = useTranslations("riskReward");
	const [value, setValue] = useState<number>(2);
	return (
		<Box mt={4} p={[4, 8]} bg="white" boxShadow={"lg"} borderRadius={8}>
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
					spacing={4}
					py={6}
					bg={"gray.100"}
					borderRadius={"lg"}
					userSelect="none"
				>
					<Box d="flex" alignItems="center" flexDirection="row">
						<Text
							fontWeight={"bold"}
							fontSize="lg"
							minW={"8"}
							textAlign="center"
						>
							1
						</Text>
						<Text
							fontWeight={"bold"}
							fontSize="lg"
							minW={"4"}
							textAlign="center"
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
						defaultValue={2}
						min={1}
						max={25}
						step={0.5}
						value={value}
						onChange={(e) => setValue(e)}
						focusThumbOnChange={false}
					>
						<SliderTrack bg="gray.300">
							<Box position="relative" right={10} />
							<SliderFilledTrack bg="#088f62" />
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

			<StatGroup mt={4}>
				<Stat>
					<StatLabel>{t("pnl.label")}</StatLabel>
					<StatNumber color="#088f62">
						~ ${(Math.round(value * lossRate * 100) / 100 || 0).toFixed(2)}
					</StatNumber>
					<StatHelpText color="gray.600">{t("pnl.subtitle")}</StatHelpText>
				</Stat>
			</StatGroup>

			<Divider mt={3} />
			<Text color="gray.500" fontWeight={500} mt={2} fontSize={"xs"}>
				{t("note")}
			</Text>

			{/* <TableContainer>
				<Table variant="simple" size="sm">
					<Thead>
						<Tr>
							<Th py={3} isNumeric>
								{t("headings.0")}
							</Th>
							<Th py={3} isNumeric>
								{t("headings.1")}
							</Th>
							<Th py={3} isNumeric>
								{t("headings.2")}
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
					<TableCaption color="gray.500">{t("note")}</TableCaption>
				</Table>
			</TableContainer> */}
		</Box>
	);
};

export default RiskReward;
