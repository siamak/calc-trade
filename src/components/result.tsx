"use client";

import React, { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./animate-ui/buttons/copy";
import { Separator } from "@/components/ui/separator";
import NumberFlow from "@number-flow/react";
interface IProps {
	riskCapital: number;
	marginSize: number;
	balance: number;
	leverage: number;
	stoploss: number;
	sizeUSDT: number;
}

const Result: React.FC<IProps> = ({
	riskCapital,
	marginSize,
	balance,
	leverage,
	stoploss,
	sizeUSDT,
}: IProps) => {
	const t = useTranslations("result");
	const { toast } = useToast();

	const isImpossible = marginSize > balance;
	const willLiquidate = leverage * stoploss >= 92;

	const copy = useCallback(
		(text: string) => {
			toast({
				title: t("clipboard.title"),
				description: `$${text} ${t("clipboard.description")}`,
			});
		},
		[t, toast]
	);

	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<div className="pr-2 rtl:pr-0 rtl:pl-2 text-center bg-background text-sm shrink-0 text-muted-foreground/70 uppercase">
					{t("title")}
				</div>
				<Separator className="flex-1" />
			</div>
			<div className="flex flex-col items-start mt-4 space-y-6">
				<div className="flex flex-1 w-full justify-between items-center">
					<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
						<Coins className="h-10 w-10 text-primary" />

						<div className="flex flex-col items-start">
							<span className="text-base font-medium">
								{t("riskedCaptial.label")}
							</span>

							<span className="text-xs text-muted-foreground max-w-[360px]">
								{t("riskedCaptial.subtitle")}
							</span>
						</div>
					</div>

					<div className="flex flex-col items-end">
						<NumberFlow
							value={riskCapital}
							format={{
								style: "currency",
								currency: "USD",
							}}
							className="text-2xl font-bold"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							{t("margin.label")}
						</span>
						<div className="flex items-center justify-between">
							<NumberFlow
								value={marginSize}
								format={{
									style: "currency",
									currency: "USD",
								}}
								className="text-xl font-semibold"
							/>

							<CopyButton
								variant={"outline"}
								type="button"
								content={marginSize.toString()}
								onCopy={copy}
							/>
						</div>
					</div>

					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							{t("size.label")}
						</span>
						<div className="flex items-center justify-between">
							<NumberFlow
								value={sizeUSDT}
								format={{
									style: "currency",
									currency: "USD",
								}}
								className="text-xl font-semibold"
							/>

							<CopyButton
								variant={"outline"}
								type="button"
								content={sizeUSDT.toString()}
								onCopy={copy}
							/>
						</div>
					</div>
				</div>

				{isImpossible && (
					<div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<span className="text-sm text-destructive">
							{t("riskedCaptial.error")}
						</span>
					</div>
				)}

				{willLiquidate && (
					<div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
						<AlertTriangle className="h-5 w-5 text-destructive" />
						<span className="text-sm text-destructive">
							{t("riskedCaptial.error")}
						</span>
					</div>
				)}
			</div>
		</>
	);
};

export default memo(Result);
