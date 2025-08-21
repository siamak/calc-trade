"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { TooltipButton } from "./ui/tooltip-button";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<TooltipButton
			tooltip="Toggle theme"
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
		</TooltipButton>
	);
}
