import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/db';

describe('Authorization & IDOR Protection Tests', () => {
  const userA = 'user_alice_123';
  const userB = 'user_bob_456';

  it('should prevent User B from viewing User A trip (IDOR protection)', async () => {
    // User A creates a trip
    const tripA = await db.trips.createTrip({
      userId: userA,
      destinationSlug: 'jaipur',
      destinationName: 'Jaipur',
      title: 'Alice Royal Jaipur Tour',
      durationDays: 3,
      groupType: 'Solo',
      budgetTier: 'Moderate',
      budgetEstimate: { dailyEstimateINR: 3000 },
      interests: ['history'],
      itinerary: [],
      isAiGenerated: false,
    });

    // User A should be able to view their own trip
    const fetchedByAlice = await db.trips.getTripById(tripA.id, userA);
    expect(fetchedByAlice).toBeDefined();
    expect(fetchedByAlice?.userId).toBe(userA);

    // User B trying to view Alice's trip should be rejected with UNAUTHORIZED
    await expect(db.trips.getTripById(tripA.id, userB)).rejects.toThrow('UNAUTHORIZED');
  });

  it('should prevent User B from deleting User A trip', async () => {
    const tripA = await db.trips.createTrip({
      userId: userA,
      destinationSlug: 'varanasi',
      destinationName: 'Varanasi',
      title: 'Alice Spiritual Tour',
      durationDays: 2,
      groupType: 'Solo',
      budgetTier: 'Budget',
      budgetEstimate: { dailyEstimateINR: 2000 },
      interests: ['spirituality'],
      itinerary: [],
      isAiGenerated: false,
    });

    // Bob attempts to delete Alice's trip
    await expect(db.trips.deleteTrip(tripA.id, userB)).rejects.toThrow('UNAUTHORIZED');

    // Alice's trip should still exist
    const stillExists = await db.trips.getTripById(tripA.id, userA);
    expect(stillExists).toBeDefined();

    // Alice deletes her own trip successfully
    const deleted = await db.trips.deleteTrip(tripA.id, userA);
    expect(deleted).toBe(true);
  });

  it('should isolate in-app searches per user', async () => {
    await db.searchHistory.addSearch(userA, 'Jaipur Forts');
    await db.searchHistory.addSearch(userB, 'Alleppey Backwaters');

    const aliceSearches = await db.searchHistory.getUserSearches(userA);
    const bobSearches = await db.searchHistory.getUserSearches(userB);

    expect(aliceSearches.some((s) => s.query === 'Jaipur Forts')).toBe(true);
    expect(aliceSearches.some((s) => s.query === 'Alleppey Backwaters')).toBe(false);

    expect(bobSearches.some((s) => s.query === 'Alleppey Backwaters')).toBe(true);
    expect(bobSearches.some((s) => s.query === 'Jaipur Forts')).toBe(false);
  });

  it('should isolate saved places per user', async () => {
    await db.savedPlaces.toggleSave(userA, 'hampi');
    await db.savedPlaces.toggleSave(userB, 'ladakh');

    const aliceSaved = await db.savedPlaces.getUserSavedPlaces(userA);
    const bobSaved = await db.savedPlaces.getUserSavedPlaces(userB);

    expect(aliceSaved.some((s) => s.destinationSlug === 'hampi')).toBe(true);
    expect(aliceSaved.some((s) => s.destinationSlug === 'ladakh')).toBe(false);

    expect(bobSaved.some((s) => s.destinationSlug === 'ladakh')).toBe(true);
    expect(bobSaved.some((s) => s.destinationSlug === 'hampi')).toBe(false);
  });
});
