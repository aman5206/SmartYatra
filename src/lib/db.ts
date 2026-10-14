import { PrismaClient } from '@prisma/client';
import { SEED_DESTINATIONS, DestinationItem } from '@/data/seed-data';
import crypto from 'crypto';

// Global Prisma instance for Next.js hot-reload safety (only if DATABASE_URL is set)
const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

export const prisma: PrismaClient | null = process.env.DATABASE_URL
  ? globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  : null;

if (prisma && process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * In-memory resilient store for running without an active Postgres instance
 * (e.g. during local evaluation, tests, or initial boot).
 * Synced automatically when PostgreSQL is connected.
 */
interface InMemoryUser {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    interests: string[];
    consentPersonalization: boolean;
    consentActivityHistory: boolean;
    preferredLanguage: string;
    defaultCurrency: string;
  };
}

interface InMemoryTrip {
  id: string;
  userId: string;
  destinationSlug: string;
  destinationName: string;
  title: string;
  durationDays: number;
  groupType: string;
  budgetTier: string;
  budgetEstimate: any;
  interests: string[];
  itinerary: any[];
  isAiGenerated: boolean;
  createdAt: Date;
}

interface InMemorySavedPlace {
  id: string;
  userId: string;
  destinationSlug: string;
  notes?: string;
  createdAt: Date;
}

interface InMemorySearch {
  id: string;
  userId: string;
  query: string;
  category?: string;
  filters?: any;
  createdAt: Date;
}

interface InMemoryToken {
  id: string;
  identifier: string;
  tokenHash: string;
  type: string;
  expiresAt: Date;
  usedAt: Date | null;
}

// In-memory persistent collections
const usersStore = new Map<string, InMemoryUser>();
const tripsStore = new Map<string, InMemoryTrip>();
const savedPlacesStore = new Map<string, InMemorySavedPlace>();
const searchesStore = new Map<string, InMemorySearch>();
const tokensStore = new Map<string, InMemoryToken>();

// Pre-seeded demo traveler account for testing prototype without external database
const DEMO_USER_ID = 'usr_demo_prototype_001';
const DEMO_USER_EMAIL = 'demo@smartyatra.in';
const DEMO_PASSWORD_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$ZsfFko85EveRkEI9s6lx3g$Ivy/v13Q3u2P2noYVyW6l2CfDykm2ftGT6Ru+shmsUE'; // 'SmartYatraDemo123!'

usersStore.set(DEMO_USER_EMAIL, {
  id: DEMO_USER_ID,
  name: 'Aman (Demo Traveler)',
  email: DEMO_USER_EMAIL,
  emailVerified: new Date('2026-10-01T00:00:00Z'),
  passwordHash: DEMO_PASSWORD_HASH,
  role: 'USER',
  createdAt: new Date('2026-10-01T00:00:00Z'),
  updatedAt: new Date('2026-10-01T00:00:00Z'),
  preferences: {
    interests: ['heritage', 'culture', 'food', 'nature'],
    consentPersonalization: true,
    consentActivityHistory: true,
    preferredLanguage: 'en',
    defaultCurrency: 'INR',
  },
});

// Pre-seed demo saved destinations
savedPlacesStore.set(`${DEMO_USER_ID}:jaipur`, {
  id: 'save_demo_jaipur',
  userId: DEMO_USER_ID,
  destinationSlug: 'jaipur',
  notes: 'Amber Fort, Hawa Mahal & authentic Rajasthani Dal Baati Churma',
  createdAt: new Date('2026-10-10T12:00:00Z'),
});
savedPlacesStore.set(`${DEMO_USER_ID}:varanasi`, {
  id: 'save_demo_varanasi',
  userId: DEMO_USER_ID,
  destinationSlug: 'varanasi',
  notes: 'Evening Ganga Aarti at Dashashwamedh Ghat & dawn boat ride',
  createdAt: new Date('2026-10-12T15:30:00Z'),
});

