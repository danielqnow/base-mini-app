"use client";

import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

export const MarkdownView: React.FC<{
  markdown: string;
  defaultLang?: string;
  disableCodeCopy?: boolean;
}> = ({
  markdown,
  defaultLang = "markdown",
  disableCodeCopy = false,
}) => {
  const components: Components = {
    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
      const match = /language-(\w+)/.exec(className || "");
      const text = String(children).replace(/\n$/, "");

      if (!inline) {
        if (disableCodeCopy) {
          return (
            <pre className={className}>
              <code {...props}>{text}</code>
            </pre>
          );
        }
        return <CodeBlock code={text} language={match?.[1] || defaultLang} />;
      }

      return (
        <code className="px-1 py-0.5 rounded bg-white/10 text-[var(--app-foreground)]">
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
