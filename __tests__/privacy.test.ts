import { describe, it, expect } from 'vitest';
import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/security';

describe('Privacy & Data Governance Tests (DPDP Act)', () => {
  it('should export all user data in structured JSON format', async () => {
    const passwordHash = await hashPassword('ExportTestPass123!');
    const user = await db.users.create({
      name: 'Ananya Roy',
      email: 'ananya@example.com',
      passwordHash,
    });

    // Add some activity
    await db.trips.createTrip({
      userId: user.id,
      destinationSlug: 'munnar',
      destinationName: 'Munnar & Alleppey',
      title: 'Ananya Kerala Trip',
      durationDays: 4,
      groupType: 'Couple',
      budgetTier: 'Comfortable',
      budgetEstimate: {},
      interests: ['nature'],
      itinerary: [],
      isAiGenerated: false,
    });
    await db.savedPlaces.toggleSave(user.id, 'munnar');
    await db.searchHistory.addSearch(user.id, 'Tea estates');

    const exported = await db.users.exportUserData(user.id);
    expect(exported).toBeDefined();
    expect(exported?.profile.email).toBe('ananya@example.com');
    expect(exported?.trips).toHaveLength(1);
    expect(exported?.savedPlaces).toHaveLength(1);
    expect(exported?.searchHistory).toHaveLength(1);
    expect(exported?.dpdpNotice).toBeDefined();
  });

  it('should completely cascade delete user data upon account deletion', async () => {
    const passwordHash = await hashPassword('DeleteTestPass123!');
    const user = await db.users.create({
      name: 'Vikas Gupta',
      email: 'vikas@example.com',
      passwordHash,
    });

    await db.trips.createTrip({
      userId: user.id,
      destinationSlug: 'hampi',
      destinationName: 'Hampi',
      title: 'Vikas Hampi Tour',
      durationDays: 2,
      groupType: 'Solo',
      budgetTier: 'Budget',
      budgetEstimate: {},
      interests: ['history'],
      itinerary: [],
      isAiGenerated: false,
    });
    await db.savedPlaces.toggleSave(user.id, 'hampi');
    await db.searchHistory.addSearch(user.id, 'Stone chariot');

    // Perform cascade account deletion
    const deleted = await db.users.deleteAccount(user.id);
    expect(deleted).toBe(true);

    // Verify user no longer exists
    const checkUser = await db.users.findById(user.id);
    expect(checkUser).toBeNull();

    // Verify trips, saved places, and searches were deleted
    const userTrips = await db.trips.getUserTrips(user.id);
    expect(userTrips).toHaveLength(0);

    const userSaved = await db.savedPlaces.getUserSavedPlaces(user.id);
    expect(userSaved).toHaveLength(0);

    const userSearches = await db.searchHistory.getUserSearches(user.id);
    expect(userSearches).toHaveLength(0);
  });
});