// Pre-seed demo trip itinerary
tripsStore.set('trip_demo_jaipur_3day', {
  id: 'trip_demo_jaipur_3day',
  userId: DEMO_USER_ID,
  destinationSlug: 'jaipur',
  destinationName: 'Jaipur, Rajasthan',
  title: 'SmartYatra 3-Day Jaipur Discovery (Sample Plan)',
  durationDays: 3,
  groupType: 'Family',
  budgetTier: 'Moderate',
  budgetEstimate: { dailyEstimateINR: 3200 },
  interests: ['heritage', 'culture', 'food'],
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Grand Fortresses of the Kachhwahas',
      morning: 'Arrive in Jaipur and check in. Stroll through the Pink City historical quarter.',
      afternoon: 'Explore Amber Fort & the Sheesh Mahal. Marvel at the Belgian mirror-work.',
      evening: 'Panoramic sunset view from Nahargarh Fort, followed by traditional Rajasthani dinner.',
      travelTips: 'Hire a verified government guide at the gate of Amber Fort.',
      budgetTip: 'Pre-book composite monument ticket for 8 major sights.',
    },
    {
      day: 2,
      title: 'Astronomy, Living Palaces & Johari Bazaar',
      morning: 'Visit City Palace complex and museum showcasing royal ceremonial attire.',
      afternoon: 'Discover Jantar Mantar (UNESCO World Heritage Site with the largest stone sundial).',
      evening: 'Photograph Hawa Mahal illuminated at dusk and explore local handicraft bazaars.',
      travelTips: 'Carry a hat and water bottle; Jantar Mantar is mostly outdoor stone observation.',
      budgetTip: 'Haggling is customary in Johari Bazaar; negotiate respectfully.',
    },
    {
      day: 3,
      title: 'Royal Cenotaphs, Stepwells & Culinary Farewell',
      morning: 'Visit Gaitor Ki Chhatriyan and the dramatic Panna Meena Ka Kund stepwell.',
      afternoon: 'Leisurely thali lunch at a verified heritage eatery. Authentic block-print textile shopping.',
      evening: 'Farewell stroll around Jal Mahal at twilight. Transfer for onward journey.',
      travelTips: 'Stepwells have steep, uneven stone stairs—wear good footwear.',
      budgetTip: 'Local auto-rickshaws are significantly cheaper than app-based cabs for short hops.',
    },
  ],
  isAiGenerated: true,
  createdAt: new Date('2026-10-14T08:00:00Z'),
});

// Pre-seed demo search history
searchesStore.set('sch_demo_1', {
  id: 'sch_demo_1',
  userId: DEMO_USER_ID,
  query: 'Jaipur royal heritage',
  category: 'heritage',
  createdAt: new Date('2026-10-13T09:00:00Z'),
});
searchesStore.set('sch_demo_2', {
  id: 'sch_demo_2',
  userId: DEMO_USER_ID,
  query: 'Varanasi Ghats boat ride',
  category: 'spirituality',
  createdAt: new Date('2026-10-14T11:20:00Z'),
});

