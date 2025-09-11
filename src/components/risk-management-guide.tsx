"use client";

import { InfoIcon, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQueryState } from "nuqs";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { loadMarkdownContent } from "@/lib/markdown-loader";
import { useLocale } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Animation variants for better maintainability
const bannerVariants: Variants = {
	visible: {
		opacity: 1,
		height: "46px",
		pointerEvents: "auto",
	},
	hidden: {
		opacity: 0,
		height: "0px",
		pointerEvents: "none",
	},
};

const transition = {
	duration: 0.3,
	ease: "easeInOut" as const,
};

// Banner component with internal state
interface RiskManagementBannerProps {
	onOpen: () => void;
	onClose: () => void;
	title: string;
	subtitle: string;
}

function RiskManagementBanner({
	onOpen,
	onClose,
	title,
	subtitle,
}: RiskManagementBannerProps) {
	return (
		<div className="flex justify-between items-center w-full border text-sm focus:outline-none focus:ring-2 outline-none hover:bg-orange-500/20 focus:ring-orange-500/50 gap-2 p-1 rtl:pl-2 font-medium shadow-sm shadow-orange-500/10 transition-all hover:shadow-md border-foreground/5 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
			<div
				className="flex-1 flex items-center gap-2 cursor-pointer"
				onClick={onOpen}
			>
				<span className="inline-flex items-center gap-1 whitespace-nowrap text-nowrap shrink-0 rounded-full p-1 px-2 text-sm bg-orange-50 dark:bg-orange-900 shadow-sm">
					<InfoIcon className="size-3" />
					{subtitle}
				</span>
				<div className="flex items-center gap-2 truncate py-1">{title}</div>
			</div>
			<Button
				variant="ghost"
				className="hover:bg-orange-500/20 hover:text-orange-500"
				size="sm"
				onClick={onClose}
				aria-label="Close risk management guide"
			>
				<X />
			</Button>
		</div>
	);
}

// Sheet content component
interface RiskManagementSheetProps {
	title: string;
	subtitle: string;
	content: string;
	cta: string;
	isLoading: boolean;
	isRTL: boolean;
}

function RiskManagementSheet({
	title,
	subtitle,
	content,
	cta,
	isLoading,
	isRTL,
}: RiskManagementSheetProps) {
	return (
		<>
			<SheetHeader>
				<SheetTitle className="text-2xl font-semibold">{title}</SheetTitle>
				<SheetDescription className="text-base">{subtitle}</SheetDescription>
			</SheetHeader>

			<div className="h-full flex flex-col flex-1 px-4 py-2 overflow-y-auto break-words">
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="animate-spin" />
					</div>
				) : (
					<div
						className={cn(
							"prose prose-base max-w-none dark:prose-invert space-y-4 [&_ul]:ps-2 [&_ul]:list-disc [&_li]:mb-4",
							isRTL && "rtl [&_*]:rtl font-persian text-right"
						)}
						dir={isRTL ? "rtl" : "ltr"}
					>
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
					</div>
				)}
			</div>

			<SheetFooter className="border-t pt-4">
				<SheetClose asChild>
					<Button variant="outline" className="w-full">
						{cta}
					</Button>
				</SheetClose>
			</SheetFooter>
		</>
	);
}

// Main component
export function RiskManagementGuide() {
	const t = useTranslations("learn");
	const ta = useTranslations("announcement");
	const locale = useLocale();

	const isRTL = locale === "fa";

	// Use nuqs for URL-based state management
	const [guideParam, setGuideParam] = useQueryState("learn");
	const isGuideOpen = guideParam === "open";

	const [isClosed, setIsClosed] = useState(false);
	const [markdownContent, setMarkdownContent] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	const handleOpen = useCallback(() => setGuideParam("open"), [setGuideParam]);
	const handleClose = useCallback(() => {
		setIsClosed(true);
		setGuideParam(null);
	}, [setGuideParam]);

	// Memoize translation data to prevent unnecessary re-renders
	const modalData = useMemo(
		() => ({
			title: t("title"),
			subtitle: t("subtitle"),
			cta: "Got it!",
		}),
		[t]
	);

	// Load markdown content based on locale
	useEffect(() => {
		const loadContent = async () => {
			setIsLoading(true);
			try {
				const content = await loadMarkdownContent(locale, "learn");
				setMarkdownContent(content);
			} catch (error) {
				console.error("Failed to load markdown content:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadContent();
	}, [locale]);

	return (
		<>
			<AnimatePresence mode="wait">
				{!isClosed && (
					<motion.div
						key="risk-management-banner"
						variants={bannerVariants}
						initial="visible"
						animate="visible"
						exit="hidden"
						transition={transition}
						className="relative"
					>
						<div className="fixed inset-x-0 top-0 z-10">
							<RiskManagementBanner
								onOpen={handleOpen}
								onClose={handleClose}
								title={ta("title")}
								subtitle={ta("subtitle")}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<Sheet
				modal
				open={isGuideOpen}
				onOpenChange={(open) => setGuideParam(open ? "open" : null)}
			>
				<SheetContent
					side={isRTL ? "left" : "right"}
					className="w-full sm:max-w-2xl gap-0 flex flex-col"
				>
					<RiskManagementSheet
						{...modalData}
						content={markdownContent}
						isLoading={isLoading}
						isRTL={isRTL}
					/>
				</SheetContent>
			</Sheet>
		</>
	);
}
