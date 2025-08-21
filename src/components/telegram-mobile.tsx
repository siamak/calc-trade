import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function TelegramMobile() {
	return (
		<div className="relative flex flex-col gap-3 items-center justify-center mb-6 border border-blue-400 dark:border-blue-300 p-6 bg-blue-500/20 shadow-lg rounded-lg">
			<h3 className="text-lg font-semibold">
				مانی‌فای - مرجع لحظه‌ای نرخ تتر، ارز، طلا و کریپتو در ایران
			</h3>

			<Button asChild className="rounded-full">
				<a
					href="https://t.me/+UTSJBK_CmZszYzRk"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Link />
					کانال تلگرام
				</a>
			</Button>
		</div>
	);
}
