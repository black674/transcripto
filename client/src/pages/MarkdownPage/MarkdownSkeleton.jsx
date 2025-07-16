import { Skeleton } from "@/components/ui/skeleton";

export default function MarkdownSkeleton() {
  return (
    <div className="container min-h-[90vh] !max-w-3xl mx-auto py-10 prose">
      {/* Title */}
      <Skeleton className="h-12 w-3/4 mb-4" />
      
      {/* Date */}
      <Skeleton className="h-6 w-1/3 mb-8" />
      
      {/* First paragraph */}
      <Skeleton className="h-24 w-full mb-8" />
      
      {/* Section with heading and content */}
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-10/12 mb-8" />
      
      {/* List section */}
      <Skeleton className="h-8 w-1/2 mb-4" />
      <div className="pl-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-4/5 mb-8" />
      </div>
      
      {/* Another section */}
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-11/12 mb-2" />
      <Skeleton className="h-4 w-10/12 mb-8" />
      
      {/* Contact section */}
      <Skeleton className="h-8 w-1/3 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-8" />
      
      {/* Final paragraph */}
      <Skeleton className="h-16 w-full" />
    </div>
  );
} 