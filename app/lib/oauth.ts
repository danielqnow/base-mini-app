import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { setCookie, getCookie, clearCookie } from './cookies';
import { writeSession } from './session';

const STATE_COOKIE = 'oauth_state';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} missing`);
  return v;
}

export function buildAuthorizeUrl(req: NextApiRequest): string {
  const authorizeUrl = required('AUTH_PROVIDER_AUTHORIZE_URL');
  const clientId = required('AUTH_CLIENT_ID');
  const redirectUri = required('AUTH_REDIRECT_URI');
  const scope = process.env.AUTH_SCOPE || 'openid';
  const state = crypto.randomBytes(16).toString('hex');

  // store state in a short-lived cookie
  setCookie(req.res as NextApiResponse, STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300,
    path: '/',
  });

  const url = new URL(authorizeUrl);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);
  // If your provider needs extra params (e.g. prompt, audience), add here.

  return url.toString();
}

export async function handleOAuthCallback(req: NextApiRequest, res: NextApiResponse) {
  const tokenUrl = required('AUTH_PROVIDER_TOKEN_URL');
  const clientId = required('AUTH_CLIENT_ID');
  const clientSecret = required('AUTH_CLIENT_SECRET');
  const redirectUri = required('AUTH_REDIRECT_URI');

  const { code, state } = req.query;
  if (typeof code !== 'string' || typeof state !== 'string') {
    res.status(400).send('Invalid code/state');
    return;
  }

  const expectedState = getCookie(req, STATE_COOKIE);
  clearCookie(res, STATE_COOKIE);

  if (!expectedState || expectedState !== state) {
    res.status(400).send('State mismatch');
    return;
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', redirectUri);
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);

  const r = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    res.status(502).send(`Token exchange failed ${r.status}: ${text}`);
    return;
  }

  const tokenResponse = (await r.json()) as {
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  // Minimal session; you can enrich with id_token claims if desired.
  writeSession(res, { provider: 'oauth' });

  // Redirect to app root (or a 'next' param).
  const next = typeof req.query.next === 'string' ? req.query.next : '/';
  res.writeHead(302, { Location: next });
  res.end();
}
