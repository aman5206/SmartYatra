import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const rate = await checkRateLimit(ip, 'search');
  if (!rate.success) {
    return rateLimitResponse(rate);
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const state = searchParams.get('state') || undefined;

  const destinations = await db.destinations.search({ query, category, state });
  return NextResponse.json({ destinations });
}