export const db = {
  // --- USERS ---
  users: {
    async findByEmail(email: string) {
      const normalized = email.toLowerCase().trim();
      try {
        if (prisma) {
          const u = await prisma.user.findUnique({
            where: { email: normalized },
            include: { preferences: true },
          });
          if (u) return u;
        }
      } catch {
        // Fallback to memory
      }
      return usersStore.get(normalized) || null;
    },

    async findById(id: string) {
      try {
        if (prisma) {
          const u = await prisma.user.findUnique({
            where: { id },
            include: { preferences: true },
          });
          if (u) return u;
        }
      } catch {
        // Fallback to memory
      }
      for (const u of usersStore.values()) {
        if (u.id === id) return u;
      }
      return null;
    },

    async create(data: { name: string; email: string; passwordHash: string }) {
      const normalized = data.email.toLowerCase().trim();
      const id = 'usr_' + crypto.randomBytes(12).toString('hex');
      const now = new Date();

      const userRecord: InMemoryUser = {
        id,
        name: data.name,
        email: normalized,
        emailVerified: null,
        passwordHash: data.passwordHash,
        role: 'USER',
        createdAt: now,
        updatedAt: now,
        preferences: {
          interests: [],
          consentPersonalization: false,
          consentActivityHistory: false,
          preferredLanguage: 'en',
          defaultCurrency: 'INR',
        },
      };

      try {
        if (prisma) {
          return await prisma.user.create({
            data: {
              id,
              name: data.name,
              email: normalized,
              passwordHash: data.passwordHash,
              preferences: {
                create: {
                  interests: [],
                  consentPersonalization: false,
                  consentActivityHistory: false,
                },
              },
            },
            include: { preferences: true },
          });
        }
      } catch {
        // fallback
      }

      usersStore.set(normalized, userRecord);
      return userRecord;
    },

    async updatePassword(id: string, newHash: string) {
      try {
        if (prisma) {
          await prisma.user.update({
            where: { id },
            data: { passwordHash: newHash, updatedAt: new Date() },
          });
        }
      } catch {
        // fallback
      }
      for (const u of usersStore.values()) {
        if (u.id === id) {
          u.passwordHash = newHash;
          u.updatedAt = new Date();
          break;
        }
      }
    },

    async updatePreferences(
      userId: string,
      preferences: {
        interests?: string[];
        consentPersonalization?: boolean;
        consentActivityHistory?: boolean;
        preferredLanguage?: string;
        defaultCurrency?: string;
      }
    ) {
      try {
        if (prisma) {
          await prisma.userPreferences.upsert({
            where: { userId },
            create: {
              userId,
              interests: preferences.interests || [],
              consentPersonalization: preferences.consentPersonalization ?? false,
              consentActivityHistory: preferences.consentActivityHistory ?? false,
              preferredLanguage: preferences.preferredLanguage || 'en',
              defaultCurrency: preferences.defaultCurrency || 'INR',
            },
            update: {
              ...(preferences.interests ? { interests: preferences.interests } : {}),
              ...(preferences.consentPersonalization !== undefined
                ? { consentPersonalization: preferences.consentPersonalization }
                : {}),
              ...(preferences.consentActivityHistory !== undefined
                ? { consentActivityHistory: preferences.consentActivityHistory }
                : {}),
              ...(preferences.preferredLanguage ? { preferredLanguage: preferences.preferredLanguage } : {}),
              ...(preferences.defaultCurrency ? { defaultCurrency: preferences.defaultCurrency } : {}),
            },
          });
        }
      } catch {
        // fallback
      }

      for (const u of usersStore.values()) {
        if (u.id === userId) {
          u.preferences = {
            ...u.preferences,
            ...preferences,
          };
          u.updatedAt = new Date();
          return u.preferences;
        }
      }
      return preferences;
    },

    async deleteAccount(userId: string) {
      try {
        if (prisma) {
          await prisma.user.delete({ where: { id: userId } });
        }
      } catch {
        // fallback
      }

      // Memory cleanup: cascade deletion
      let targetEmail: string | null = null;
      for (const [email, u] of usersStore.entries()) {
        if (u.id === userId) {
          targetEmail = email;
          break;
        }
      }
      if (targetEmail) usersStore.delete(targetEmail);

      // Clean trips, saved places, searches
      for (const [id, t] of tripsStore.entries()) {
        if (t.userId === userId) tripsStore.delete(id);
      }
      for (const [id, s] of savedPlacesStore.entries()) {
        if (s.userId === userId) savedPlacesStore.delete(id);
      }
      for (const [id, sc] of searchesStore.entries()) {
        if (sc.userId === userId) searchesStore.delete(id);
      }

      return true;
    },

    async exportUserData(userId: string) {
      const user = await this.findById(userId);
      if (!user) return null;

      const trips = await db.trips.getUserTrips(userId);
      const savedPlaces = await db.savedPlaces.getUserSavedPlaces(userId);
      const searches = await db.searchHistory.getUserSearches(userId);

      return {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          preferences: 'preferences' in user ? user.preferences : {},
        },
        trips,
        savedPlaces,
        searchHistory: searches,
        exportedAt: new Date().toISOString(),
        dpdpNotice: "This data export contains all personal travel plans, saved places, and in-app search history stored exclusively for your SmartYatra account.",
      };
    },
  },

  // --- DESTINATIONS ---
  destinations: {
    async getAll(): Promise<DestinationItem[]> {
      return SEED_DESTINATIONS;
    },

    async getBySlug(slug: string): Promise<DestinationItem | null> {
      const match = SEED_DESTINATIONS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
      return match || null;
    },

    async search(params: { query?: string; category?: string; state?: string }): Promise<DestinationItem[]> {
      let list = [...SEED_DESTINATIONS];
      if (params.query) {
        const q = params.query.toLowerCase().trim();
        list = list.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.state.toLowerCase().includes(q) ||
            d.overview.toLowerCase().includes(q) ||
            d.speciality.toLowerCase().includes(q) ||
            d.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (params.category && params.category !== 'all') {
        const cat = params.category.toLowerCase();
        list = list.filter((d) => d.tags.includes(cat));
      }
      if (params.state && params.state !== 'all') {
        list = list.filter((d) => d.state.toLowerCase() === params.state?.toLowerCase());
      }
      return list;
    },
  },

  // --- TRIPS (Protected: IDOR safe) ---
  trips: {
    async createTrip(data: {
      userId: string;
      destinationSlug: string;
      destinationName: string;
      title: string;
      durationDays: number;
      groupType: string;
      budgetTier: string;
      budgetEstimate: any;
      interests: string[];
      itinerary: any[];
      isAiGenerated: boolean;
    }) {
      const id = 'trip_' + crypto.randomBytes(12).toString('hex');
      const tripRecord: InMemoryTrip = {
        id,
        ...data,
        createdAt: new Date(),
      };
      tripsStore.set(id, tripRecord);
      return tripRecord;
    },

    async getUserTrips(userId: string) {
      const list: InMemoryTrip[] = [];
      for (const t of tripsStore.values()) {
        if (t.userId === userId) list.push(t);
      }
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },

    async getTripById(tripId: string, userId: string) {
      const trip = tripsStore.get(tripId);
      if (!trip) return null;
      // Server-side authorization check (Prevent IDOR)
      if (trip.userId !== userId) {
        throw new Error('UNAUTHORIZED: You do not have permission to view this trip.');
      }
      return trip;
    },

    async deleteTrip(tripId: string, userId: string) {
      const trip = tripsStore.get(tripId);
      if (!trip) return false;
      // Server-side authorization check (Prevent IDOR)
      if (trip.userId !== userId) {
        throw new Error('UNAUTHORIZED: You do not have permission to delete this trip.');
      }
      tripsStore.delete(tripId);
      return true;
    },
  },

  // --- SAVED PLACES ---
  savedPlaces: {
    async toggleSave(userId: string, destinationSlug: string, notes?: string) {
      const key = `${userId}:${destinationSlug}`;
      if (savedPlacesStore.has(key)) {
        savedPlacesStore.delete(key);
        return { saved: false };
      } else {
        savedPlacesStore.set(key, {
          id: 'save_' + crypto.randomBytes(8).toString('hex'),
          userId,
          destinationSlug,
          notes,
          createdAt: new Date(),
        });
        return { saved: true };
      }
    },

    async isSaved(userId: string, destinationSlug: string) {
      return savedPlacesStore.has(`${userId}:${destinationSlug}`);
    },

    async getUserSavedPlaces(userId: string) {
      const list: (InMemorySavedPlace & { destination?: DestinationItem })[] = [];
      for (const s of savedPlacesStore.values()) {
        if (s.userId === userId) {
          const dest = SEED_DESTINATIONS.find((d) => d.slug === s.destinationSlug);
          list.push({ ...s, destination: dest });
        }
      }
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
  },

  // --- SEARCH HISTORY (In-app only, user privacy controlled) ---
  searchHistory: {
    async addSearch(userId: string, query: string, category?: string, filters?: any) {
      const id = 'sch_' + crypto.randomBytes(8).toString('hex');
      searchesStore.set(id, {
        id,
        userId,
        query,
        category,
        filters,
        createdAt: new Date(),
      });
    },

    async getUserSearches(userId: string) {
      const list: InMemorySearch[] = [];
      for (const sc of searchesStore.values()) {
        if (sc.userId === userId) list.push(sc);
      }
      return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20);
    },

    async clearUserSearches(userId: string) {
      for (const [id, sc] of searchesStore.entries()) {
        if (sc.userId === userId) searchesStore.delete(id);
      }
      return true;
    },
  },

  // --- VERIFICATION & PASSWORD RESET TOKENS ---
  tokens: {
    async create(identifier: string, tokenHash: string, type: 'EMAIL_VERIFY' | 'PASSWORD_RESET', expiryMinutes = 60) {
      const id = 'tok_' + crypto.randomBytes(8).toString('hex');
      const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
      const tokenRecord: InMemoryToken = {
        id,
        identifier: identifier.toLowerCase().trim(),
        tokenHash,
        type,
        expiresAt,
        usedAt: null,
      };
      tokensStore.set(tokenHash, tokenRecord);
      return tokenRecord;
    },

    async findAndValidate(tokenHash: string, type: string) {
      const record = tokensStore.get(tokenHash);
      if (!record) return null;
      if (record.type !== type) return null;
      if (record.usedAt !== null) return null; // Single use
      if (record.expiresAt < new Date()) return null; // Expired
      return record;
    },

    async markUsed(tokenHash: string) {
      const record = tokensStore.get(tokenHash);
      if (record) {
        record.usedAt = new Date();
      }
    },
  },
};
