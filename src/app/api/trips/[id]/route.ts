import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const trip = await db.trips.getTripById(id, user.id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ trip });
  } catch (err: any) {
    if (err.message.includes('UNAUTHORIZED')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to access another user\'s trip data.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const success = await db.trips.deleteTrip(id, user.id);
    if (!success) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Trip itinerary deleted successfully' });
  } catch (err: any) {
    if (err.message.includes('UNAUTHORIZED')) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot delete another user\'s trip.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
