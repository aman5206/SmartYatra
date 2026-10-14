import { describe, it, expect } from 'vitest';
import { generateTripItinerary, generatePhotoCaption } from '../src/lib/ai-service';

describe('AI Trip Planner & Caption Fallback Tests', () => {
  it('should generate structured day-by-day itinerary with rule-based fallback when no AI key is present', async () => {
    delete process.env.GEMINI_API_KEY;

    const plan = await generateTripItinerary({
      destinationSlug: 'jaipur',
      durationDays: 3,
      groupType: 'Family',
      budgetTier: 'Moderate',
      interests: ['history', 'shopping'],
    });

    expect(plan).toBeDefined();
    expect(plan.destination).toBe('Jaipur');
    expect(plan.durationDays).toBe(3);
    expect(plan.days).toHaveLength(3);
    expect(plan.days[0].morning).toBeDefined();
    expect(plan.days[0].afternoon).toBeDefined();
    expect(plan.days[0].evening).toBeDefined();

    // Verify Demo / Non-AI Fallback labeling
    expect(plan.isAiGenerated).toBe(false);
    expect(plan.modelBadge).toContain('Non-AI Fallback');
    expect(plan.disclaimer).toContain('[DEMO FALLBACK]');
  });

  it('should generate multilingual photo captions with demo disclaimer', async () => {
    delete process.env.GEMINI_API_KEY;

    // English poetic caption
    const captionEn = await generatePhotoCaption({
      destinationName: 'Varanasi',
      style: 'poetic',
      language: 'en',
      fileBase64: 'samplebase64',
      mimeType: 'image/jpeg',
    });

    expect(captionEn.caption).toBeDefined();
    expect(captionEn.hashtags.length).toBeGreaterThan(0);
    expect(captionEn.isAiGenerated).toBe(false);
    expect(captionEn.disclaimer).toContain('DEMO FALLBACK');

    // Hindi cultural caption
    const captionHi = await generatePhotoCaption({
      destinationName: 'वाराणसी',
      style: 'cultural',
      language: 'hi',
      fileBase64: 'samplebase64',
      mimeType: 'image/jpeg',
    });

    expect(captionHi.caption).toBeDefined();
    expect(captionHi.caption).toContain('वाराणसी');
    expect(captionHi.hashtags.some((t) => t.includes('स्मार्टयात्रा'))).toBe(true);
  });
});
