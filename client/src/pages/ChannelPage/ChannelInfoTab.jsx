import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { Copy } from "lucide-react";

export default function channelInfoTab({ channelData }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={channelData?.snippet?.thumbnails?.high?.url}
              alt={channelData?.snippet?.title}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">
                {channelData?.snippet?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {channelData?.statistics?.subscriberCount} subscribers
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Channel ID</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      channelData?.id,
                      "Channel ID copied to clipboard"
                    )
                  }
                  className="h-8"
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copy
                </Button>
              </div>
              <p className="text-sm break-all bg-muted p-2 rounded">
                {channelData?.id}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Channel Description</h4>
              <p className="text-sm">{channelData?.snippet?.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
