import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TelegramMobile() {
	return (
		<div className="relative flex flex-col items-start mt-4 border border-blue-400 dark:border-blue-300 p-4 md:p-8 bg-card shadow-lg rounded-lg">
			<div className="flex items-center">
				<Image
					alt="مرجع قیمت تتر در ایران"
					src="/moneify.png"
					className="dark:hidden"
					width={72}
					height={72}
				/>
				<Image
					alt="مرجع قیمت تتر در ایران"
					src="/moneify-light.png"
					className="hidden dark:block"
					width={72}
					height={72}
				/>

				<div>
					<h3 className="mt-[-0.75rem] text-lg font-semibold mb-2">
						مرجع قیمت تتر در ایران
					</h3>
					<p className="opacity-50">💵 قصد خرید یا فروش تتر دارید؟</p>
				</div>
			</div>

			<Button asChild className="mt-0 rounded-full">
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
