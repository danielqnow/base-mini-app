import React from 'react';
import CodeViewer from './CodeViewer';

const EXT_TO_LANG: Record<string, string> = {
  txt: 'txt',
  md: 'md',
  json: 'json',
  js: 'js',
  jsx: 'jsx',
  ts: 'ts',
  tsx: 'tsx',
  py: 'py',
  sh: 'sh',
  bash: 'sh',
  zsh: 'sh',
  sol: 'sol',
  rs: 'rs',
  go: 'go',
  java: 'java',
  kt: 'kt',
  swift: 'swift',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  cs: 'cs',
  yml: 'yaml',
  yaml: 'yaml',
  toml: 'toml',
  ini: 'ini',
};

function getLangFromUrl(u: string): { lang?: string; name?: string } {
  try {
    const { pathname } = new URL(u);
    const name = pathname.split('/').pop() || 'source';
    const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
    const lang = ext ? EXT_TO_LANG[ext] || ext : undefined;
    return { lang, name };
  } catch {
    return {};
  }
}

export default function QuantumRefactorPanel() {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string | null>(null);
  const [lang, setLang] = React.useState<string | undefined>(undefined);
  const [filename, setFilename] = React.useState<string | undefined>(undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCode(null);
    const trimmed = url.trim();
    if (!trimmed) return;

    const { lang: guessed, name } = getLangFromUrl(trimmed);
    setLang(guessed);
    setFilename(name);

    setLoading(true);
    try {
      const r = await fetch(`/api/fetch-code?url=${encodeURIComponent(trimmed)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'Failed to fetch');

      setCode(data.content as string);
      // Optional: refine language from content-type if no extension
      if (!guessed && typeof data.contentType === 'string') {
        if (data.contentType.includes('json')) setLang('json');
        if (data.contentType.includes('markdown')) setLang('md');
        if (data.contentType.includes('javascript')) setLang('js');
        if (data.contentType.includes('python')) setLang('py');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not load file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-xl">
      <div className="card-glass card-glass--xl" style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
          <span className="badge-secure">Post-Quantum Refactorizer</span>
        </div>

        <h2 className="gradient-text" style={{ fontSize: '2rem', margin: '0 0 1rem' }}>
          Secure your DeFi protocols against future quantum threats.
        </h2>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
          <input
            className="input-neo"
            placeholder="Enter link to smart contract or digital signature"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            spellCheck={false}
            inputMode="url"
          />
          <button className="btn-cta" type="submit" disabled={loading}>
            {loading ? 'Analyzing…' : 'ANALYZE & REFACTOR'}
          </button>
        </form>

        {error ? (
          <p className="muted" style={{ marginTop: '0.85rem', color: '#ff9aa8' }}>{error}</p>
        ) : null}
      </div>

      {code ? (
        <div style={{ maxWidth: 1100, margin: '1rem auto 0' }}>
          <CodeViewer code={code} language={lang} filename={filename} />
        </div>
      ) : null}
    </div>
  );
}
