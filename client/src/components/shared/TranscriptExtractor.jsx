import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { UseAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { validateVideoUrl } from "@/lib/validateYoutubeUrl";

const TranscriptExtractor = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = UseAuth();

  const navigate = useNavigate();

  const extractTranscript = async () => {
    setError(null);

    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateVideoUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!isAuthenticated) {
        toast.warning("Authentication required", {
          description: "You need to login to access this page",
        });
        return null;
      }
      navigate(`/transcript/${url.split("=")[1]}`);
    } catch (err) {
      setError("Failed to extract transcript. Please try again.", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            YouTube Transcript Extractor
          </h2>
          <p className="text-gray-600">
            Enter a YouTube URL to extract its transcript
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Paste your YouTube URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button
            onClick={extractTranscript}
            disabled={isLoading}
            className="h-12 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              "Extract Transcript"
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && (
          <Card className="mt-6 border-dashed">
            <CardContent className="py-10">
              <div className="text-center text-gray-500">
                <p>
                  Enter a YouTube URL and click "Extract Transcript" to get
                  started
                </p>
                <p className="text-sm mt-2">
                  Supported formats: youtube.com/watch?v=VIDEO_ID or
                  youtu.be/VIDEO_ID
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranscriptExtractor;
