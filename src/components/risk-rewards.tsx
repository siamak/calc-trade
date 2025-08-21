"use client";

import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import FinancialSummary from "./financial-summary";
import { Scale } from "lucide-react";
import NumberFlow from "@number-flow/react";

interface IProps {
	lossRate: number;
	balance: number;
	stoploss: number;
	leverage: number;
}

const RiskReward: React.FC<IProps> = ({
	lossRate,
	balance,
	stoploss,
	leverage,
}: IProps) => {
	const t = useTranslations("riskReward");

	const [value, setValue] = useState<number>(3);

	const pnl = Math.round(value * lossRate * 100) / 100 || 0;
	const percentInBalance = (pnl / balance) * 100 || 0;
	const percentChange = stoploss * value || 0;
	const roe = stoploss * value * leverage || 0;
	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<div className="pr-2 rtl:pr-0 rtl:pl-2 text-center bg-background text-sm shrink-0 text-muted-foreground/70 uppercase">
					{t("title")}
				</div>
				<Separator className="flex-1" />
			</div>

			<div className="flex flex-1 w-full justify-between items-center">
				<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
					<Scale className="h-10 w-10 text-muted-foreground opacity-60" />

					<div className="flex flex-col items-start">
						<span className="text-base font-medium">
							{t("rewardSlider.label")}
						</span>

						<span className="text-xs text-muted-foreground max-w-[360px]">
							{t("rewardSlider.subtitle")}
						</span>
					</div>
				</div>
				<div className="flex flex-row items-start justify-center font-bold text-xl gap-2 tabular-nums">
					<NumberFlow
						value={value}
						prefix="1 : "
						spinTiming={{ duration: 100 }}
						format={{
							style: "decimal",
						}}
						className="text-right"
					/>
				</div>
			</div>

			<div className="flex flex-col w-full items-start mt-4 space-y-6">
				{/* Reward Slider */}
				<div className="flex flex-row w-full items-center gap-2 pt-2 pb-0">
					<div className="flex flex-1 w-full justify-between items-center">
						<Slider
							min={1}
							defaultValue={[3]}
							max={50}
							step={0.5}
							value={[value]}
							onValueChange={(val) => setValue(val[0])}
							className="w-full"
							trackClassName="bg-muted rounded-full"
							rangeClassName="bg-gradient-to-l from-teal-500 via-sky-500 to-indigo-500 rounded-full"
							thumbClassName="w-6 rounded-full bg-card border-2 border-teal-500 focus-visible:border-teal-600 focus-visible:ring-0 h-5"
						/>
					</div>
				</div>

				{/* Financial Summary Dashboard */}
				<FinancialSummary
					estimatedPnl={pnl}
					percentInBalance={percentInBalance}
					percentChange={percentChange}
					roe={roe}
				/>
			</div>
		</>
	);
};

export default memo(RiskReward);
