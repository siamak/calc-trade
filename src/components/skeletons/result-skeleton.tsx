import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ResultSkeleton() {
	return (
		<>
			<div className="relative mt-8 mb-4 flex items-center justify-center gap-2">
				<Skeleton className="h-4 w-16 shrink-0" />
				<Separator className="flex-1" />
			</div>

			<div className="flex flex-col items-start mt-4 space-y-6">
				{/* Risked Capital row */}
				<div className="flex flex-1 w-full justify-between items-center">
					<div className="flex flex-col md:flex-row items-start md:items-center space-y-0 md:space-x-4">
						<Skeleton className="h-10 w-10 rounded-md" />
						<div className="flex flex-col items-start gap-2 mt-2 md:mt-0">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-52" />
						</div>
					</div>
					<Skeleton className="h-8 w-28 shrink-0" />
				</div>

				{/* Margin & Size grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
					{[0, 1].map((i) => (
						<div key={i} className="flex flex-col gap-2">
							<Skeleton className="h-3 w-20" />
							<div className="flex items-center justify-between">
								<Skeleton className="h-7 w-24" />
								<Skeleton className="h-8 w-8 rounded-md" />
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
