"use client";

import React from 'react';

interface HeaderProps {
  onShowArchitecture: () => void;
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // ...existing SVG...
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onShowArchitecture }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center w-full">
      {/* ...existing JSX... */}
      <div className="text-center sm:text-left">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          <span className="text-cyan-400">Post-Quantum</span> Refactorizer
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Secure your code against future threats with AI-powered PQC migration.
        </p>
      </div>
      <button
        onClick={onShowArchitecture}
        className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-cyan-300 hover:bg-gray-700 hover:text-cyan-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <InfoIcon />
        <span>How it Works</span>
      </button>
    </header>
  );
};
