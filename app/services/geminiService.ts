import type { AnalysisResult } from '../types';

export const refactorToPostQuantum = async (code: string, language: string): Promise<AnalysisResult> => {
  const res = await fetch('/api/refactor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to refactor code');
  }

  const data = await res.json() as AnalysisResult;

  if (!data?.refactoredCode || !data?.summary || !data?.unitTests) {
    throw new Error('Invalid response from refactor API');
  }

  return data;
};
