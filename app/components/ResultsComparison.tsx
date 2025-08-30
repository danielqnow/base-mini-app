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
    <div className="results-container">
      <div className="code-panel">
        <h2>Original Code</h2>
        <pre>
          <code className={`language-${language}`}>
            {leftLines.map((line, i) => (
              <div key={i} className={changedLeft.has(i) ? "modified" : ""}>
                {line || " "}
              </div>
            ))}
          </code>
        </pre>
      </div>
      <div className="code-panel">
        <h2>Refactored Code</h2>
        <pre>
          <code className={`language-${language}`}>
            {rightLines.map((line, i) => (
              <div key={i} className={changedRight.has(i) ? "modified" : ""}>
                {line || " "}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
