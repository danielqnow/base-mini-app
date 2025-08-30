
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
        className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-2xl p-8 relative transform transition-all duration-300 scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Refactorizer Architecture</h2>
        <p className="text-gray-300 mb-6">
          This tool leverages a powerful Generative AI model (Gemini) to simulate the complex process of post-quantum code refactoring. Here's the simulated workflow:
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center font-bold mr-4">1</div>
            <div>
              <h3 className="font-semibold text-white">Code Input & Analysis</h3>
              <p className="text-gray-400">Your source code is sent to the AI as part of a detailed prompt that establishes the expert persona and the refactoring task.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center font-bold mr-4">2</div>
            <div>
              <h3 className="font-semibold text-white">Cryptographic Vulnerability Detection</h3>
              <p className="text-gray-400">The model analyzes the code to identify classical cryptographic algorithms (e.g., RSA, ECC) that are vulnerable to quantum computers.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center font-bold mr-4">3</div>
            <div>
              <h3 className="font-semibold text-white">PQC Algorithm Mapping</h3>
              <p className="text-gray-400">The AI maps the identified vulnerabilities to their appropriate NIST-recommended post-quantum replacements (e.g., RSA-KEM → Kyber, ECDSA → Dilithium).</p>
            </div>
          </div>
           <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center font-bold mr-4">4</div>
            <div>
              <h3 className="font-semibold text-white">Code Transformation & Generation</h3>
              <p className="text-gray-400">The model generates a new, refactored version of the code, along with a summary of changes and unit tests, all formatted into a structured JSON object.</p>
            </div>
          </div>
        </div>
         <div className="mt-6 pt-4 border-t border-gray-700 text-center">
            <button onClick={onClose} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors">
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
