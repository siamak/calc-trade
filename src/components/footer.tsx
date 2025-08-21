import { useTranslations } from "next-intl";
import { GitHubStarsButton } from "@/components/animate-ui/buttons/github-stars";
import { MessageCircleWarning } from "lucide-react";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer>
			<div className="flex items-center gap-2 mb-4 justify-center text-muted-foreground p-4 bg-muted/30 rounded-lg">
				<MessageCircleWarning className="size-4" />
				<p className="text-sm"> {t("disclaimer")}</p>
			</div>
			<p className="text-center text-muted-foreground my-3">
				{t("copyright.text")}{" "}
				<a
					className="font-medium text-primary hover:text-muted-foreground transition-colors"
					target="_blank"
					href="https://github.com/siamak"
					rel="noopener noreferrer"
				>
					{t("copyright.name")}
				</a>
				.
			</p>

			<div className="flex justify-center my-5">
				<GitHubStarsButton username="siamak" repo="calc-trade" />
			</div>
		</footer>
	);
}
