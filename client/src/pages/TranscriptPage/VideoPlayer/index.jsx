import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  InfoIcon,
  PersonStandingIcon,
  TagIcon,
  VideoIcon,
} from "lucide-react";
import { copyToClipboard } from "@/lib/copyToClipboard";
import YouTube from "react-youtube";
import { formatSecondsToHMS } from "@/lib/formatTime";
import { UseTranscript } from "@/lib/transcriptContext/TranscriptContext";

export default function VideoPlayer() {
  const {
    playerRef,
    videoDetails: {
      microformat: { playerMicroformatRenderer: videoDetails },
    },
  } = UseTranscript();
  const [videoHeight, setVideoHeight] = useState(480);
  const [playerWidth, setPlayerWidth] = useState(853);
  const { videoId } = useParams();

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(".youtube-container");
      if (container) {
        const width = container.clientWidth;
        setPlayerWidth(width);
        setVideoHeight(width * 0.5625);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const opts = {
    height: String(videoHeight),
    width: String(playerWidth),
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <Card className="w-full lg:w-[53%] flex flex-col">
      <CardContent className="p-4 grid gap-3 text-sm">
        <div
          className="w-full bg-black rounded-lg overflow-hidden youtube-container"
          style={{ height: `${videoHeight}px` }}
        >
          {videoId ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              No video selected
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {videoDetails?.category && (
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Category:</span>
              <span>{videoDetails?.category}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {videoDetails?.lengthSeconds && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Duration:</span>
                <span>
                  {formatSecondsToHMS(parseInt(videoDetails.lengthSeconds))}
                </span>
              </div>
            )}

            {videoDetails?.trimmedDuration && (
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Trimmed:</span>
                <span>{videoDetails.trimmedDuration}</span>
              </div>
            )}
          </div>

          {videoDetails?.keywords && videoDetails.keywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Keywords:</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pb-1">
                {videoDetails.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {videoDetails?.channelId && (
            <div className="flex items-center gap-2">
              <PersonStandingIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Channel ID:</span>
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono cursor-pointer"
                onClick={() =>
                  copyToClipboard(
                    videoDetails.channelId,
                    "Channel ID copied to clipboard"
                  )
                }
                title="Click to copy"
              >
                {videoDetails.channelId}
              </code>
            </div>
          )}

          {videoDetails?.videoId && (
            <div className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Video ID:</span>
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono cursor-pointer"
                onClick={() =>
                  copyToClipboard(
                    videoDetails.videoId,
                    "Video ID copied to clipboard"
                  )
                }
                title="Click to copy"
              >
                {videoDetails.videoId}
              </code>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
