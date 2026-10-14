import { NextRequest, NextResponse } from 'next/server';
import { tripPlannerSchema } from '@/lib/validation';
import { generateTripItinerary } from '@/lib/ai-service';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required to view saved trips' }, { status: 401 });
  }

  const trips = await db.trips.getUserTrips(user.id);
  return NextResponse.json({ trips });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const rate = await checkRateLimit(ip, 'ai');
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    const body = await req.json();
    const result = tripPlannerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid trip parameters', issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { destinationSlug, durationDays, groupType, budgetTier, interests } = result.data;

    // Generate itinerary using AI or intelligent rule-based engine
    const plan = await generateTripItinerary({
      destinationSlug,
      durationDays,
      groupType,
      budgetTier,
      interests,
    });

    // If user is authenticated, persist trip to their profile
    const user = await getSessionUser();
    let savedTripId: string | undefined = undefined;

    if (user) {
      const savedTrip = await db.trips.createTrip({
        userId: user.id,
        destinationSlug,
        destinationName: plan.destination,
        title: plan.title,
        durationDays,
        groupType,
        budgetTier,
        budgetEstimate: { dailyEstimateINR: plan.estimatedDailyBudgetINR },
        interests,
        itinerary: plan.days,
        isAiGenerated: plan.isAiGenerated,
      });
      savedTripId = savedTrip.id;
    }

    return NextResponse.json({
      success: true,
      plan,
      savedTripId,
      isAuthenticated: !!user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Trip planning service error', message: err.message },
      { status: 500 }
    );
  }
}
