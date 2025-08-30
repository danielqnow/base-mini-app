"use client";

import React from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--app-panel)] border border-[var(--app-input-border)] rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[color:rgba(245,245,245,0.6)] hover:text-[var(--app-foreground)] transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <h2 className="text-3xl font-bold text-[var(--app-accent)] mb-4">Refactorizer Architecture</h2>
        <p className="text-[color:rgba(245,245,245,0.8)] mb-6">
          This tool leverages a powerful Generative AI model (Gemini) to simulate the complex process of post-quantum code refactoring. Here's the simulated workflow:
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[color:rgba(0,105,137,0.25)] text-[var(--app-accent)] flex items-center justify-center font-bold mr-4">1</div>
            <div>
              <h3 className="font-semibold text-[var(--app-foreground)]">Code Input & Analysis</h3>
              <p className="text-[color:rgba(245,245,245,0.7)]">Your source code is sent to the AI as part of a detailed prompt that establishes the expert persona and the refactoring task.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[color:rgba(0,105,137,0.25)] text-[var(--app-accent)] flex items-center justify-center font-bold mr-4">2</div>
            <div>
              <h3 className="font-semibold text-[var(--app-foreground)]">Cryptographic Vulnerability Detection</h3>
              <p className="text-[color:rgba(245,245,245,0.7)]">The model analyzes the code to identify classical cryptographic algorithms (e.g., RSA, ECC) that are vulnerable to quantum computers.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[color:rgba(0,105,137,0.25)] text-[var(--app-accent)] flex items-center justify-center font-bold mr-4">3</div>
            <div>
              <h3 className="font-semibold text-[var(--app-foreground)]">PQC Algorithm Mapping</h3>
              <p className="text-[color:rgba(245,245,245,0.7)]">The AI maps the identified vulnerabilities to their appropriate NIST-recommended post-quantum replacements (e.g., RSA-KEM → Kyber, ECDSA → Dilithium).</p>
            </div>
          </div>
           <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[color:rgba(0,105,137,0.25)] text-[var(--app-accent)] flex items-center justify-center font-bold mr-4">4</div>
            <div>
              <h3 className="font-semibold text-[var(--app-foreground)]">Code Transformation & Generation</h3>
              <p className="text-[color:rgba(245,245,245,0.7)]">The model generates a new, refactored version of the code, along with a summary of changes and unit tests, all formatted into a structured JSON object.</p>
            </div>
          </div>
        </div>
         <div className="mt-6 pt-4 border-t border-[var(--app-input-border)] text-center">
            <button onClick={onClose} className="px-6 py-2 bg-[var(--app-accent)] text-white font-bold rounded-lg hover:bg-[var(--app-accent-hover)] transition-colors">
                Got it
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
        `}</style>
    </div>
  );
};
