"use client";

import React, { useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import { CodeBlock } from './CodeBlock';
import { ResultsComparison } from './ResultsComparison';
import { MarkdownView } from './MarkdownView';

interface ResultsDisplayProps {
  result: AnalysisResult | { error?: string };
  originalCode?: string;
  onShowCodeInput?: () => void; // new optional callback to show code input
}

type Tab = 'code' | 'summary' | 'tests';

// Normalize possibly JSON-escaped or fenced markdown into plain markdown
function normalizeMarkdown(input: string): string {
  const toString = (v: unknown) => (v ?? '').toString();

  let s = toString(input).trim();

  const stripOuterQuotes = (v: string): string => {
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  };

  const tryJsonParseString = (v: string): string => {
    // Try strict JSON string parsing
    try {
      if (v.startsWith('"') && v.endsWith('"')) {
        const parsed = JSON.parse(v);
        if (typeof parsed === 'string') return parsed;
      }
      if (v.startsWith("'") && v.endsWith("'")) {
        // Convert to valid JSON string then parse
        const asJson = `"${v
          .slice(1, -1)
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')}"`;
        const parsed = JSON.parse(asJson);
        if (typeof parsed === 'string') return parsed;
      }
    } catch {
      // ignore
    }
    return v;
  };

  const jsonUnescape = (v: string): string => {
    // If it contains JSON-style escapes, unescape by leveraging JSON.parse
    if (/\\[nrt"']|\\u[0-9a-fA-F]{4}/.test(v)) {
      try {
        // Wrap as JSON string literal safely
        const wrapped =
          '"' +
          v
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n') +
          '"';
        const parsed = JSON.parse(wrapped);
        if (typeof parsed === 'string') return parsed;
      } catch {
        // ignore
      }
    }
    return v;
  };

  const decodeHtmlEntities = (v: string): string => {
    // Minimal, safe decode for common entities
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x60;': '`',
      '&#96;': '`',
      '&#x2F;': '/',
      '&#47;': '/',
    };
    return v.replace(/&(amp|lt|gt|quot|#39|#x27|#x60|#96|#x2F|#47);/g, (m) => map[m] ?? m);
  };

  const unwrapSingleFencedBlock = (v: string): string => {
    const m = v.match(/^\s*```(?:\w+)?\s*[\r\n]([\s\S]*?)\s*```\s*$/);
    return m ? m[1] : v;
  };

  // 1) Strip one layer of outer quotes if present
  s = stripOuterQuotes(s);

  // 2) Try to parse as a JSON string (handles \" \\n etc.)
  s = tryJsonParseString(s);

  // 3) If still escaped, try a generic JSON unescape
  s = jsonUnescape(s);

  // 4) Decode common HTML entities (e.g., &quot;, &#x27;)
  s = decodeHtmlEntities(s);

  // 5) Normalize line endings
  s = s.replace(/\r/g, '');

  // 6) If the whole thing is a single fenced block, unwrap it
  s = unwrapSingleFencedBlock(s);

  return s.trim();
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, originalCode, onShowCodeInput }) => {
  const [activeTab, setActiveTab] = useState<Tab>('code');

  // Handle invalid response shape with 15s redirect
  const invalidShape = (result as any)?.error === 'Invalid response shape from model';
  const [secondsLeft, setSecondsLeft] = useState<number>(15);

  useEffect(() => {
    if (!invalidShape) return;
    setSecondsLeft(15);

    const triggerShowCodeInput = () => {
      if (onShowCodeInput) onShowCodeInput();
      else if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app:showCodeInput'));
      }
    };

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        return next >= 0 ? next : 0;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      triggerShowCodeInput();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [invalidShape, onShowCodeInput]);

  if (invalidShape) {
    return (
      <div className="w-full bg-[var(--app-panel)] border border-[var(--app-input-border)] rounded-xl shadow-lg overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="text-sm sm:text-base text-[color:rgba(245,245,245,0.85)]">
            Invalid response shape from model. Returning to input in {secondsLeft}s...
          </div>
        </div>
      </div>
    );
  }

  const safeResult = result as AnalysisResult;
  const testsAvailable = Boolean(safeResult.unitTests && safeResult.unitTests.trim().length > 0);
  const testsTabLabel = testsAvailable ? 'Code Added' : 'New Code';

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return <MarkdownView markdown={normalizeMarkdown(safeResult.summary)} />;
      case 'tests':
        return testsAvailable ? (
          <CodeBlock code={safeResult.unitTests} language="javascript" />
        ) : (
          <div className="text-sm sm:text-base text-[color:rgba(245,245,245,0.7)]">
            No tests generated yet.
          </div>
        );
      case 'code':
      default:
        if (originalCode) {
          return (
            <ResultsComparison
              original={originalCode}
              refactored={safeResult.refactoredCode}
              language="javascript"
            />
          );
        }
        return <CodeBlock code={safeResult.refactoredCode} language="javascript" />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        role="tab"
        aria-selected={isActive}
        className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]/50 ${
          isActive
            ? 'bg-transparent text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]'
            : 'bg-transparent text-[color:rgba(245,245,245,0.7)] hover:text-[var(--app-foreground)]'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full bg-[var(--app-panel)] border border-[var(--app-input-border)] rounded-xl shadow-lg overflow-hidden">
      <nav
        className="flex items-center gap-1 overflow-x-auto px-2 sm:px-4 bg-transparent rounded-t-lg border-b border-[var(--app-input-border)]"
        role="tablist"
        aria-label="Results tabs"
      >
        <TabButton tabName="code" label="Refactored Code" />
        <TabButton tabName="summary" label="Change Summary" />
        <TabButton tabName="tests" label={testsTabLabel} />
      </nav>
      <div className="p-3 sm:p-4 md:p-6 max-h-[75vh] overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};
