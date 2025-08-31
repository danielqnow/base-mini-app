export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

function isValidUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeToRaw(input: string): string {
  const u = new URL(input);

  if (u.hostname === 'github.com') {
    const parts = u.pathname.split('/').filter(Boolean);
    const blobIdx = parts.indexOf('blob');
    const rawIdx = parts.indexOf('raw');

    if (blobIdx !== -1 && parts.length > blobIdx + 2) {
      const [owner, repo] = parts;
      const branch = parts[blobIdx + 1];
      const filePath = parts.slice(blobIdx + 2).join('/');
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    }
    if (rawIdx !== -1 && parts.length > rawIdx + 2) {
      const [owner, repo] = parts;
      const branch = parts[rawIdx + 1];
      const filePath = parts.slice(rawIdx + 2).join('/');
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    }
    // Fallback: ask for plain view if we couldn't map
    u.searchParams.set('plain', '1');
    return u.toString();
  }

  if (u.hostname === 'gist.github.com') {
    const parts = u.pathname.split('/').filter(Boolean); // user/gistId[/filename]
    if (parts.length >= 2) {
      const [user, id, ...rest] = parts;
      const base = `https://gist.githubusercontent.com/${user}/${id}/raw`;
      return rest.length ? `${base}/${rest.join('/')}` : base;
    }
  }

  if (u.hostname === 'raw.githubusercontent.com') return u.toString();

  if (u.hostname === 'gitlab.com') {
    // .../blob/<branch>/path -> .../raw/<branch>/path
    const parts = u.pathname.split('/').filter(Boolean);
    const idx = parts.indexOf('blob');
    if (idx !== -1) {
      parts[idx] = 'raw';
      u.pathname = '/' + parts.join('/');
      return u.toString();
    }
  }

  if (u.hostname === 'bitbucket.org') {
    // .../src/<branch>/path?raw=1
    u.searchParams.set('raw', '1');
    return u.toString();
  }

  return u.toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = String(body?.url || '').trim();

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    let normalized: string;
    try {
      normalized = normalizeToRaw(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(normalized, {
      method: 'GET',
      headers: {
        Accept: 'text/plain, application/octet-stream;q=0.9, */*;q=0.8',
        'User-Agent': 'base-mini-app/1.0',
      },
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error (${res.status}) fetching file` },
        { status: 502 }
      );
    }

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'Received HTML page instead of raw file. Provide a raw URL. You should copy and paste the code.' },
        { status: 415 }
      );
    }

    const code = await res.text();
    if (!code.trim()) {
      return NextResponse.json({ error: 'Empty file' }, { status: 422 });
    }
    if (code.length > 500_000) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    return NextResponse.json({ code });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.name === 'AbortError' ? 'Fetch timed out' : 'Unexpected error' },
      { status: 500 }
    );
  }
}
