import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TranscriptDisplaySkeleton() {
  return (
    <div className="w-full lg:w-[47%] flex flex-col">
      <Card className="p-4 flex flex-col h-[570px]">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>

        {/* Search input skeleton */}
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Transcript content skeleton */}
        <div className="flex-grow space-y-3">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
