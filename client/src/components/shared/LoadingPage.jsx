import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Main loading animation */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Skeleton className="absolute inset-0 h-24 w-24 rounded-full opacity-30" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-semibold text-primary">Loading</h2>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150" />
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300" />
          </div>
        </div>

        {/* Content skeleton placeholders */}
        <div className="w-full max-w-md flex flex-col gap-3 mt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
