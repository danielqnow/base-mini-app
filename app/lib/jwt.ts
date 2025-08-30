import crypto from 'crypto';

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export type JwtPayload = Record<string, any>;

export function signJwt(payload: JwtPayload, secret: string, expiresInSec: number) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + expiresInSec, ...payload };

  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(body));
  const toSign = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac('sha256', secret).update(toSign).digest();
  const sigB64 = b64url(sig);
  return `${toSign}.${sigB64}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload | null {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const toSign = `${h}.${p}`;
    const expected = b64url(crypto.createHmac('sha256', secret).update(toSign).digest());
    if (expected !== s) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
