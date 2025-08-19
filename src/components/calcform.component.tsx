"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import useFormPersist from "../hooks/useFormPersist";
import TelegramMobile from "./telegram.mobile";
import { RippleButton } from "@/components/animate-ui/buttons/ripple";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { calculatorFormSchema, type CalculatorFormValues } from "@/lib/schemas";

const RiskReward = dynamic(() => import("./riskRewards.component"), {
	loading: () => <Loader2 className="h-4 w-4 animate-spin" />,
});

const Result = dynamic(() => import("./result.component"), {
	loading: () => <Loader2 className="h-4 w-4 animate-spin" />,
});

export default function CalcForm() {
	const t = useTranslations("form");
	const params = useParams();
	const locale = params.locale as string;

	const form = useForm<CalculatorFormValues>({
		resolver: zodResolver(calculatorFormSchema),
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
		{ watch: form.watch, setValue: form.setValue },
		{
			storage: process.browser && window.localStorage,
		}
	);

	const values = form.watch();

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
		const riskCapital = balance * _risk || 0;

		return {
			riskCapital,
			stoploss,
			leverage,
			balance,
			sizeUSDT: marginSize * leverage || 0,
		};
	}, [marginSize, values]);

	return (
		<Form {...form}>
			<form>
				<div className="flex flex-col items-start mt-4 p-4 md:p-8 bg-card shadow-lg rounded-lg space-y-4">
					{/* Account Balance */}
					<FormField
						control={form.control}
						name="balance"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-sm font-medium">
									{t("balance.label")}
									<FormDescription className="text-xs text-muted-foreground">
										{t("balance.subtitle")}
									</FormDescription>
								</FormLabel>
								<FormControl>
									<div className="flex">
										<div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm">
											$
										</div>
										<NumericFormat
											customInput={Input}
											className="rounded-l-none"
											placeholder={t("balance.placeholder")}
											allowNegative={false}
											thousandSeparator={true}
											type="text"
											inputMode="decimal"
											{...field}
											onValueChange={(v: any) => field.onChange(v.floatValue)}
											value={field.value || ""}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Risk */}
					<FormField
						control={form.control}
						name="risk"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-sm font-medium">
									{t("risk.label")}
									<FormDescription className="text-xs text-muted-foreground">
										{t("risk.subtitle")}
									</FormDescription>
								</FormLabel>
								<FormControl>
									<div className="flex">
										<NumericFormat
											customInput={Input}
											className="rounded-r-none"
											allowNegative={false}
											thousandSeparator={false}
											decimalScale={2}
											type="text"
											inputMode="decimal"
											fixedDecimalScale
											placeholder={t("risk.placeholder")}
											{...field}
											onValueChange={(v: any) => field.onChange(v.value)}
											value={field.value || ""}
										/>
										<div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
											%
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Stoploss */}
					<FormField
						control={form.control}
						name="stoploss"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-sm font-medium">
									{t("stoploss.label")}
									<FormDescription className="text-xs text-muted-foreground">
										{t("stoploss.subtitle")}
									</FormDescription>
								</FormLabel>
								<FormControl>
									<div className="flex">
										<NumericFormat
											customInput={Input}
											className="rounded-r-none"
											allowNegative={false}
											thousandSeparator={false}
											decimalScale={2}
											fixedDecimalScale
											type="text"
											inputMode="decimal"
											placeholder={t("stoploss.placeholder")}
											{...field}
											onValueChange={(v: any) => field.onChange(v.value)}
											value={field.value || ""}
										/>
										<div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm">
											%
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Leverage */}
					<FormField
						control={form.control}
						name="leverage"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel className="text-sm font-medium">
									{t("leverage.label")}
									<FormDescription className="text-xs text-muted-foreground">
										{t("leverage.subtitle")}
									</FormDescription>
								</FormLabel>
								<FormControl>
									<div className="flex flex-col items-center space-y-2 pt-6 pb-7 px-8 bg-muted rounded-lg select-none">
										<div className="flex w-full justify-between gap-2">
											<FormLabel className="leading-6">
												{field.value === 1
													? t("leverage.spot")
													: t("leverage.futures")}
											</FormLabel>
											<output className="text-sm font-medium tabular-nums">
												{field.value}
											</output>
										</div>
										<div className="flex-1 w-full order-0">
											<Slider
												min={1}
												max={100}
												step={1}
												value={[field.value]}
												onValueChange={(value) => field.onChange(value[0])}
												className="w-full"
											/>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex mt-4">
						<RippleButton
							size="sm"
							disabled={form.formState.isSubmitting}
							type="button"
							onClick={() =>
								form.reset({
									balance: 0,
									risk: 0,
									stoploss: 0,
									leverage: 10,
								})
							}
						>
							{form.formState.isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("actions.clear")}
						</RippleButton>
					</div>
				</div>

				<Result
					marginSize={marginSize}
					balance={calculator.balance}
					riskCapital={calculator.riskCapital}
					leverage={calculator.leverage}
					stoploss={calculator.stoploss}
					sizeUSDT={calculator.sizeUSDT}
				/>

				<RiskReward lossRate={calculator.riskCapital} />

				{locale === "fa" && <TelegramMobile />}
			</form>
		</Form>
	);
}
