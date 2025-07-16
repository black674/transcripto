import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import VideoCard from "@/components/shared/VideoCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiGet } from "@/lib/api/apiClient";
import Pagination from "./Pagination";

const HistoryPage = () => {
  const [data, setData] = useState({});
  const [offest, setOffest] = useState(0);
  const limit = 12;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiGet(
          `/transcript?limit=${limit}&offset=${offest}`
        );

        setData(data);
      } catch (error) {
        console.error("Error fetching video history:", error);
        setError("Failed to fetch video history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [offest]);

  const VideoCardSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-2" />
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Your Video History</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <VideoCardSkeleton key={index} />
            ))}
        </div>
      ) : data?.transcripts?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.transcripts.map((transcript) => (
              <VideoCard
                key={transcript.data.video_id}
                video={transcript.data}
              />
            ))}
          </div>
          <Pagination
            offest={offest}
            setOffest={setOffest}
            limit={limit}
            total_pages={data.total_pages}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📺</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No videos in your history
          </h3>
          <p className="text-gray-500">
            Videos will appear here after you extract transcripts
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
