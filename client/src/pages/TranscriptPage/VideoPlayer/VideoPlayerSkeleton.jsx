import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoPlayerSkeleton() {
  const playerRef = useRef(null);
  const [videoHeight, setVideoHeight] = useState(480);

  useEffect(() => {
    const handleResize = () => {
      if (playerRef.current) {
        const width = playerRef.current.clientWidth;
        setVideoHeight(width * 0.5625);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [playerRef]);

  return (
    <div className="w-full lg:w-[53%] flex flex-col">
      <div
        ref={playerRef}
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${videoHeight}px` }}
      >
        <Skeleton className="w-full h-full" />
      </div>
      <div className="mt-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />

        <Card>
          <CardContent className="p-4 grid gap-3">
            {/* Category skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Duration skeleton */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Keywords skeleton */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-18 rounded-full" />
              </div>
            </div>

            {/* Channel ID skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Video ID skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
