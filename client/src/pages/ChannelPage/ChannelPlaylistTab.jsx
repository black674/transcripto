import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { Copy, ExternalLink } from "lucide-react";

export default function channelPlaylistTab({ playlistId }) {
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Channel Playlist URL</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-muted p-2 rounded text-sm break-all">
              {playlistId}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(
                  `https://www.youtube.com/playlist?list=${playlistId}`,
                  "Playlist URL copied to clipboard"
                )
              }
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        <div>
          <Button
            onClick={() =>
              openInNewTab(
                `https://www.youtube.com/playlist?list=${playlistId}`
              )
            }
            className="w-full bg-[#42A5F5] hover:bg-[#2196F3]"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Playlist
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            You can use this playlist link to extract transcripts using the
            Extract from Playlist tool
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
