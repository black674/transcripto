import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "@/components/LoadingOverlay";
import VideoPlayer from "./VideoPlayer";
import VideoPlayerSkeleton from "./VideoPlayer/VideoPlayerSkeleton";
import TranscriptDisplay from "./TranscriptDisplay";
import TranscriptDisplaySkeleton from "./TranscriptDisplay/TranscriptDisplaySkeleton";
import ChatAssistant from "./ChatAssistant";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPost } from "@/lib/api/apiClient";
import ErrorPage from "./ErrorPage";
import { UseTranscript } from "@/lib/transcriptContext/TranscriptContext";

const TranscriptPage = () => {
  const { videoId } = useParams();
  const {
    videoDetails,
    setVideoDetails,
    selectedTranscript,
    setSelectedTranscript,
  } = UseTranscript();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);
        setLoadingMessages([
          "Initializing connection...",
          "Fetching video details...",
          "Loading transcript data...",
          "Processing content...",
          "Almost there...",
        ]);

        const data = await apiPost(`/transcript`, [videoId]);

        setVideoDetails(data.videos[0]);
        setSelectedTranscript(data.videos[0].track?.[0] || null);

        toast.info("remaining transcripts", {
          description: data.remaining_transcripts.toString(),
          variant: "default",
        });
      } catch (error) {
        console.error("Error fetching transcript:", error);

        if (error.status === 403) {
          toast.error("remaining transcripts", {
            description: "You have no remaining transcripts",
          });
          navigate("/pricing");
        }

        setError("Failed to fetch transcript");
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [videoId, navigate, setVideoDetails, setSelectedTranscript]);

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-6 flex flex-col">
      <LoadingOverlay isLoading={loading} messages={loadingMessages} />

      {loading ? (
        <Skeleton className="h-8 w-2/3 max-w-md mb-6" />
      ) : (
        <h1 className="text-2xl font-bold mb-6 max-w-[75%]">
          {videoDetails?.title}
        </h1>
      )}

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {loading ? (
          <>
            <VideoPlayerSkeleton />
            <TranscriptDisplaySkeleton />
          </>
        ) : (
          <>
            <VideoPlayer />
            <TranscriptDisplay />
          </>
        )}
      </div>
      {loading ||
      !videoDetails.track?.[0]?.transcript?.[0] ||
      videoDetails.track?.[0]?.transcript?.error ? null : (
        <ChatAssistant transcript={selectedTranscript.transcript} />
      )}
    </div>
  );
};

export default TranscriptPage;
