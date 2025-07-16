import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "sonner";
import { apiPost } from "@/lib/api/apiClient";
import { UseAuth } from "@/lib/auth/AuthContext";

export default function PlaylistVideos({
  playlistVideos,
  selectedVideos,
  setSelectedVideos,
  setErrorMessage,
  setDisplayedVideosMode,
  setTranscriptedVideos,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState([]);
  const { getProfile } = UseAuth();
  const selectedVideoCount = selectedVideos.length;

  const handleVideoSelection = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos((prev) => prev.filter((id) => id !== videoId));
    } else {
      setSelectedVideos((prev) => [...prev, videoId]);
    }
  };

  const handleFetchSelected = () => {
    const hasSelectedVideos = selectedVideoCount > 0;

    if (!hasSelectedVideos) {
      setErrorMessage("Please select at least one video");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmFetch = async () => {
    setErrorMessage("");
    setIsModalOpen(false);
    setIsLoading(true);
    setLoadingMessages([
      "Fetching videos...",
      "Processing videos...",
      "Transcribing videos...",
    ]);

    try {
      const profile = await getProfile();
      const remainingTranscripts =
        profile.transcript_limit - profile?.transcript_count >=
        selectedVideoCount;

      if (!remainingTranscripts) {
        toast.warning("remaining transcripts", {
          description:
            "the selected videos are more than your remaining transcripts",
        });
        return;
      }

      const data = await apiPost(`/transcript`, selectedVideos);

      setTranscriptedVideos(data.videos);
      setDisplayedVideosMode("transcripts");
      toast.info("remaining transcripts", {
        description: data.remaining_transcripts,
      });
    } catch (error) {
      console.error("Error fetching transcript:", error);
      if (error.status === 403) {
        toast.error("remaining transcripts", {
          description:
            "the selected videos are more than your remaining transcripts",
        });
      }
      setErrorMessage("Failed to fetch transcript");
    } finally {
      setIsLoading(false);
    }
  };

  if (playlistVideos.length > 0) {
    return (
      <>
        <LoadingOverlay isLoading={isLoading} messages={loadingMessages} />
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Playlist Videos ({playlistVideos.length})
            </h2>
            <Button
              onClick={handleFetchSelected}
              disabled={selectedVideoCount === 0}
              className="bg-[#42A5F5] hover:bg-[#2196F3]"
            >
              Fetch Selected ({selectedVideoCount})
            </Button>
          </div>

          <Card className="overflow-hidden border">
            <div className="h-[600px]">
              <ScrollArea className="h-full pr-2 overflow-hidden">
                {playlistVideos.map((video, index) => {
                  const isSelected = selectedVideos.includes(
                    video.snippet.resourceId.videoId
                  );
                  return (
                    <div
                      key={video.snippet.resourceId.videoId}
                      className={`flex p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        handleVideoSelection(video.snippet.resourceId.videoId)
                      }
                    >
                      <div className="flex-shrink-0 mr-3 flex items-center">
                        <Checkbox
                          id={`video-${video.snippet.resourceId.videoId}`}
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleVideoSelection(
                              video.snippet.resourceId.videoId
                            )
                          }
                          className="h-5 w-5"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div
                        className="flex-shrink-0 mr-4 relative"
                        style={{ width: "160px", height: "90px" }}
                      >
                        <img
                          src={video.snippet.thumbnails.high.url}
                          alt={video.snippet.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3
                          className="font-semibold text-base line-clamp-2"
                          title={video.snippet.title}
                        >
                          ({index + 1}) {video.snippet.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </div>
          </Card>
        </div>

        <ConfirmModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedVideoCount={selectedVideoCount}
          handleConfirmFetch={handleConfirmFetch}
        />
      </>
    );
  }
}
