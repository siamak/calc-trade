"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import useFormPersist from "react-hook-form-persist";
import {
	DollarSign,
	Loader2,
	Percent,
	DiamondPercent,
	ListRestart,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import TelegramMobile from "./telegram-mobile";

import { Badge } from "@/components/ui/badge";
import { TooltipButton } from "@/components/ui/tooltip-button";
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
import { HeaderPortal } from "./header";

const Spinner = () => (
	<div className="mx-auto my-8 size-5 border-[3px] border-secondary border-t-primary rounded-full animate-spin" />
);
const RiskReward = dynamic(() => import("./risk-rewards"), {
	loading: () => <Spinner />,
});

const Result = dynamic(() => import("./result"), {
	loading: () => <Spinner />,
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
		storage: typeof window !== "undefined" ? window.localStorage : undefined,
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

	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<div className="pr-2 rtl:pr-0 rtl:pl-2 text-center bg-background text-sm shrink-0 text-muted-foreground/70 uppercase">
					{t("balance.title")}
				</div>
				<Separator className="flex-1" />
			</div>
			<Form {...form}>
				<form>
					<div className="flex flex-col items-start mt-4 space-y-6">
						{/* Account Balance */}
						<FormField
							control={form.control}
							name="balance"
							render={({ field }) => (
								<FormItem className="w-full">
									<div>
										<FormLabel htmlFor={field.name}>
											{t("balance.label")}
										</FormLabel>
										<FormDescription className="text-xs text-muted-foreground">
											{t("balance.subtitle")}
										</FormDescription>
									</div>

									<FormControl>
										<div>
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
													onValueChange={(v: any) => {
														const value = v.floatValue;
														const cleanValue = value !== undefined ? value : 0;
														field.onChange(cleanValue);
													}}
													value={field.value ?? ""}
												/>
											</div>
											<FormMessage className="text-xs text-end mt-1.5" />
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Risk */}
						<FormField
							control={form.control}
							name="risk"
							render={({ field }) => (
								<FormItem className="w-full">
									<div>
										<FormLabel htmlFor={field.name}>
											{t("risk.label")}
										</FormLabel>
										<FormDescription className="text-xs text-muted-foreground">
											{t("risk.subtitle")}
										</FormDescription>
									</div>
									<FormControl>
										<div>
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
													suffix="%"
													type="text"
													inputMode="decimal"
													id={field.name}
													fixedDecimalScale
													placeholder={t("risk.placeholder")}
													onValueChange={(v: any) => {
														const value = v.floatValue;
														const cleanValue = value !== undefined ? value : 0;
														field.onChange(cleanValue);
													}}
													value={field.value ?? ""}
												/>
											</div>
											<FormMessage className="text-xs text-end mt-1.5" />
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Stoploss */}
						<FormField
							control={form.control}
							name="stoploss"
							render={({ field }) => (
								<FormItem className="w-full">
									<div>
										<FormLabel htmlFor={field.name}>
											{t("stoploss.label")}
										</FormLabel>
										<FormDescription className="text-xs text-muted-foreground">
											{t("stoploss.subtitle")}
										</FormDescription>
									</div>

									<FormControl>
										<div>
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
													suffix="%"
													fixedDecimalScale
													type="text"
													inputMode="decimal"
													placeholder={t("stoploss.placeholder")}
													id={field.name}
													onValueChange={(v: any) => {
														const value = v.floatValue;
														const cleanValue = value !== undefined ? value : 0;
														field.onChange(cleanValue);
													}}
													value={field.value ?? ""}
												/>
											</div>
											<FormMessage className="text-xs text-end mt-1.5" />
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Leverage */}
						<FormField
							control={form.control}
							name="leverage"
							render={({ field }) => (
								<FormItem className="w-full flex flex-col items-stretch gap-0">
									<div className="flex items-center gap-2">
										<FormLabel htmlFor={field.name}>
											{t("leverage.label")}
										</FormLabel>
										<Badge variant="secondary" className="text-xs">
											{field.value === 1
												? t("leverage.spot")
												: t("leverage.futures")}
										</Badge>
									</div>
									<FormDescription className="text-xs text-muted-foreground">
										{t("leverage.subtitle")}
									</FormDescription>
									<FormControl>
										<div className="flex flex-row items-center gap-2 pt-2 pb-0">
											<div className="flex-1 w-full order-0">
												<Slider
													min={1}
													max={100}
													step={1}
													value={[field.value ?? 1]}
													onValueChange={(value) => field.onChange(value[0])}
													className="w-full"
													trackClassName="bg-muted rounded-full"
													rangeClassName="bg-gradient-to-l from-red-500 via-pink-500 to-blue-500 rounded-full"
													thumbClassName="w-6 rounded-full bg-card border-2 border-red-500 focus-visible:border-red-600 focus-visible:ring-0 h-5"
												/>
											</div>
											<div className="shrink-0 w-16">
												<NumericFormat
													customInput={Input}
													className="text-center shadow-none border-transparent hover:border-border transition-colors !bg-transparent w-full font-bold !text-lg px-0"
													allowNegative={false}
													thousandSeparator={false}
													decimalScale={0}
													type="text"
													inputMode="numeric"
													id={field.name}
													onValueChange={(v: any) => {
														const value = v.floatValue;
														const cleanValue = value !== undefined ? value : 1;
														field.onChange(cleanValue);
													}}
													value={field.value ?? 1}
													min={1}
													max={100}
												/>
											</div>
										</div>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<HeaderPortal>
							<TooltipButton
								variant="ghost"
								size="icon"
								onClick={() =>
									form.reset({
										balance: 0,
										risk: 0,
										stoploss: 0,
										leverage: 10,
									})
								}
								tooltip={t("actions.clear")}
							>
								{form.formState.isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								<ListRestart />
							</TooltipButton>
						</HeaderPortal>
					</div>

					<Result
						marginSize={marginSize}
						balance={calculator.balance}
						riskCapital={calculator.riskCapital}
						leverage={calculator.leverage}
						stoploss={calculator.stoploss}
						sizeUSDT={calculator.sizeUSDT}
					/>

					<RiskReward
						lossRate={calculator.riskCapital}
						balance={calculator.balance}
						stoploss={calculator.stoploss}
						leverage={calculator.leverage}
					/>

					{locale === "fa" && <TelegramMobile />}
				</form>
			</Form>
		</>
	);
}
