"use client";

import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

const TELEGRAM_URL = "https://t.me/+UTSJBK_CmZszYzRk";

export default function TelegramMobile() {
	const analytics = useAnalytics();

	return (
		<div className="relative flex flex-col gap-3 items-center justify-center mb-6 border border-blue-400 dark:border-blue-300 p-6 bg-blue-500/20 shadow-lg rounded-lg">
			<h3 className="text-lg font-semibold">
				مانی‌فای - مرجع لحظه‌ای نرخ تتر، ارز، طلا و کریپتو در ایران
			</h3>

			<Button asChild className="rounded-full">
				<a
					href={TELEGRAM_URL}
					target="_blank"
					rel="noopener noreferrer"
					onClick={() =>
						analytics.externalLinkClicked(TELEGRAM_URL, "telegram")
					}
				>
					<Link />
					کانال تلگرام
				</a>
			</Button>
		</div>
	);
}
