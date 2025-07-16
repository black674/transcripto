import remarkGfm from "remark-gfm";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MarkdownSkeleton from "./MarkdownSkeleton";

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { pathname } = useParams();

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/markdown/${pathname}.md`);
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("text/markdown")
        ) {
          throw new Error("Network response was not ok");
        }
        const markdown = await response.text();
        setMarkdown(markdown);
      } catch (error) {
        console.error("Failed to fetch markdown:", error);
        navigate("/404");
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [pathname, markdown, navigate]);

  if (loading) return <MarkdownSkeleton />;

  if (error)
    return (
      <div className="min-h-[90vh]">
        Error loading markdown: {error.message}
      </div>
    );

  return (
    <div className="container min-h-[90vh] !max-w-3xl mx-auto py-10 prose">
      <ReactMarkdown rehypePlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
