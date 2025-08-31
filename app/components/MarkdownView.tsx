"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

export const MarkdownView: React.FC<{ markdown: string; defaultLang?: string }> = ({
  markdown,
  defaultLang = "markdown",
}) => {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const text = String(children).replace(/\n$/, "");
            if (!inline) {
              return (
                <CodeBlock code={text} language={match?.[1] || defaultLang} />
              );
            }
            return (
              <code
                className="px-1 py-0.5 rounded bg-white/10 text-[var(--app-foreground)]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
