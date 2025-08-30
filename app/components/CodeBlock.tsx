
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-900 rounded-b-lg relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-gray-700/50 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
        aria-label="Copy code to clipboard"
      >
        {copied ? <CheckIcon className="text-green-400" /> : <CopyIcon />}
      </button>
      <pre className="p-6 overflow-x-auto">
        <code className={`language-${language} text-sm font-mono`}>
          {code}
        </code>
      </pre>
    </div>
  );
};