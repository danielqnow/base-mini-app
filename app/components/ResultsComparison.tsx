"use client";

import React, { useMemo } from "react";

export function ResultsComparison({
  original,
  refactored,
  language = "javascript",
}: {
  original: string;
  refactored: string;
  language?: string;
}) {
  const { leftLines, rightLines, changedLeft, changedRight } = useMemo(() => {
    const left = original.split("\n");
    const right = refactored.split("\n");
    const max = Math.max(left.length, right.length);
    const changedL = new Set<number>();
    const changedR = new Set<number>();

    // Naive line-by-line change detection (index-based)
    for (let i = 0; i < max; i++) {
      const l = left[i] ?? "";
      const r = right[i] ?? "";
      if (l !== r) {
        if (i < left.length) changedL.add(i);
        if (i < right.length) changedR.add(i);
      }
    }
    return { leftLines: left, rightLines: right, changedLeft: changedL, changedRight: changedR };
  }, [original, refactored]);

  return (
    <div className="rounded-[24px] border border-white/10 panel-glass p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left / Original */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-[var(--app-foreground)]/90">Original Code</h2>
          <div className="relative rounded-lg border border-white/10 bg-black/40 backdrop-blur">
            <pre
              className="m-0 p-3 max-h-64 sm:max-h-80 md:max-h-[70vh] overflow-auto"
              aria-label="Original code diff"
              tabIndex={0}
            >
              <code
                className={`language-${language} font-mono text-xs sm:text-sm leading-5 text-[var(--app-foreground)]/90 whitespace-pre`}
              >
                {leftLines.map((line, i) => (
                  <span
                    key={i}
                    className={`block px-2 py-0.5 ${
                      changedLeft.has(i) ? "bg-amber-500/10 border-l-2 border-amber-400" : ""
                    }`}
                  >
                    {line || " "}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* Right / Refactored */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-[var(--app-foreground)]/90">Refactored Code</h2>
          <div className="relative rounded-lg border border-white/10 bg-black/40 backdrop-blur">
            <pre
              className="m-0 p-3 max-h-64 sm:max-h-80 md:max-h-[70vh] overflow-auto"
              aria-label="Refactored code diff"
              tabIndex={0}
            >
              <code
                className={`language-${language} font-mono text-xs sm:text-sm leading-5 text-[var(--app-foreground)]/90 whitespace-pre`}
              >
                {rightLines.map((line, i) => (
                  <span
                    key={i}
                    className={`block px-2 py-0.5 ${
                      changedRight.has(i) ? "bg-emerald-500/10 border-l-2 border-emerald-400" : ""
                    }`}
                  >
                    {line || " "}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
