"use client";

import React, { memo, useCallback } from "react";
import { useTranslations } from "next-intl";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "./animate-ui/buttons/copy";

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
		<div className="flex flex-col items-start space-y-4 my-6 p-4 md:p-8 bg-card shadow-lg rounded-lg">
			<div className="flex flex-1 w-full justify-between">
				<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
					<AlertTriangle className="h-10 w-10 text-destructive" />

					<div className="flex flex-col items-start space-y-1">
						<span className="text-base font-medium">
							{t("riskedCaptial.label")}
						</span>

						<span className="text-xs text-muted-foreground max-w-[360px]">
							{t("riskedCaptial.subtitle")}
						</span>
					</div>
				</div>

				<div className="flex flex-col items-end space-y-1">
					<span className="text-2xl font-bold">
						${riskCapital.toLocaleString()}
					</span>
				</div>
			</div>

			<div className="w-full border-t border-border" />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
				<div className="flex flex-col space-y-2">
					<span className="text-sm text-muted-foreground">
						{t("margin.label")}
					</span>
					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold">
							${marginSize.toLocaleString()}
						</span>
						<CopyButton
							variant={"outline"}
							type="button"
							content={marginSize.toString()}
							onCopy={copy}
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<span className="text-sm text-muted-foreground">
						{t("size.label")}
					</span>
					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold">
							${sizeUSDT.toLocaleString()}
						</span>
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
	);
};

export default memo(Result);
