import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, ListRestart } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type { Button } from "./ui/button";
import { TooltipButton } from "./ui/tooltip-button";

type ResetFormButtonProps = ComponentPropsWithoutRef<typeof Button> & {
	isSubmitting: boolean;
	onReset: () => void;
};

export const ResetFormButton = forwardRef<
	HTMLButtonElement,
	ResetFormButtonProps
>(({ isSubmitting, onReset, ...rest }, ref) => {
	const t = useTranslations("form");

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<TooltipButton
					variant="ghost"
					size="icon"
					{...rest}
					tooltip={t("actions.clear")}
					ref={ref}
				>
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					<ListRestart />
				</TooltipButton>
			</AlertDialogTrigger>
			<AlertDialogContent className="rtl:text-right">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("actions.clear")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("actions.clear_description")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
					<AlertDialogAction
						onClick={onReset}
						className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
					>
						<ListRestart />
						{t("actions.clear_button")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
});

ResetFormButton.displayName = "ResetFormButton";
