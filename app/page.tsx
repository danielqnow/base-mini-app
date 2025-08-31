"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ArchitectureModal } from "./components/ArchitectureModal";
import { CodeInput } from "./components/CodeInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import type { AnalysisResult } from "./types";
import { refactorToPostQuantum } from "./services/geminiService";
import dynamic from 'next/dynamic';
import FuturisticCanvasSpinner from "./components/FuturisticCanvasSpinner";

const QuantumRefactorPanel = dynamic(() => import('./components/QuantumRefactorPanel'), { ssr: false });

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalCode, setOriginalCode] = useState<string>("");

  const phrases = [
    "Analyzing your code...",
    "Refactoring functions...",
    "Migrating to post-quantum algorithms...",
    "Optimizing for security...",
  ];
  const [activePhrase, setActivePhrase] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    setActivePhrase(0); // reset when loading starts
    const id = setInterval(() => {
      setActivePhrase((i) => (i + 1) % phrases.length);
    }, 3000); // match animation duration
    return () => clearInterval(id);
  }, [isLoading]);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setOriginalCode(code);
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
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme futuristic-bg">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Header onShowArchitecture={() => setShowArchitecture(true)} />

        {!isLoading && (<CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />)}

        {isLoading && (
          <div className="flex flex-col items-center py-10 animate-fade-in">
            <FuturisticCanvasSpinner height={400} />
            <div className="mt-4 text-[color:rgba(245,245,245,0.8)] h-6">
              <span
                key={activePhrase}
                className="opacity-0 animate-fade-in-out"
                style={{
                  animationDuration: "3s",
                  animationIterationCount: 1,
                }}
              >
                {phrases[activePhrase]}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {result && <ResultsDisplay result={result} originalCode={originalCode} />}
      </div>
      <ArchitectureModal isOpen={showArchitecture} onClose={() => setShowArchitecture(false)} />

      <style jsx global>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(4px); }
          10% { opacity: 1; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
        .animate-fade-in-out {
          animation-name: fade-in-out;
          animation-timing-function: ease-in-out;
          animation-fill-mode: both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 300ms ease-out both;
        }
      `}</style>
    </div>
  );
}
