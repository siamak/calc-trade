"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import useFormPersist from "react-hook-form-persist";
import { DollarSign, Loader2, Percent, DiamondPercent } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
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
		mode: "onChange",
		reValidateMode: "onChange",
		criteriaMode: "all",
		defaultValues: {
			balance: 0,
			risk: 0,
			stoploss: 0,
			leverage: 10,
		},
	});

	const [marginSize, setMargin] = useState<number>(0);

	const values = form.watch();
	const { watch, setValue } = form;

	useFormPersist("@history", {
		watch,
		setValue,
		storage: window.localStorage,
	});

	useEffect(() => {
		const { balance, risk, stoploss, leverage } = values;

		const _risk = risk / 100;
		const _sl = stoploss / 100;

		// Prevent division by zero
		if (_sl === 0 || leverage === 0) {
			setMargin(0);
			return;
		}

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

	console.log(calculator);

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
								<FormLabel htmlFor={field.name} className="font-medium">
									{t("balance.label")}
								</FormLabel>

								<FormControl className="relative">
									<div className="relative">
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<DollarSign size={16} aria-hidden="true" />
										</div>
										<NumericFormat
											customInput={Input}
											className="peer ps-9"
											placeholder={t("balance.placeholder")}
											allowNegative={false}
											thousandSeparator={true}
											type="text"
											inputMode="decimal"
											id={field.name}
											{...field}
											onValueChange={(v: any) => {
												const value = v.floatValue;
												// Ensure we always store a clean numeric value
												const cleanValue = value !== undefined ? value : 0;
												field.onChange(cleanValue);
											}}
											value={field.value ?? ""}
										/>
									</div>
								</FormControl>
								<FormDescription className="text-xs text-muted-foreground">
									{t("balance.subtitle")}
								</FormDescription>
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
								<FormLabel htmlFor={field.name} className="font-medium">
									{t("risk.label")}
								</FormLabel>
								<FormControl>
									<div className="relative">
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<Percent size={16} aria-hidden="true" />
										</div>
										<NumericFormat
											customInput={Input}
											className="peer ps-9"
											allowNegative={false}
											thousandSeparator={false}
											decimalScale={2}
											type="text"
											inputMode="decimal"
											id={field.name}
											fixedDecimalScale
											placeholder={t("risk.placeholder")}
											{...field}
											onValueChange={(v: any) => {
												const value = v.value;
												field.onChange(value !== undefined ? value : 0);
											}}
											value={field.value ?? ""}
										/>
									</div>
								</FormControl>
								<FormDescription className="text-xs text-muted-foreground">
									{t("risk.subtitle")}
								</FormDescription>
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
								<FormLabel htmlFor={field.name} className="font-medium">
									{t("stoploss.label")}
								</FormLabel>
								<FormControl>
									<div className="relative">
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<DiamondPercent size={16} aria-hidden="true" />
										</div>
										<NumericFormat
											customInput={Input}
											className="peer ps-9"
											allowNegative={false}
											thousandSeparator={false}
											decimalScale={2}
											fixedDecimalScale
											type="text"
											inputMode="decimal"
											placeholder={t("stoploss.placeholder")}
											id={field.name}
											{...field}
											onValueChange={(v: any) => {
												const value = v.value;
												field.onChange(value !== undefined ? value : 0);
											}}
											value={field.value ?? ""}
										/>
									</div>
								</FormControl>
								<FormDescription className="text-xs text-muted-foreground">
									{t("stoploss.subtitle")}
								</FormDescription>
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
								<FormLabel htmlFor={field.name} className="text-sm font-medium">
									{t("leverage.label")}
								</FormLabel>
								<FormDescription className="text-xs text-muted-foreground">
									{t("leverage.subtitle")}
								</FormDescription>
								<FormControl>
									<div className="flex flex-col items-center space-y-2 pt-6 pb-7 px-8 bg-muted rounded-lg select-none">
										<div className="flex w-full justify-between gap-2">
											<FormLabel className="leading-6">
												{field.value === 1
													? t("leverage.spot")
													: t("leverage.futures")}
											</FormLabel>
											<output className="font-bold tabular-nums">
												{field.value}
											</output>
										</div>
										<div className="flex-1 w-full order-0">
											<Slider
												min={1}
												max={100}
												step={1}
												value={[field.value ?? 1]}
												onValueChange={(value) => field.onChange(value[0])}
												className="w-full"
												rangeClassName="bg-gradient-to-l from-red-500 via-pink-500 to-blue-500 h-2 rounded-full"
												thumbClassName="bg-white border border-gray-300 w-4 h-4"
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
