import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { updatePreferencesSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = updatePreferencesSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid preferences payload', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await db.users.updatePreferences(user.id, result.data);
    return NextResponse.json({ success: true, preferences: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
