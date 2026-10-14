import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  tripPlannerSchema,
  deleteAccountSchema,
  captionGeneratorSchema,
} from '../src/lib/validation';

describe('Zod Server-Side Schema Validation Tests', () => {
  it('should validate valid user registration payload', () => {
    const valid = {
      name: 'Priya Verma',
      email: 'priya@example.com',
      password: 'StrongPassword123!',
    };
    const res = registerSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('should reject registration with invalid password or bad email', () => {
    // Password lacking numbers and uppercase
    const invalidPass = {
      name: 'Priya',
      email: 'priya@example.com',
      password: 'weakpassword',
    };
    expect(registerSchema.safeParse(invalidPass).success).toBe(false);

    // Bad email format
    const badEmail = {
      name: 'Priya',
      email: 'not-an-email',
      password: 'StrongPassword123!',
    };
    expect(registerSchema.safeParse(badEmail).success).toBe(false);
  });

  it('should enforce duration limits in trip planner schema', () => {
    // Duration 3 days (valid)
    const validTrip = {
      destinationSlug: 'jaipur',
      durationDays: 3,
      groupType: 'Solo',
      budgetTier: 'Moderate',
      interests: ['history'],
    };
    expect(tripPlannerSchema.safeParse(validTrip).success).toBe(true);

    // Duration 25 days (exceeds max 14)
    const tooLong = { ...validTrip, durationDays: 25 };
    expect(tripPlannerSchema.safeParse(tooLong).success).toBe(false);

    // Duration 0 days
    const zeroDays = { ...validTrip, durationDays: 0 };
    expect(tripPlannerSchema.safeParse(zeroDays).success).toBe(false);
  });

  it('should require exact "DELETE" confirmation for account deletion', () => {
    const valid = { confirmText: 'DELETE', password: 'Password123!' };
    expect(deleteAccountSchema.safeParse(valid).success).toBe(true);

    const invalid = { confirmText: 'delete', password: 'Password123!' };
    expect(deleteAccountSchema.safeParse(invalid).success).toBe(false);
  });

  it('should accept only JPEG, PNG, and WebP images for caption generation', () => {
    const validJpeg = {
      language: 'en',
      style: 'poetic',
      fileBase64: 'data:image/jpeg;base64,1234567890abcdef',
      fileName: 'amber-fort.jpg',
      mimeType: 'image/jpeg',
    };
    expect(captionGeneratorSchema.safeParse(validJpeg).success).toBe(true);

    const invalidGif = {
      language: 'en',
      style: 'poetic',
      fileBase64: 'data:image/gif;base64,1234567890abcdef',
      fileName: 'animation.gif',
      mimeType: 'image/gif',
    };
    expect(captionGeneratorSchema.safeParse(invalidGif).success).toBe(false);
  });
});
