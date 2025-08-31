import React from 'react';

type Props = {
  code: string;
  language?: string; // e.g., 'py', 'js', 'ts', 'sol', 'txt'
  filename?: string;
  className?: string;
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function guessKeywords(lang?: string): string[] {
  const base = ['if','else','for','while','return','class','const','let','var','function','switch','case','break','continue','new','try','catch','finally','throw','import','export','from','as'];
  if (!lang) return base;
  if (['ts','js','jsx','tsx'].includes(lang)) return base.concat(['interface','type','extends','implements','this','super','await','async','yield','of','in']);
  if (['py','python'].includes(lang)) return ['def','class','return','if','elif','else','for','while','try','except','finally','with','as','import','from','pass','break','continue','lambda','yield','True','False','None','and','or','not','in','is','global','nonlocal','async','await','raise'];
  if (['sol','solidity'].includes(lang)) return ['pragma','solidity','contract','library','interface','function','returns','event','modifier','public','external','internal','private','view','pure','payable','memory','storage','calldata','mapping','struct','enum','emit','require','revert','assert','return','if','else','for','while'];
  if (['sh','bash','zsh'].includes(lang)) return ['if','then','else','elif','fi','for','in','do','done','case','esac','function','return','local','export'];
  if (['json'].includes(lang)) return ['true','false','null'];
  return base;
}

function highlight(code: string, lang?: string) {
  // order matters; start with escaping
  let s = escapeHtml(code);

  // block comments /* ... */ and python triple quotes for a few langs
  if (lang && ['js','ts','tsx','jsx','sol','c','cpp','java','kt','go','rs'].includes(lang)) {
    s = s.replace(/\/\*[\s\S]*?\*\//g, m => `<span class="comment">${m}</span>`);
  }
  s = s
    // line comments //... and #...
    .replace(/(^|\s)\/\/.*/gm, m => `<span class="comment">${m}</span>`)
    .replace(/(^|\s)#.*/gm, m => `<span class="comment">${m}</span>`)
    // strings
    .replace(/([`'"])(?:\\.|(?!\1).)*\1/gm, m => `<span class="str">${m}</span>`)
    // numbers
    .replace(/\b(?<![A-Za-z_])\d+(\.\d+)?\b/g, m => `<span class="num">${m}</span>`);

  // keywords
  const kws = guessKeywords(lang)
    .sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  if (kws) {
    const kwRe = new RegExp(`\\b(${kws})\\b`, 'g');
    s = s.replace(kwRe, '<span class="kw">$1</span>');
  }

  // function names: foo(  -> wrap foo
  s = s.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>');

  return s;
}

export function CodeViewer({ code, language, filename, className }: Props) {
  const html = React.useMemo(() => highlight(code, language), [code, language]);

  return (
    <div className={`card-glass ${className || ''}`} style={{ padding: 0 }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
        <span className="badge-secure">{filename || 'Source'}</span>
        {language ? <span className="muted" style={{ fontSize: '.8rem' }}>{language}</span> : null}
      </div>
      <pre className="code-neo" style={{ margin: 0, borderRadius: '0 0 14px 14px' }}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

export default CodeViewer;
