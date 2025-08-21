"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TelegramCTA() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setIsOpen(true);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed left-0 md:left-4 bottom-0 md:bottom-4 right-0 md:right-auto pt-0 md:pt-6 pb-0 md:pb-8 px-4 md:px-10 hidden md:flex flex-col text-card-foreground bg-card rounded-none md:rounded-2xl shadow-lg text-left md:text-center z-10">
			<button
				className="p-2 top-4 left-4 bg-muted/50 hover:bg-muted inline-flex absolute text-muted-foreground z-20 rounded-full transition-colors"
				onClick={() => setIsOpen(false)}
			>
				<X className="w-6 h-6" />
			</button>

			<Image
				alt="مرجع قیمت تتر در ایران"
				src="/moneify.png"
				width={180}
				height={190}
			/>

			<div>
				<h3 className="text-lg font-semibold mt-[-2rem] mb-3">
					مرجع قیمت تتر در ایران
				</h3>
				<p>💵 قصد خرید یا فروش تتر دارید؟</p>
			</div>
			<Button asChild className="mt-4 rounded-full w-32 md:w-auto">
				<a
					href="https://t.me/+UTSJBK_CmZszYzRk"
					target="_blank"
					rel="noopener noreferrer"
				>
					کانال تلگرام
				</a>
			</Button>
		</div>
	);
}
