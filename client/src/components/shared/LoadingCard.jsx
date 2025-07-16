import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard({
  title = true,
  description = true,
  contentLines = 3,
  footer = false,
  className = "",
}) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="space-y-2">
        {title && <Skeleton className="h-5 w-2/5" />}
        {description && <Skeleton className="h-4 w-3/5" />}
      </CardHeader>

      <CardContent className="space-y-4">
        {Array(contentLines)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${i % 2 === 0 ? "w-full" : "w-4/5"}`}
            />
          ))}
      </CardContent>

      {footer && (
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      )}
    </Card>
  );
}
