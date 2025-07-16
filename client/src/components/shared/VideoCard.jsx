import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const thumbnailUrl = `https://i.ytimg.com/vi/${video.video_id}/mqdefault.jpg`;

  const handleGoToTranscript = () => {
    startTransition(() => {
      navigate(`/transcript/${video.video_id}`);
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target instanceof HTMLImageElement
              ? e.target
              : e.currentTarget
            ).src = `https://i.ytimg.com/vi/${video.video_id}/mqdefault.jpg`;
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3
          className="font-medium text-base mb-3 line-clamp-2 h-12"
          title={video.title}
        >
          {video.title}
        </h3>
        <Button
          className="w-full"
          onClick={handleGoToTranscript}
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Go to Transcript"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
