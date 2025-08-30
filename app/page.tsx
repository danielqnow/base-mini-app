"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { ArchitectureModal } from "./components/ArchitectureModal";
import { CodeInput } from "./components/CodeInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { Spinner } from "./components/Spinner";
import type { AnalysisResult } from "./types";
import { refactorToPostQuantum } from "./services/geminiService";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await refactorToPostQuantum(code, language);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || "Failed to analyze code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Header onShowArchitecture={() => setShowArchitecture(true)} />

        <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {result && <ResultsDisplay result={result} />}
      </div>

      <ArchitectureModal isOpen={showArchitecture} onClose={() => setShowArchitecture(false)} />
    </div>
  );
}
