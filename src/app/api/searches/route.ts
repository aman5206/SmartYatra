import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { searchLogSchema } from '@/lib/validation';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ searches: [] });
  }

  const searches = await db.searchHistory.getUserSearches(user.id);
  return NextResponse.json({ searches });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    // Guest searches are kept in browser session / memory, not saved permanently
    return NextResponse.json({ logged: false, reason: 'Guest search not persisted to database' });
  }

  try {
    const body = await req.json();
    const result = searchLogSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid search data' }, { status: 400 });
    }

    const { query, category, filters } = result.data;
    await db.searchHistory.addSearch(user.id, query, category, filters);
    return NextResponse.json({ logged: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record search' }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  await db.searchHistory.clearUserSearches(user.id);
  return NextResponse.json({ success: true, message: 'Your in-app search history has been completely cleared.' });
}
