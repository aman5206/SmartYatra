import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/security';
import { db } from '@/lib/db';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rate = await checkRateLimit(ip, 'register');
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Error', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;
    const existing = await db.users.findByEmail(email);

    // Generic response if already registered to prevent email enumeration
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message:
            'Registration received. If this email is eligible, your account has been created. Please log in.',
        },
        { status: 201 }
      );
    }

    const passwordHash = await hashPassword(password);
    await db.users.create({
      name,
      email,
      passwordHash,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account successfully registered! You can now log in to SmartYatra.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Registration failed. Please check inputs and try again.' },
      { status: 500 }
    );
  }
}
