import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function RiskRewardSkeleton() {
	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<Skeleton className="h-4 w-24 shrink-0" />
				<Separator className="flex-1" />
			</div>

			<div className="flex flex-col w-full items-start mt-4 space-y-4">
				{/* Label & ratio display */}
				<div className="flex flex-1 w-full justify-between items-center">
					<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
						<Skeleton className="h-10 w-10 rounded-md" />
						<div className="flex flex-col gap-2 mt-2 md:mt-0">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-3 w-52" />
						</div>
					</div>
					<Skeleton className="h-7 w-16 shrink-0" />
				</div>

				{/* Slider */}
				<Skeleton className="h-5 w-full rounded-full" />

				{/* Financial summary grid */}
				<div className="flex w-full flex-col mb-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border rounded-lg overflow-hidden">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="bg-background p-4 space-y-2">
								<Skeleton className="h-5 w-16 rounded-full" />
								<Skeleton className="h-8 w-28" />
								<Skeleton className="h-3 w-40" />
							</div>
						))}
					</div>

					{/* Note alert */}
					<Skeleton className="h-14 w-full rounded-lg mt-4" />
				</div>
			</div>
		</>
	);
}
