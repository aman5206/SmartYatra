import { cookies } from 'next/headers';
import { verifySessionToken, SessionPayload } from './security';
import { db } from './db';

export const SESSION_COOKIE_NAME = 'smartyatra_session';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences?: {
    interests: string[];
    consentPersonalization: boolean;
    consentActivityHistory: boolean;
    preferredLanguage: string;
    defaultCurrency: string;
  };
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload: SessionPayload | null = await verifySessionToken(token);
  if (!payload || !payload.userId) return null;

  const user = await db.users.findById(payload.userId);
  if (user) {
    return {
      id: user.id,
      name: user.name || 'Traveler',
      email: user.email,
      role: user.role,
      preferences: 'preferences' in user && user.preferences ? user.preferences : undefined,
    };
  }

  // Stateless serverless demo mode fallback:
  // Since the token is cryptographically verified with HS256, safely reconstruct user from payload
  return {
    id: payload.userId,
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    role: payload.role || 'USER',
    preferences: {
      interests: ['heritage', 'culture', 'food', 'nature'],
      consentPersonalization: true,
      consentActivityHistory: true,
      preferredLanguage: 'en',
      defaultCurrency: 'INR',
    },
  };
}

export async function requireAuthUser(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}
