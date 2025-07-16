import { Button } from "@/components/ui/button";
import DisplayMessages from "./DisplayMessages";
import NoMessages from "./NoMessages";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatSecondsToMMSS } from "@/lib/formatTime";
import { UseTranscript } from "@/lib/transcriptContext/TranscriptContext";
import useWebSocket from "react-use-websocket";

export default function ChatAssistant() {
  const chatInputRef = useRef(null);
  const {
    selectedTranscript: { transcript },
  } = UseTranscript();
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [usedSuggestions, setUsedSuggestions] = useState([]);
  const [wsLoading, setWsLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL.replace("http://", "");

  const socketUrl = `ws://${baseUrl}/ai-chat`;
  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl);

  const updateLastMessage = (message, data) => {
    const messagesCopy = [...message];
    const lastIndex = messagesCopy.length - 1;
    if (lastIndex && messagesCopy[lastIndex].sender === "assistant") {
      messagesCopy[lastIndex] = {
        ...messagesCopy[lastIndex],
        content:
          messagesCopy[lastIndex].content === "processing"
            ? data.content
            : messagesCopy[lastIndex].content + data.content,
      };
    }
    return messagesCopy;
  };

  useEffect(() => {
    if (!lastMessage) return;

    const data = JSON.parse(lastMessage.data || "{}");

    if (data.type === "stream") {
      setChatMessages((prevMessages) => {
        const messagesCopy = updateLastMessage(prevMessages, data);
        return messagesCopy;
      });
    } else if (data.type === "done") {
      setWsLoading(false);
      return;
    } else if (data.type === "error") {
      console.error("error happend while calling websocket:", data.message);
      setChatMessages((prevMessages) => {
        const messagesCopy = updateLastMessage(prevMessages, {
          content: `Error: ${data.message}`,
        });
        return messagesCopy;
      });
      setWsLoading(false);
    }
  }, [lastMessage]);

  const handleWebSocketMessage = (Message) => {
    setWsLoading(true);

    sendJsonMessage({
      task: Message.task,
      transcript: transcript.map(
        (t) => `${formatSecondsToMMSS(t.start)}: ${t.text}`
      ),
    });

    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "assistant",
        content: "processing",
      },
    ]);
  };

  const suggestions = [
    {
      text: "Summarize the video",
      task: "summary",
    },
    {
      text: "Extract Q&A",
      task: "qa",
    },
    {
      text: "highlight important parts",
      task: "highlight",
    },
    {
      text: "study guide",
      task: "study_guide",
    },
  ];

  const handleSuggestion = (suggestion) => {
    if (usedSuggestions.includes(suggestion)) {
      return;
    }

    const newUserMessage = {
      id: Date.now().toString(),
      content: suggestion.text,
      sender: "user",
      timestamp: new Date(),
    };

    setUsedSuggestions([...usedSuggestions, suggestion.task]);
    setChatMessages([...chatMessages, newUserMessage]);

    handleWebSocketMessage(suggestion);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newUserMessage]);
    setInputMessage("");

    handleWebSocketMessage({
      task: inputMessage,
      text: inputMessage,
    });
  };

  return (
    <div className="mt-8 mb-8 bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Video Assistant
        </h3>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden p-4">
        {chatMessages.length > 0 ? (
          <DisplayMessages chatMessages={chatMessages} />
        ) : (
          <NoMessages />
        )}

        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              onClick={() => handleSuggestion(suggestion)}
              disabled={usedSuggestions.includes(suggestion.task) || wsLoading}
              className="text-xs md:text-sm whitespace-nowrap"
            >
              {suggestion.text}
            </Button>
          ))}
        </div>

        <form
          onSubmit={handleChatSubmit}
          className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border/50"
        >
          <Input
            ref={chatInputRef}
            type="text"
            placeholder="Ask a question about this video..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow border-0 bg-transparent focus-visible:ring-0 shadow-none focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="rounded-full h-8 w-8 hover:bg-primary/10"
            disabled={!inputMessage.trim() || wsLoading}
            onClick={handleChatSubmit}
          >
            <Send className="h-4 w-4 text-primary" />
          </Button>
        </form>
      </div>
    </div>
  );
}
