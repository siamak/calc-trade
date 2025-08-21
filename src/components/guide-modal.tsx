"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

export default function GuideModal() {
	const t = useTranslations("guide_modal");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const isSeen = window.localStorage.getItem(`guide`) === "true";

		if (!isSeen) {
			window.localStorage.setItem(`guide`, "true");
			setIsOpen(true);
		}
	}, []);

	const { isMobile } = useIsMobile();

	if (isMobile) {
		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="bottom" className="pb-4 rounded-t-2xl">
					<SheetHeader>
						<SheetTitle>{t("title")}</SheetTitle>
						<SheetDescription>{t("subtitle")}</SheetDescription>
					</SheetHeader>
					<div className="px-4 flex flex-col gap-2 items-end">
						<div className="text-sm text-muted-foreground">
							{t("description")}
						</div>
						<Button
							variant="outline"
							className="w-fit"
							onClick={() => setIsOpen(false)}
						>
							{t("cta")}
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen} modal>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-3xl font-bold tracking-tight">
						{t("title")}
					</DialogTitle>
					<DialogDescription className="my-2">
						{t("subtitle")}
					</DialogDescription>
				</DialogHeader>

				<div className="text-sm text-muted-foreground">{t("description")}</div>

				<DialogFooter>
					<Button
						variant="outline"
						className="w-fit"
						onClick={() => setIsOpen(false)}
					>
						{t("cta")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
