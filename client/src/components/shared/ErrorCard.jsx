import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ErrorCard({
  title = "Error Occurred",
  message,
  retryAction,
  retryText = "Retry",
  className = "",
}) {
  return (
    <Card className={`w-full border-destructive/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{message.toString()}</p>
      </CardContent>

      {retryAction && (
        <CardFooter>
          <Button
            variant="outline"
            onClick={retryAction}
            className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            {retryText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
