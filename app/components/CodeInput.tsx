"use client";

import React, { useState, useEffect } from 'react';

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void | Promise<void>;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isLoading }) => {
  const [link, setLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedCode, setFetchedCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('JavaScript');

  const isValidHttpUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const guessLanguageFromUrl = (value: string) => {
    try {
      const pathname = new URL(value).pathname.toLowerCase();
      const ext = pathname.split('.').pop() || '';
      switch (ext) {
        case 'sol': return 'Solidity';
        case 'ts':
        case 'tsx': return 'TypeScript';
        case 'js':
        case 'mjs':
        case 'cjs': return 'JavaScript';
        case 'py': return 'Python';
        case 'rs': return 'Rust';
        case 'go': return 'Go';
        case 'java': return 'Java';
        case 'rb': return 'Ruby';
        case 'cpp':
        case 'cc':
        case 'cxx':
        case 'hpp':
        case 'h':
        case 'c': return 'C++';
        case 'cs': return 'C#';
        case 'kt':
        case 'kts': return 'Kotlin';
        case 'swift': return 'Swift';
        case 'php': return 'PHP';
        case 'sh':
        case 'bash': return 'Shell';
        default: return 'JavaScript';
      }
    } catch {
      return 'JavaScript';
    }
  };

  useEffect(() => {
    try {
      const storedLink = localStorage.getItem('codeinput:link');
      if (storedLink) setLink(storedLink);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('codeinput:link', link); } catch {}
  }, [link]);

  useEffect(() => {
    setFetchedCode('');
  }, [link]);

  useEffect(() => {
    setLanguage(guessLanguageFromUrl(link));
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedLink = link.trim();

    if (!trimmedLink) {
      setError('Please enter a link to analyze.');
      return;
    }
    if (!isValidHttpUrl(trimmedLink)) {
      setError('Enter a valid http(s) URL.');
      return;
    }

    setIsFetching(true);
    try {
      const fetched = await fetchCodeWithRetry('/api/fetch-code', { url: trimmedLink });
      setFetchedCode(fetched);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setFetchedCode('');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAnalyze = async () => {
    if (!fetchedCode.trim()) return;
    try {
      await onAnalyze(fetchedCode, language);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    }
  };

  return (
    <div className="relative rounded-[24px] border border-white/10 panel-glass shadow-2xl shadow-cyan-500/10 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-cyan-300"
              fill="currentColor"
            >
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            <span className="text-sm font-medium text-[var(--app-foreground)]/90">
              Post-Quantum Refactorizer
            </span>
          </div>
          <button
            type="button"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--app-foreground)]/80 hover:bg-white/10 transition"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
            </svg>
          </button>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight text-[var(--app-foreground)]">
          Secure your DeFi protocols
          <br className="hidden sm:block" /> against future quantum threats.
        </h1>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <input
            type="url"
            placeholder="Enter link to smart contract or digital signature"
            id="link-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={isLoading || isFetching}
            inputMode="url"
            autoComplete="off"
            className="w-full h-12 sm:h-14 rounded-full px-5 sm:px-6 bg-white text-gray-900 placeholder:text-gray-500 border-0 outline-none ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-cyan-400 transition"
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* Code Preview (read-only, animated) */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            fetchedCode ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}
          aria-live="polite"
        >
          <div className="rounded-lg border border-white/10 bg-black/40 backdrop-blur p-3">
            <pre className="text-xs sm:text-sm max-h-80 overflow-auto text-[var(--app-foreground)]/90">
              <code>{fetchedCode}</code>
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 flex flex-col sm:flex-row gap-3">
          {/* Fetch Code */}
          <button
            type="submit"
            disabled={isLoading || isFetching}
            className="w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold tracking-wide text-white bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition inline-flex items-center justify-center"
          >
            {isFetching ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Fetching...
              </>
            ) : (
              'FETCH CODE'
            )}
          </button>

          {/* Analyze & Refactor (enabled only when code is fetched) */}
          {fetchedCode && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || isFetching || !fetchedCode.trim()}
              className="w-full h-12 sm:h-14 rounded-full text-sm sm:text-base font-semibold tracking-wide text-white bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Analyzing...' : 'ANALYZE & REFACTOR'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Helper: simple sleep
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Helper: normalize/unwrap various error shapes (including double-encoded JSON)
function normalizeErrorMessage(raw: unknown): string {
  try {
    let value: any = raw;

    if (typeof value === 'string') {
      const t = value.trim();
      // If it's JSON-looking, try parse
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try { value = JSON.parse(t); } catch { /* ignore */ }
      } else {
        return value;
      }
    }

    if (value && typeof value === 'object') {
      // If shape is { error: "<json string>" } or { error: {...} }
      if ('error' in value) {
        const err = (value as any).error;
        if (typeof err === 'string') {
          try {
            const inner = JSON.parse(err);
            return normalizeErrorMessage(inner) || err;
          } catch {
            return err;
          }
        }
        if (err && typeof err === 'object') {
          return err.message || err.status || JSON.stringify(err);
        }
      }
      // Common shapes
      if ('message' in value && typeof (value as any).message === 'string') {
        return (value as any).message;
      }
      if ('statusText' in value && typeof (value as any).statusText === 'string') {
        return (value as any).statusText;
      }
      return JSON.stringify(value);
    }

    return typeof value === 'string' ? value : '';
  } catch {
    return '';
  }
}

// Helper: fetch with retry and friendly errors for 503/overload
async function fetchCodeWithRetry(endpoint: string, payload: any, retries = 2, baseDelayMs = 700): Promise<string> {
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const fetched = String(data?.code || '');
        if (!fetched.trim()) throw new Error('Empty code');
        return fetched;
      }

      // Not OK -> parse best-effort error
      let message = `Fetch failed with ${res.status}`;
      try {
        const ct = res.headers.get('content-type') || '';
        const raw = ct.includes('application/json') ? await res.json() : await res.text();
        message = normalizeErrorMessage(raw) || message;
      } catch { /* ignore */ }

      // Retry on 503/overload/unavailable
      if (res.status === 503 || /overloaded|unavailable/i.test(message)) {
        if (attempt < retries) {
          await sleep(baseDelayMs * Math.pow(2, attempt));
          continue;
        }
        throw new Error('Service temporarily overloaded. Please try again later.');
      }

      throw new Error(message);
    } catch (e: any) {
      lastErr = e;
      const msg = String(e?.message || '');
      const temporary =
        e?.code === 503 ||
        /temporarily|overloaded|unavailable|timeout|network|failed to fetch/i.test(msg);

      if (temporary && attempt < retries) {
        await sleep(baseDelayMs * Math.pow(2, attempt));
        continue;
      }
      throw e;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('Unknown error');
}
