import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { validatePlaylistUrl } from "@/lib/validateYoutubeUrl";
import PlaylistVideos from "./PlaylistVideos";
import TranscriptVideos from "./TranscriptVideos";
import { apiGet } from "@/lib/api/apiClient";

export default function PlaylistPage() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const [displayVideosMode, setDisplayVideosMode] = useState("playlist");
  const [transcriptedVideos, setTranscriptedVideos] = useState([]);

  const handleGetPlaylist = async () => {
    const playlistId = validatePlaylistUrl(playlistUrl);
    if (!playlistId) {
      setErrorMessage("Please enter a valid YouTube playlist URL");
      return;
    }

    try {
      setErrorMessage("");
      setIsLoading(true);

      const data = await apiGet(`/playlist?playlist_id=${playlistId}`);

      setPlaylistVideos(data.items || []);
      setDisplayVideosMode("playlist");
      setSelectedVideos([]);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setErrorMessage("Failed to fetch playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Extract from Playlist</h1>
          <p className="mt-2 text-lg text-gray-600">
            Extract transcripts from multiple videos in a YouTube playlist
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter YouTube Playlist URL</CardTitle>
              <CardDescription>
                Paste a YouTube playlist URL to fetch videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button
                  onClick={handleGetPlaylist}
                  disabled={isLoading}
                  className="h-12 bg-[#42A5F5] hover:bg-[#2196F3]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Get Playlist"
                  )}
                </Button>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {playlistVideos.length === 0 && !isLoading && (
            <Card className="border-dashed">
              <CardContent className="py-10">
                <div className="text-center text-gray-500">
                  <p>
                    Enter a YouTube playlist URL and click "Get Playlist" to
                    view videos
                  </p>
                  <p className="text-sm mt-2">
                    Supported formats: youtube.com/playlist?list=PLAYLIST_ID
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {displayVideosMode === "playlist" ? (
            <PlaylistVideos
              playlistVideos={playlistVideos}
              selectedVideos={selectedVideos}
              setSelectedVideos={setSelectedVideos}
              setErrorMessage={setErrorMessage}
              setDisplayedVideosMode={setDisplayVideosMode}
              setTranscriptedVideos={setTranscriptedVideos}
            />
          ) : (
            <TranscriptVideos
              transcriptedVideos={transcriptedVideos}
              setDisplayVideosMode={setDisplayVideosMode}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
