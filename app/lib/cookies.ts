import type { NextApiRequest, NextApiResponse } from 'next';

export function getCookie(req: NextApiRequest, name: string): string | undefined {
  const cookie = req.headers.cookie || '';
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='));
  if (!match) return undefined;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

type CookieOpts = {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
};

export function setCookie(res: NextApiResponse, name: string, value: string, opts: CookieOpts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts.path ?? '/'}`);
  if (opts.httpOnly) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (typeof opts.maxAge === 'number') parts.push(`Max-Age=${Math.max(0, Math.floor(opts.maxAge))}`);
  res.setHeader('Set-Cookie', appendSetCookie(res.getHeader('Set-Cookie'), parts.join('; ')));
}

export function clearCookie(res: NextApiResponse, name: string) {
  setCookie(res, name, '', { path: '/', maxAge: 0 });
}

function appendSetCookie(existing: number | string | string[] | undefined, value: string): string[] {
  if (!existing) return [value];
  if (Array.isArray(existing)) return [...existing, value];
  return [existing, value];
}
