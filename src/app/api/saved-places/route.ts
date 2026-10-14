import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const toggleSaveSchema = z.object({
  destinationSlug: z.string().min(1).max(80),
  notes: z.string().max(300).optional(),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const savedPlaces = await db.savedPlaces.getUserSavedPlaces(user.id);
  return NextResponse.json({ savedPlaces });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to save places to your personal travel memory.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const result = toggleSaveSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid destination payload' }, { status: 400 });
    }

    const { destinationSlug, notes } = result.data;
    const res = await db.savedPlaces.toggleSave(user.id, destinationSlug, notes);
    return NextResponse.json({ success: true, ...res });
  } catch {
    return NextResponse.json({ error: 'Failed to update saved place' }, { status: 500 });
  }
}
