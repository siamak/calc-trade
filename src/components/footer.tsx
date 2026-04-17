"use client";

import { useTranslations } from "next-intl";
import { GitHubStarsButton } from "@/components/animate-ui/buttons/github-stars";
import { MessageCircleWarning } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";

export default function Footer() {
	const t = useTranslations("footer");
	const analytics = useAnalytics();

	return (
		<footer>
			<div className="flex items-start gap-2 mb-4 text-muted-foreground p-4 bg-muted/30 rounded-lg">
				<MessageCircleWarning className="size-4 max-md:mt-0.5" />
				<p className="text-sm"> {t("disclaimer")}</p>
			</div>

			<div className="flex flex-wrap mb-4 mt-10 justify-between items-center border-t border-t-border/40 pt-4">

				<p className="text-center text-muted-foreground">
					{t("copyright.text")}{" "}
					<a
						className="font-medium text-primary hover:text-muted-foreground transition-colors"
						target="_blank"
						href="https://github.com/siamak"
						rel="noopener noreferrer"
						onClick={() =>
							analytics.externalLinkClicked(
								"https://github.com/siamak",
								"github-profile"
							)
						}
					>
						{t("copyright.name")}
					</a>
				</p>

				<GitHubStarsButton
					username="siamak"
					repo="calc-trade"
					className="h-8 px-3! rounded-full text-sm"
				/>
			</div>

		</footer>
	);
}
