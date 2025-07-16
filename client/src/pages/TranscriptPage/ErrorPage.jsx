import { Button } from "@/components/ui/button";

export default function ErrorPage({ error }) {
  return (
    <div className="container h-[90vh] mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-card p-6 rounded-lg shadow-md border border-border w-full max-w-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-8 w-8 text-red-500"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Error Loading Transcript
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    </div>
  );
}
