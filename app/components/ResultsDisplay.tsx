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
        return <MarkdownView markdown={safeResult.summary} />;
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
