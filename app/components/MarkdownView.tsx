"use client";

import React from "react";

export const MarkdownView: React.FC<{
  markdown: string;
  defaultLang?: string;
  disableCodeCopy?: boolean;
}> = ({
  markdown,
  defaultLang = "markdown",
  disableCodeCopy = false,
}) => {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none">
      <div className="whitespace-pre-wrap break-words">
        {markdown}
      </div>
    </div>
  );
};
