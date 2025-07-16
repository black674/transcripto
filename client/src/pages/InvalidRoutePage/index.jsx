import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function InvalidRoutePage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="container min-h-[90vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-lg">
        <div className="flex justify-center">
          <AlertCircle className="h-24 w-24 text-destructive animate-pulse" />
        </div>

        <h2 className="text-2xl font-semibold text-foreground">
          Invalid Route
        </h2>

        <div className="bg-muted/50 py-2 px-4 rounded-md">
          <code className="text-sm text-muted-foreground break-all">
            {location.pathname}
          </code>
        </div>

        <p className="text-muted-foreground">
          The route you're trying to access doesn't exist in our application.
          Please check the URL or navigate to an available page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="default" onClick={() => navigate("/")}>
            Go to Homepage
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Return to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}
