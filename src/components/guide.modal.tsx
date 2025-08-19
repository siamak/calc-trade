"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function GuideModal() {
	const t = useTranslations("guide_modal");
	const [isOpen, setIsOpen] = useState(false);
	const params = useParams();
	const locale = params.locale as string;

	useEffect(() => {
		const isSeen =
			window.localStorage.getItem(`@guide_modal_${locale}`) === "true";

		if (!isSeen) {
			window.localStorage.setItem(`@guide_modal_${locale}`, "true");
			setIsOpen(true);
		}
	}, [locale]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="relative">
				<div className="absolute -top-9 left-1/2 transform -translate-x-1/2">
					<Image
						src={"/icon.png"}
						alt="Money icon"
						quality={100}
						width={80}
						height={80}
					/>
				</div>

				<DialogHeader className="mt-8 text-center">
					<DialogTitle className="text-3xl font-bold tracking-tight">
						{t("title")}
					</DialogTitle>
					<DialogDescription className="max-w-[300px] mx-auto my-2">
						{t("subtitle")}
					</DialogDescription>
				</DialogHeader>

				<div className="text-sm opacity-90 mt-4">{t("description")}</div>

				<DialogFooter>
					<Button onClick={() => setIsOpen(false)}>{t("cta")}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
