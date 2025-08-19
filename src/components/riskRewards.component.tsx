"use client";

import { useTranslations } from "next-intl";
import React, { memo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface IProps {
	lossRate: number;
}

const RiskReward: React.FC<IProps> = ({ lossRate }: IProps) => {
	const t = useTranslations("riskReward");

	const [value, setValue] = useState<number>(2);
	const pnl = Math.round(value * lossRate * 100) / 100 || 0;

	return (
		<div className="mt-6 p-4 md:p-8 bg-card shadow-lg rounded-lg">
			{/* Reward Slider */}
			<div className="space-y-2">
				<Label htmlFor="RewardSlider" className="text-sm font-medium">
					{t("rewardSlider.label")}
					<span className="block text-xs text-muted-foreground">
						{t("rewardSlider.subtitle")}
					</span>
				</Label>

				<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 pl-5 pr-10 py-6 bg-muted rounded-lg select-none">
					<div className="flex items-center flex-row flex-none flex-nowrap order-1 md:order-0 mt-2 md:mt-0">
						<span className="font-bold text-lg min-w-[2rem] text-center opacity-60">
							1
						</span>
						<span className="font-bold text-lg min-w-[1rem] text-center opacity-60">
							:
						</span>
						<span className="text-lg min-w-[2rem] text-center">{value}</span>
					</div>
					<div className="flex-1 w-full order-[-1] md:order-0">
						<Slider
							defaultValue={[2]}
							min={1}
							max={10}
							step={0.1}
							value={[value]}
							onValueChange={(val) => setValue(val[0])}
							className="w-full"
						/>
					</div>
				</div>
			</div>

			<div className="w-full border-t border-border my-6" />

			{/* Risk/Reward Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="text-center p-4 bg-muted/50 rounded-lg">
					<div className="text-2xl font-bold text-destructive">
						${lossRate.toLocaleString()}
					</div>
					<div className="text-sm text-muted-foreground">{t("risk.label")}</div>
				</div>

				<div className="text-center p-4 bg-muted/50 rounded-lg">
					<div className="text-2xl font-bold text-green-600">
						${pnl.toLocaleString()}
					</div>
					<div className="text-sm text-muted-foreground">
						{t("reward.label")}
					</div>
				</div>

				<div className="text-center p-4 bg-muted/50 rounded-lg">
					<div className="text-2xl font-bold text-blue-600">
						{value.toFixed(1)}x
					</div>
					<div className="text-sm text-muted-foreground">
						{t("ratio.label")}
					</div>
				</div>
			</div>

			{/* Additional Info */}
			<div className="mt-6 p-4 bg-muted/30 rounded-lg">
				<div className="text-sm text-muted-foreground">{t("info.message")}</div>
			</div>
		</div>
	);
};

export default memo(RiskReward);
