export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

function isValidUrl(u: string) {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10_000);

    const resp = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain, application/javascript, application/json, text/html, */*',
      },
    }).catch((e) => {
      throw new Error(e?.message || 'Fetch failed');
    }).finally(() => clearTimeout(t));

    if (!resp.ok) {
      return NextResponse.json({ error: `Upstream error ${resp.status}` }, { status: 502 });
    }

    // Simple size guard (~2MB)
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    const text = buf.toString('utf8');
    return NextResponse.json({ code: text }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
