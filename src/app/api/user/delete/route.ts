import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser, SESSION_COOKIE_NAME } from '@/lib/auth';
import { deleteAccountSchema } from '@/lib/validation';
import { verifyPassword } from '@/lib/security';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = deleteAccountSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid confirmation format', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { password } = result.data;
    const fullUser = await db.users.findById(user.id);
    if (!fullUser) {
      return NextResponse.json({ error: 'User record not found' }, { status: 404 });
    }

    // Re-authentication check before account deletion
    const isPasswordValid = await verifyPassword(password, fullUser.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Account deletion aborted for security.' },
        { status: 403 }
      );
    }

    // Cascade delete all user records
    await db.users.deleteAccount(user.id);

    const response = NextResponse.json({
      success: true,
      message: 'Your SmartYatra account and all associated travel records have been permanently deleted.',
    });

    // Invalidate session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to process account deletion', message: err.message },
      { status: 500 }
    );
  }
}
