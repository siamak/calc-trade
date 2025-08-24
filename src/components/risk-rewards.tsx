"use client";

import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import FinancialSummary from "./financial-summary";
import { Scale } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { CalculatorFormValues } from "@/lib/schemas";
import { UseFormReturn } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";

interface IProps {
	form: UseFormReturn<CalculatorFormValues>;
	lossRate: number;
}

const RiskReward: React.FC<IProps> = ({ form, lossRate }) => {
	const t = useTranslations("riskReward");

	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<div className="pr-2 rtl:pr-0 rtl:pl-2 text-center bg-background text-sm shrink-0 text-muted-foreground/70 uppercase">
					{t("title")}
				</div>
				<Separator className="flex-1" />
			</div>

			<FormField
				control={form.control}
				name="rewardRatio"
				render={({ field }) => {
					const rewardRatio = field.value;
					const { balance, stoploss, leverage } = form.getValues();

					const pnl = Math.round(rewardRatio * lossRate * 100) / 100 || 0;
					const percentInBalance = (pnl / balance) * 100 || 0;
					const percentChange = stoploss * rewardRatio || 0;
					const roe = stoploss * rewardRatio * leverage || 0;

					return (
						<FormItem className="flex flex-col w-full items-start mt-4 space-y-4">
							{/* Label & Display */}
							<div className="flex flex-1 w-full justify-between items-center">
								<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
									<Scale className="h-10 w-10 text-muted-foreground opacity-60" />
									<div className="flex flex-col items-start">
										<FormLabel>{t("rewardSlider.label")}</FormLabel>
										<span className="text-xs text-muted-foreground max-w-[360px]">
											{t("rewardSlider.subtitle")}
										</span>
									</div>
								</div>

								<div className="flex flex-row items-start justify-center font-bold text-xl gap-2 tabular-nums">
									<NumberFlow
										value={rewardRatio}
										prefix="1 : "
										spinTiming={{ duration: 100 }}
										format={{ style: "decimal" }}
										className="text-right"
									/>
								</div>
							</div>

							{/* Slider */}
							<FormControl>
								<div className="flex flex-row w-full items-center gap-2 pt-2 pb-0">
									<div className="flex flex-1 w-full justify-between items-center">
										<Slider
											min={1}
											max={50}
											step={0.5}
											value={[field.value ?? 1]}
											onValueChange={(val) => field.onChange(val[0])}
											className="w-full"
											trackClassName="bg-muted rounded-full"
											rangeClassName="bg-gradient-to-l from-teal-500 via-sky-500 to-indigo-500 rounded-full"
											thumbClassName="w-6 rounded-full bg-card border-2 border-teal-500 focus-visible:border-teal-600 focus-visible:ring-0 h-5"
										/>
									</div>
								</div>
							</FormControl>
							<FormMessage />

							{/* Summary */}
							<FinancialSummary
								estimatedPnl={pnl}
								percentInBalance={percentInBalance}
								percentChange={percentChange}
								roe={roe}
							/>
						</FormItem>
					);
				}}
			/>
		</>
	);
};

export default memo(RiskReward);
