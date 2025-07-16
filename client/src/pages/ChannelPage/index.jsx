import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateChannelUrl } from "@/lib/validateYoutubeUrl";
import ChannelInfoTab from "./ChannelInfoTab";
import ChannelPlaylistTab from "./ChannelPlaylistTab";
import { apiGet } from "@/lib/api/apiClient";

export default function ChannelPage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [playlistId, setPlaylistId] = useState("");

  const handleGetChannelInfo = async () => {
    const channelUsername = validateChannelUrl(channelUrl);

    if (!channelUsername) {
      setErrorMessage("Please enter a valid YouTube channel URL");
      return;
    }

    try {
      setErrorMessage("");
      setIsLoading(true);

      const data = await apiGet(`/channel?username=${channelUsername}`);

      setChannelData(data.items[0]);
      setPlaylistId(data.items[0].id.replace(data.items[0].id[1], "U"));
    } catch (error) {
      console.error("Error fetching channel information:", error);
      setErrorMessage(error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Channel Information
        </h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enter YouTube Channel URL</CardTitle>
            <CardDescription>
              Paste a YouTube channel URL to fetch channel details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://www.youtube.com/channel/..."
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleGetChannelInfo}
                disabled={isLoading}
                className="bg-[#42A5F5] hover:bg-[#2196F3]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Get Channel Info"
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

        {!channelData && (
          <div className="text-center py-10 text-muted-foreground">
            Enter a channel link to get started
          </div>
        )}

        {channelData && (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="info">Channel Info</TabsTrigger>
              <TabsTrigger value="playlist">Channel Playlist</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <ChannelInfoTab channelData={channelData} />
            </TabsContent>

            <TabsContent value="playlist">
              <ChannelPlaylistTab playlistId={playlistId} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
