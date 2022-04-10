import {
	Box,
	TableContainer,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Badge,
	TableCaption,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import React from "react";

interface IProps {
	lossRate: number;
}
const rrRatio = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 10];

const RiskReward: React.FC<IProps> = ({ lossRate }: IProps) => {
	const t = useTranslations("riskReward");
	return (
		<Box mt={4} p={[4, 8]} bg="white" boxShadow={"lg"} borderRadius={8}>
			<TableContainer>
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
			</TableContainer>
		</Box>
	);
};

export default RiskReward;
