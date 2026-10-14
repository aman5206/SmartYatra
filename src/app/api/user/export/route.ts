import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const exportData = await db.users.exportUserData(user.id);
  if (!exportData) {
    return NextResponse.json({ error: 'User data not found' }, { status: 404 });
  }

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="smartyatra-data-export-${user.id}.json"`,
    },
  });
}
