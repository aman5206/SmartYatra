import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, createSessionToken } from '@/lib/security';
import { db } from '@/lib/db';
import { checkRateLimit, rateLimitResponse, resetRateLimit } from '@/lib/rate-limit';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rate = await checkRateLimit(ip, 'login');
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    if (rate.delayMs > 0) {
      await new Promise((r) => setTimeout(r, rate.delayMs));
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format' },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await db.users.findByEmail(email);

    // Generic failure message to protect against user enumeration
    const genericErrorMsg = 'Invalid email or password. Please try again.';

    if (!user) {
      return NextResponse.json({ error: genericErrorMsg }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: genericErrorMsg }, { status: 401 });
    }

    // Reset rate limit on valid credentials
    resetRateLimit(ip, 'login');

    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: 'sess_' + Math.random().toString(36).substring(2),
      name: user.name || 'Traveler',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 500 }
    );
  }
}
