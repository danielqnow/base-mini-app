"use client";

import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { CodeBlock } from './CodeBlock';
import { ResultsComparison } from './ResultsComparison';

interface ResultsDisplayProps {
  result: AnalysisResult;
  originalCode?: string;
}

type Tab = 'code' | 'summary' | 'tests';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, originalCode }) => {
  const [activeTab, setActiveTab] = useState<Tab>('code');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="prose prose-invert prose-lg max-w-none bg-[var(--app-code-bg)] p-6 rounded-b-lg">
            <div dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, '<br />') }} />
          </div>
        );
      case 'tests':
        return <CodeBlock code={result.unitTests} language="javascript" />;
      case 'code':
      default:
        // Side-by-side comparison view from HTML spec
        if (originalCode) {
          return (
            <div className="bg-transparent rounded-b-lg p-4">
              <ResultsComparison
                original={originalCode}
                refactored={result.refactoredCode}
                language="javascript"
              />
            </div>
          );
        }
        return <CodeBlock code={result.refactoredCode} language="javascript" />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 ${
          isActive
            ? 'bg-transparent text-[var(--app-accent)] border-b-2 border-[var(--app-accent)]'
            : 'bg-transparent text-[color:rgba(245,245,245,0.6)] hover:text-[var(--app-foreground)]'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full bg-[var(--app-panel)] border border-[var(--app-input-border)] rounded-xl shadow-lg">
      <nav className="flex bg-transparent rounded-t-lg border-b border-[var(--app-input-border)]">
        <TabButton tabName="code" label="Refactored Code" />
        <TabButton tabName="summary" label="Change Summary" />
        <TabButton tabName="tests" label="Unit Tests" />
      </nav>
      <div>{renderContent()}</div>
    </div>
  );
};
