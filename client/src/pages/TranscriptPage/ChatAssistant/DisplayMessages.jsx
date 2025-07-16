import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import remarkGfm from "remark-gfm";

export default function DisplayMessages({ chatMessages }) {
  return (
    <ScrollArea className="flex-grow mb-4 pr-4 max-h-[380px]">
      <div className="space-y-4 py-1 h-full">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.content === "processing" ? (
              <div className="flex items-center space-x-2 h-6">
                <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0s]" />
                <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              <div
                dir="auto"
                className={`max-w-[85%] px-4 py-2 shadow-sm ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                    : "bg-muted rounded-2xl rounded-tl-sm"
                }`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: (props) => <p dir="auto" className="mb-1" {...props} />,
                    ul: (props) => (
                      <ul className="list-disc mx-5 space-y-1" {...props} />
                    ),
                    pre: (props) => (
                      <pre dir="auto" className="my-3" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
