"use client";

import React, { useState } from 'react';

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

const exampleCode = `
import crypto from 'crypto';

// Classic Key Generation (Vulnerable to Quantum Attacks)
function generateRsaKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  return { publicKey, privateKey };
}

// Classic Encryption (Vulnerable)
function rsaEncrypt(data, publicKey) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(data)
  );
  return encryptedData.toString('base64');
}

console.log("Generating vulnerable RSA keys...");
const keys = generateRsaKeyPair();
const originalText = "This is a secret message!";
const encryptedText = rsaEncrypt(originalText, keys.publicKey);

console.log("Encrypted with RSA:", encryptedText);
`;


export const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState<string>(exampleCode);
  const [language, setLanguage] = useState<string>('JavaScript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(code, language);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl shadow-cyan-500/10 p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="language-select" className="text-lg font-semibold text-gray-300">
            Select Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option>JavaScript</option>
            <option>Python</option>
            <option>Rust</option>
            <option>Go</option>
            <option>Solidity</option>
          </select>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your classic code here..."
          className="w-full h-80 bg-gray-900 border border-gray-600 rounded-lg p-4 font-mono text-sm text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
          spellCheck="false"
        />
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-12 py-3 bg-cyan-600 text-white font-bold text-lg rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze & Refactor'}
          </button>
        </div>
      </form>
    </div>
  );
};
