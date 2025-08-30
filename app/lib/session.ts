import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie, setCookie, clearCookie } from './cookies';
import { signJwt, verifyJwt } from './jwt';

const SESSION_COOKIE = 'app_session';
const DAY = 60 * 60 * 24;

export type Session = {
  sub?: string;
  provider?: string;
  // store minimal info; avoid putting sensitive tokens in the cookie when possible
};

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET missing');
  return secret;
}

export function readSession(req: NextApiRequest): Session | null {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const payload = verifyJwt(token, getSessionSecret());
  if (!payload) return null;
  return (payload as Session) ?? null;
}

export function writeSession(res: NextApiResponse, data: Session, maxAgeSec = 7 * DAY) {
  const token = signJwt(data, getSessionSecret(), maxAgeSec);
  setCookie(res, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSec,
  });
}

export function clearSession(res: NextApiResponse) {
  clearCookie(res, SESSION_COOKIE);
}
