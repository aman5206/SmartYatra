import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validation';
import { hashToken, hashPassword } from '@/lib/security';
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
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid reset parameters', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, newPassword } = result.data;
    const tokenHash = hashToken(token);

    const tokenRecord = await db.tokens.findAndValidate(tokenHash, 'PASSWORD_RESET');
    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'Password reset token is invalid, expired, or has already been used.' },
        { status: 400 }
      );
    }

    const user = await db.users.findByEmail(tokenRecord.identifier);
    if (!user) {
      return NextResponse.json({ error: 'Associated user account not found.' }, { status: 404 });
    }

    const newHash = await hashPassword(newPassword);
    await db.users.updatePassword(user.id, newHash);
    await db.tokens.markUsed(tokenHash);

    return NextResponse.json({
      success: true,
      message: 'Your password has been securely updated. You can now log in with your new password.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Password update failed. Please try again.' },
      { status: 500 }
    );
  }
}
