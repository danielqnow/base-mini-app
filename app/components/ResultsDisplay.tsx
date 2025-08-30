"use client";

import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { CodeBlock } from './CodeBlock';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

type Tab = 'code' | 'summary' | 'tests';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<Tab>('code');

  const renderContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="prose prose-invert prose-lg max-w-none bg-gray-900 p-6 rounded-b-lg">
            <div dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, '<br />') }} />
          </div>
        );
      case 'tests':
        return <CodeBlock code={result.unitTests} language="javascript" />;
      case 'code':
      default:
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
            ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
            : 'bg-transparent text-gray-400 hover:text-white'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
      <nav className="flex bg-gray-900/70 rounded-t-lg border-b border-gray-700">
        <TabButton tabName="code" label="Refactored Code" />
        <TabButton tabName="summary" label="Change Summary" />
        <TabButton tabName="tests" label="Unit Tests" />
      </nav>
      <div>{renderContent()}</div>
    </div>
  );
};
