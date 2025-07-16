import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronLeftIcon, Globe, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { downloadMultipleTranscripts } from "@/lib/download";

export default function TranscriptVideos({
  transcriptedVideos,
  setDisplayVideosMode,
}) {
  const [selectedVideos, setSelectedVideos] = useState(transcriptedVideos);
  const [language, setLanguage] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [customLanguages, setCustomLanguages] = useState({});

  const extractAvailableLanguages = () => {
    const langSet = new Set();

    transcriptedVideos.forEach((video) => {
      if (video.track && Array.isArray(video.track)) {
        video.track.forEach((track) => {
          if (track.language) {
            langSet.add(track.language);
          }
        });
      }
    });

    return Array.from(langSet);
  };

  const getVideoAvailableLanguages = (video) => {
    const langSet = new Set();

    if (video.track && Array.isArray(video.track)) {
      video.track.forEach((track) => {
        if (track.language) {
          langSet.add(track.language);
        }
      });
    }

    return Array.from(langSet);
  };

  const videoSupportsLanguage = (video, lang) => {
    if (!video.track || !Array.isArray(video.track)) return false;
    return video.track.some((track) => track.language === lang);
  };

  const handleVideoSelection = (video) => {
    setSelectedVideos((prev) => {
      if (prev.some((vid) => vid.id === video.id)) {
        return prev.filter((vid) => vid.id !== video.id);
      } else {
        return [...prev, video];
      }
    });
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleCustomLanguageChange = (videoId, lang) => {
    setCustomLanguages((prev) => ({
      ...prev,
      [videoId]: lang,
    }));
  };

  const handleFetch = () => {
    if (selectedVideos.length === 0)
      return console.log("Please select at least one video");
    const result = selectedVideos.map((video) => {
      const finalLanguage = videoSupportsLanguage(video, language)
        ? language
        : customLanguages[video.id] ||
          getVideoAvailableLanguages(video)[0] ||
          language;

      // Find the transcript object that matches the selected language
      const selectedTranscript =
        video.track && Array.isArray(video.track)
          ? video.track.find((track) => track.language === finalLanguage)
          : null;

      return {
        id: video.id,
        title: video.title,
        selectedLanguage: finalLanguage,
        transcript: selectedTranscript,
      };
    });

    downloadMultipleTranscripts(result);
  };

  useMemo(() => {
    const languages = extractAvailableLanguages();
    setAvailableLanguages(languages);

    if (languages.length > 0 && !language) {
      setLanguage(languages[0]);
    }
  }, [transcriptedVideos]);

  return (
    <>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setDisplayVideosMode("playlist")}
          className="flex items-center gap-2 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Go Back</span>
        </Button>

        <Card className="overflow-hidden border">
          <div className="flex items-center justify-between gap-2 p-4">
            <h2 className="text-xl font-semibold">
              Transcript Videos ({selectedVideos.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Select onValueChange={handleLanguageChange} value={language}>
                  <SelectTrigger className="min-w-36">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                disabled={selectedVideos.length === 0}
                onClick={handleFetch}
              >
                Download Selected
              </Button>
            </div>
          </div>
          <div className="h-[600px]">
            <ScrollArea className="h-full pr-2 overflow-hidden">
              {transcriptedVideos.map((video) => {
                const isSelected = selectedVideos.some(
                  (vid) => vid.id === video.id
                );
                const thumbnailUrl = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
                return (
                  <div
                    key={video.id}
                    className={`flex p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleVideoSelection(video)}
                  >
                    <div className="flex-shrink-0 mr-3 flex items-center">
                      <Checkbox
                        id={`video-${video.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleVideoSelection(video)}
                        className="h-5 w-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div
                      className="flex-shrink-0 mr-4 relative"
                      style={{ width: "160px", height: "90px" }}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-base line-clamp-2">
                        {video.title}
                      </h3>
                      {language && !videoSupportsLanguage(video, language) && (
                        <Alert variant="destructive" className="mt-2 py-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                This video doesn't support {language} language
                              </AlertDescription>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Globe className="w-4 h-4" />
                              <Select
                                onValueChange={(value) =>
                                  handleCustomLanguageChange(video.id, value)
                                }
                                value={
                                  customLanguages[video.id] ||
                                  getVideoAvailableLanguages(video)[0] ||
                                  ""
                                }
                              >
                                <SelectTrigger className="min-w-36">
                                  <SelectValue placeholder="Select a custom language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {getVideoAvailableLanguages(video).map(
                                      (lang) => (
                                        <SelectItem
                                          key={`${video.id}-${lang}`}
                                          value={lang}
                                        >
                                          {lang}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </div>
        </Card>
      </div>
    </>
  );
}
