"use client";

import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface IProps {
	estimatedPnl: number;
	percentInBalance: number;
	percentChange: number;
	roe: number;
}

const FinancialSummary: React.FC<IProps> = ({
	estimatedPnl,
	percentInBalance,
	percentChange,
	roe,
}: IProps) => {
	const t = useTranslations("riskReward");

	const formatCurrency = (value: number) => {
		return `~${new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value)}`;
	};

	const formatPercentage = (value: number) => {
		return `+${new Intl.NumberFormat("en-US", {
			style: "percent",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value / 100)}`;
	};

	return (
		<div className="flex w-full flex-col my-6">
			{/* KPI Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 w-full border border-border rounded-lg overflow-hidden divide-y md:divide-x divide-border">
				{/* Estimated PnL */}
				<div className="p-5 space-y-2">
					<Badge variant="outline">{t("pnl.label")}</Badge>
					<div className="text-2xl font-bold text-emerald-500">
						{formatCurrency(estimatedPnl)}
					</div>
					<p className="text-sm text-muted-foreground">{t("pnl.subtitle")}</p>
				</div>

				{/* Percent of Balance */}
				<div className="p-5 space-y-2">
					<Badge variant="outline">{t("ptb.label")}</Badge>
					<div className="text-2xl font-bold text-blue-500">
						{formatPercentage(percentInBalance)}
					</div>
					<p className="text-sm text-muted-foreground">{t("ptb.subtitle")}</p>
				</div>

				{/* Percent Change */}
				<div className="p-5 space-y-2">
					<Badge variant="outline">{t("percent.label")}</Badge>
					<div className="text-2xl font-bold text-foreground/80">
						{formatPercentage(percentChange)}
					</div>
					<p className="text-sm text-muted-foreground">
						{t("percent.subtitle")}
					</p>
				</div>

				{/* ROE */}
				<div className="p-5 space-y-2">
					<Badge variant="outline">{t("roe.label")}</Badge>
					<div className="text-2xl font-bold text-teal-500">
						{formatPercentage(roe)}
					</div>
					<p className="text-sm text-muted-foreground">{t("roe.subtitle")}</p>
				</div>
			</div>

			{/* Note Section */}

			<Alert className="bg-amber-500/10 dark:bg-amber-500/10 my-4 border-amber-300 dark:border-amber-500/30">
				<Info className="h-4 w-4 !text-amber-500" />
				<AlertTitle>{t("note")}</AlertTitle>
			</Alert>
		</div>
	);
};

export default memo(FinancialSummary);
