import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="container min-h-[90vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-8xl font-bold text-primary">404</h1>

        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>

        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. The page might
          have been removed, renamed, or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="default" onClick={() => navigate("/")}>
            Return Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
