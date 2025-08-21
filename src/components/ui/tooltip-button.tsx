"use client";

import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { Button } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

export type TooltipButtonProps = ComponentPropsWithoutRef<typeof Button> & {
	tooltip: string | React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
};

export const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
	({ children, tooltip, side = "bottom", ...rest }, ref) => {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button {...rest} ref={ref}>
							{children}
							<span className="sr-only">{tooltip}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side={side}>{tooltip}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}
);

TooltipButton.displayName = "TooltipButton";
