import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { downloadSingleTranscript } from "@/lib/download";
import { formatSecondsToMMSS } from "@/lib/formatTime";
import { Copy, Download, Globe, Link, PlayCircle, Search } from "lucide-react";
import { useEffect, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import NoCaption from "./NoCaption";
import { Switch } from "@/components/ui/switch";
import { UseTranscript } from "@/lib/transcriptContext/TranscriptContext";
import { reducer } from "./transcriptDisplayReducer";
import {
  isActiveSegment,
  mergeTranscriptSegments,
} from "@/lib/transcriptUtils";

export default function TranscriptDisplay() {
  const {
    playerRef,
    selectedTranscript,
    setSelectedTranscript,
    videoDetails: { track: transcripts },
    videoDetails: { title: title },
  } = UseTranscript();
  const initialState = {
    language: transcripts[0]?.language || "",
    mergedTranscript: [],
    autoScroll: false,
    searchTerm: "",
    currentTime: 0,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { language, mergedTranscript, autoScroll, searchTerm, currentTime } =
    state;
  const segmentRef = useRef({});
  const { videoId } = useParams();

  const handleSeek = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const handleSelectedTranscript = async (language) => {
    const transcript = await transcripts.find((t) => t.language === language);
    setSelectedTranscript(transcript);
    dispatch({ type: "SET_LANGUAGE", payload: language });
  };

  const highlightText = (text) => {
    if (!searchTerm) return text;

    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-200 text-gray-900 px-0.5 rounded-sm font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const scrollToActiveSegment = (index) => {
    if (!segmentRef.current[index]) return;

    const transcriptCard = document.querySelector(".transcript-card");
    if (!transcriptCard) return;

    const scrollViewport = transcriptCard.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!scrollViewport) return;

    const segmentElement = segmentRef.current[index];

    const segmentTop = segmentElement.offsetTop;
    const viewportHeight = scrollViewport.clientHeight;

    const scrollPosition =
      segmentTop - viewportHeight / 2 + segmentElement.offsetHeight / 2;

    scrollViewport.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (selectedTranscript && selectedTranscript.transcript) {
      dispatch({
        type: "SET_MERGED_TRANSCRIPT",
        payload: mergeTranscriptSegments(
          selectedTranscript.transcript,
          language
        ),
      });
    }
  }, [selectedTranscript, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime();
      dispatch({ type: "SET_CURRENT_TIME", payload: currentTime });

      const activeIndex = mergedTranscript.findIndex((segment, index) => {
        return isActiveSegment(segment, mergedTranscript, currentTime, index);
      });

      if (activeIndex !== -1 && autoScroll) {
        scrollToActiveSegment(activeIndex);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [playerRef, autoScroll, language, mergedTranscript]);

  if (!transcripts?.[0] || transcripts?.[0]?.error) {
    return <NoCaption />;
  }

  return (
    <Card className="transcript-card p-4 w-full lg:w-[47%] flex flex-col h-[570px]">
      <Button
        onClick={() => downloadSingleTranscript(selectedTranscript, title)}
        className="w-full flex items-center justify-center mb-4"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Transcript
      </Button>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Transcript</h3>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <Select
            onValueChange={handleSelectedTranscript}
            defaultValue={language}
          >
            <SelectTrigger className="min-w-36">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {transcripts.map((transcript) => (
                  <SelectItem
                    key={transcript.language}
                    value={transcript.language}
                  >
                    {transcript.language}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search in transcript..."
          value={searchTerm}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })
          }
          autoFocus
          className="pl-9 pr-4 py-2 w-full text-sm border-border focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <ScrollArea className="flex-grow pr-4 h-full overflow-hidden">
        {selectedTranscript && (
          <div className="space-y-3">
            {mergedTranscript
              .filter(
                (line) =>
                  !searchTerm ||
                  line.text.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((line, index) => (
                <div
                  key={index}
                  ref={(el) => (segmentRef.current[index] = el)}
                  className={`relative rounded-md p-2 hover:bg-gray-50 group 
                    ${
                      isActiveSegment(
                        line,
                        mergedTranscript,
                        currentTime,
                        index
                      )
                        ? "bg-gray-50"
                        : ""
                    }`}
                >
                  <div className="flex items-center gap-2 p-1 rounded-md absolute top-0 right-0 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div
                      onClick={() =>
                        copyToClipboard(
                          `https://www.youtube.com/watch?v=${videoId}&t=${line.start.toFixed(
                            0
                          )}`,
                          "Time link copied to clipboard"
                        )
                      }
                      className="flex items-center gap-1 p-2 rounded-lg bg-primary text-primary-foreground h-8 cursor-pointer hover:opacity-80"
                    >
                      <Link className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        {line.start.toFixed(0) + "s"}
                      </span>
                    </div>
                    <div
                      className="cursor-pointer rounded-lg bg-primary text-primary-foreground p-2 flex items-center h-8 hover:opacity-80"
                      onClick={() =>
                        copyToClipboard(line.text, "Text copied to clipboard")
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </div>
                    <div
                      onClick={() => handleSeek(line.start)}
                      className="flex items-center gap-2 p-2 cursor-pointer rounded-lg bg-primary text-primary-foreground h-8 hover:opacity-80"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Jump</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="min-w-[60px] rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      {formatSecondsToMMSS(line.start)}
                    </span>
                    <p className="text-sm text-gray-700 flex-1">
                      {searchTerm ? highlightText(line.text) : line.text}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center justify-end gap-2 mt-4 px-4">
        <Switch
          checked={autoScroll}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_AUTOSCROLL", payload: checked })
          }
        />
        <label className="text-sm font-medium">Auto Scroll</label>
      </div>
    </Card>
  );
}
