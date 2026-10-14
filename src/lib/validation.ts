import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60).trim(),
  email: z.string().email('Please enter a valid email address').max(100).toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(100).toLowerCase().trim(),
  password: z.string().min(1, 'Password is required').max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(100).toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(16, 'Invalid or expired reset token').max(128),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updatePreferencesSchema = z.object({
  interests: z.array(z.string().max(30)).max(15).optional(),
  consentPersonalization: z.boolean().optional(),
  consentActivityHistory: z.boolean().optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
  defaultCurrency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
});

export const tripPlannerSchema = z.object({
  destinationSlug: z.string().min(1, 'Destination is required').max(80),
  durationDays: z.number().int().min(1, 'Trip duration must be at least 1 day').max(14, 'Trip duration cannot exceed 14 days'),
  groupType: z.enum(['Solo', 'Couple', 'Family', 'Friends']),
  budgetTier: z.enum(['Budget', 'Moderate', 'Luxury']),
  interests: z.array(z.string().max(30)).max(8).default([]),
  specialRequests: z.string().max(300).optional(),
});

export const budgetCalculatorSchema = z.object({
  durationDays: z.number().int().min(1).max(30),
  groupSize: z.number().int().min(1).max(20),
  travelStyle: z.enum(['Budget', 'Comfortable', 'Luxury']),
  destinationType: z.enum(['Heritage', 'HillStation', 'Beach', 'Metropolitan', 'Spiritual']),
});

export const captionGeneratorSchema = z.object({
  language: z.enum(['en', 'hi']).default('en'),
  style: z.enum(['poetic', 'adventurous', 'historical', 'cultural', 'witty']).default('poetic'),
  destinationName: z.string().max(80).optional(),
  fileBase64: z.string().min(10, 'Photo data is required'),
  fileName: z.string().max(100),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    message: 'Only JPEG, PNG, and WebP images are allowed',
  }),
});

export const deleteAccountSchema = z.object({
  confirmText: z.literal('DELETE', {
    message: 'Please type DELETE to confirm account deletion',
  }),
  password: z.string().min(1, 'Current password is required to verify your identity'),
});

export const searchLogSchema = z.object({
  query: z.string().min(1).max(120).trim(),
  category: z.string().max(50).optional(),
  filters: z.record(z.string(), z.any()).optional(),
});

export const savePlaceSchema = z.object({
  destinationId: z.string().min(1).max(100),
  notes: z.string().max(500).optional(),
});
