import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation';
import { generateSecureToken, hashToken } from '@/lib/security';
import { db } from '@/lib/db';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rate = await checkRateLimit(ip, 'reset');
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { email } = result.data;
    const user = await db.users.findByEmail(email);

    // Generic response regardless of whether user exists
    const genericResponse = {
      success: true,
      message:
        'If an account is associated with this email, password reset instructions have been dispatched. For local testing, inspect the simulated token returned in non-production mode.',
      // In development mode only, provide simulation token for immediate local testing without requiring an SMTP relay
      demoToken: process.env.NODE_ENV !== 'production' && user ? undefined : undefined,
    };

    if (user) {
      const rawToken = generateSecureToken();
      const tokenHash = hashToken(rawToken);
      await db.tokens.create(email, tokenHash, 'PASSWORD_RESET', 30); // 30 minutes validity

      // In development or local evaluation, we also provide the reset link in the server log
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[SmartYatra Security Notice] Simulated password reset token for ${email}: ${rawToken}`);
        // Return demo token for test runners or local testing
        return NextResponse.json({
          ...genericResponse,
          simulatedTokenForTesting: rawToken,
        });
      }
    }

    return NextResponse.json(genericResponse);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Password reset service temporarily unavailable' },
      { status: 500 }
    );
  }
}
