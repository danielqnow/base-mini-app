import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CodeProps } from "react-markdown/lib/ast-to-react";

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }: CodeProps) {
        const match = /language-(\w+)/.exec(className || "");
        const text = String(children).replace(/\n$/, "");
        if (!inline) {
          return (
            <pre>
              <code className={className}>{text}</code>
            </pre>
          );
        }
        return <code className={className}>{text}</code>;
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;
