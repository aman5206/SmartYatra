import * as argon2 from '@node-rs/argon2';
import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

// Argon2id configuration matching OWASP recommendations
const ARGON2_OPTIONS: argon2.Options = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,       // 2 iterations
  parallelism: 1,    // 1 lane
};

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'smartyatra-dev-super-secure-jwt-secret-key-32chars!'
);

export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  return await argon2.hash(plainPassword, ARGON2_OPTIONS);
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically random token string for email verification or password reset.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Produces a SHA-256 hash of a token to be stored in the database.
 * The raw token is sent to the user via link/email, preventing database leak compromise.
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  name?: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      sessionId: payload.sessionId as string,
      name: (payload.name as string) || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Basic sanitization to prevent stored XSS and remove unwanted control characters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // strip < and >
    .trim()
    .slice(0, 10000); // enforce sanity bounds
}
