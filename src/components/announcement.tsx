"use client";

import { InfoIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

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

// Sub-components for better separation of concerns
interface BannerProps {
	onOpen: () => void;
	onClose: () => void;
	title: string;
	subtitle: string;
}

function AnnouncementBanner({ onOpen, onClose, title, subtitle }: BannerProps) {
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
				aria-label="Close announcement"
			>
				<X />
			</Button>
		</div>
	);
}

interface ModalContentProps {
	title: string;
	subtitle: string;
	benefits: {
		title: string;
		points: Record<string, string>;
	};
	how: {
		title: string;
		points: Record<string, string>;
	};
	tips: {
		title: string;
		points: Record<string, string>;
	};
	disclaimer: string;
	cta: string;
}

function ModalContent({
	title,
	subtitle,
	benefits,
	how,
	tips,
	disclaimer,
	cta,
}: ModalContentProps) {
	const benefitPoints = useMemo(
		() => Object.values(benefits.points),
		[benefits.points]
	);
	const howPoints = useMemo(() => Object.values(how.points), [how.points]);
	const tipPoints = useMemo(() => Object.values(tips.points), [tips.points]);

	return (
		<>
			<div className="space-y-8 p-4 md:p-6">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">{title}</h1>
					<p className="text-muted-foreground">{subtitle}</p>
				</div>

				<section className="space-y-3">
					<h2 className="text-xl font-medium">{benefits.title}</h2>
					<ul className="list-disc ps-6 space-y-2">
						{benefitPoints.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-medium">{how.title}</h2>
					<ul className="list-disc ps-6 space-y-2">
						{howPoints.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-medium">{tips.title}</h2>
					<ul className="list-disc ps-6 space-y-2">
						{tipPoints.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				</section>

				<div className="border rounded-lg p-4 bg-muted/30">
					<p className="text-sm text-muted-foreground">{disclaimer}</p>
				</div>
			</div>
			<DialogFooter className="sticky bottom-0 bg-background pt-4 border-t p-4 md:p-6">
				<DialogClose asChild>
					<Button variant="outline">{cta}</Button>
				</DialogClose>
			</DialogFooter>
		</>
	);
}

// Main component
export function Announcement() {
	const t = useTranslations("learn");
	const ta = useTranslations("announcement");

	const [isOpen, setIsOpen] = useState(false);
	const [isClosed, setIsClosed] = useState(false);

	const handleOpen = useCallback(() => setIsOpen(true), []);
	const handleClose = useCallback(() => setIsClosed(true), []);

	// Memoize translation data to prevent unnecessary re-renders
	const modalData = useMemo(
		() => ({
			title: t("title"),
			subtitle: t("subtitle"),
			benefits: {
				title: t("benefits.title"),
				points: {
					capital: t("benefits.points.capital"),
					consistency: t("benefits.points.consistency"),
					emotions: t("benefits.points.emotions"),
					survivability: t("benefits.points.survivability"),
					compounding: t("benefits.points.compounding"),
				},
			},
			how: {
				title: t("how.title"),
				points: {
					position: t("how.points.position"),
					risk: t("how.points.risk"),
					stoploss: t("how.points.stoploss"),
					leverage: t("how.points.leverage"),
					rr: t("how.points.rr"),
				},
			},
			tips: {
				title: t("tips.title"),
				points: {
					journal: t("tips.points.journal"),
					fixedRisk: t("tips.points.fixedRisk"),
					realistic: t("tips.points.realistic"),
					fees: t("tips.points.fees"),
				},
			},
			disclaimer: t("disclaimer"),
			cta: t("cta"),
		}),
		[t]
	);

	return (
		<AnimatePresence mode="wait">
			{!isClosed && (
				<motion.div
					key="announcement-banner"
					variants={bannerVariants}
					initial="visible"
					animate="visible"
					exit="hidden"
					transition={transition}
					className="relative"
				>
					<div className="fixed inset-x-0 top-0 z-10">
						<Dialog modal open={isOpen} onOpenChange={setIsOpen}>
							<AnnouncementBanner
								onOpen={handleOpen}
								onClose={handleClose}
								title={ta("title")}
								subtitle={ta("subtitle")}
							/>
							<DialogContent
								showCloseButton={false}
								className="sm:max-w-3xl max-h-[80vh] overflow-y-auto p-0"
							>
								<ModalContent {...modalData} />
							</DialogContent>
						</Dialog>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
