import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type CodeProps = React.ComponentProps<"code"> & { inline?: boolean };

const MarkdownRenderer = ({ content }: { content: string }) => (
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
    } as Components}
  >
    {content}
  </ReactMarkdown>
);

export default MarkdownRenderer;
