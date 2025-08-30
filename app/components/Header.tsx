"use client";

import React from 'react';

interface HeaderProps {
  onShowArchitecture: () => void;
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onShowArchitecture }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center w-full">
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--app-foreground)]">
          <span className="text-[var(--app-accent)]">Post-Quantum</span> Refactorizer
        </h1>
        <p className="mt-2 text-lg text-[color:rgba(245,245,245,0.7)]">
          Secure your code against future threats with AI-powered PQC migration.
        </p>
      </div>
      <button
        onClick={onShowArchitecture}
        className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-[var(--app-panel)] border border-[var(--app-input-border)] rounded-lg text-[var(--app-foreground)] hover:bg-[var(--app-input-bg)] transition-all duration-300 focus:outline-none"
      >
        <InfoIcon />
        <span>How it Works</span>
      </button>
    </header>
  );
};
