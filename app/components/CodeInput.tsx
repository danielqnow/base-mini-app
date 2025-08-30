"use client";

import React, { useState } from 'react';

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void | Promise<void>;
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
  const [link, setLink] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (link.trim()) {
      try {
        const res = await fetch('/api/fetch-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: link.trim() }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const fetched = String(data?.code || '');
        await onAnalyze(fetched, language);
        return;
      } catch {
        // Fallback to textarea code if link fetch fails
      }
    }
    onAnalyze(code, language);
  };

  return (
    <div className="panel-glass border border-[var(--app-input-border)] rounded-xl shadow-2xl p-6">
      <form onSubmit={handleSubmit}>
        <div className="input-section w-full max-w-xl mx-auto flex flex-col items-center gap-4">
          <input
            type="url"
            placeholder="Enter link to analyze"
            id="link-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[var(--app-input-bg)] border border-[var(--app-input-border)] text-[var(--app-foreground)] input-glow"
          />
        </div>

        <div className="flex justify-between items-center my-4">
          <label htmlFor="language-select" className="text-lg font-semibold text-[var(--app-foreground)]">
            Select Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-glow bg-[var(--app-input-bg)] border border-[var(--app-input-border)] rounded-md px-3 py-1.5 text-[var(--app-foreground)] focus:outline-none"
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
          className="input-glow w-full h-80 bg-[var(--app-input-bg)] border border-[var(--app-input-border)] rounded-lg p-4 font-mono text-sm text-[var(--app-foreground)] focus:outline-none resize-y transition-shadow"
          spellCheck="false"
        />

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analyzing...' : 'ANALYZE & REFACTOR'}
          </button>
        </div>
      </form>
    </div>
  );
};
