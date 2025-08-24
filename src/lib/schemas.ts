import { z } from "zod";

export const calculatorFormSchema = z.object({
	balance: z
		.number()
		.min(0, "Balance must be a positive number")
		.max(1000000, "Balance cannot exceed 1,000,000"),
	risk: z
		.number()
		.min(0, "Risk must be a positive number")
		.max(100, "Risk cannot exceed 100%"),
	stoploss: z
		.number()
		.min(0, "Stop loss must be a positive number")
		.max(100, "Stop loss cannot exceed 100%"),
	leverage: z
		.number()
		.min(1, "Leverage must be at least 1")
		.max(100, "Leverage cannot exceed 100"),

	rewardRatio: z
		.number()
		.min(1, "Reward ratio must be at least 1")
		.max(50, "Reward ratio cannot exceed 50"),
});

export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;
