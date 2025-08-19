import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("footer");

	return (
		<footer>
			<p className="text-center text-muted-foreground mt-4 italic">
				{t("disclaimer")}
			</p>

			<p className="text-center text-muted-foreground my-3">
				{t("copyright.text")}{" "}
				<a
					className="font-medium text-primary hover:text-muted-foreground transition-colors"
					target="_blank"
					href="https://m.siamak.me/"
					rel="noopener noreferrer"
				>
					{t("copyright.name")}
				</a>
				.
			</p>

			<div className="flex justify-center my-5">
				<iframe
					src="https://ghbtns.com/github-btn.html?user=siamak&repo=calc-trade&type=star&count=true&size=large"
					frameBorder="0"
					scrolling="0"
					width="120"
					height="30"
					title="GitHub"
				></iframe>
			</div>
		</footer>
	);
}
