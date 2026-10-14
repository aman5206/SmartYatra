import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimit } from '../src/lib/rate-limit';

describe('Server-Side Rate Limiter Tests', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    resetRateLimit(testIp, 'login');
    resetRateLimit(testIp, 'upload');
  });

  it('should allow requests within configured threshold', async () => {
    const res1 = await checkRateLimit(testIp, 'login');
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);

    const res2 = await checkRateLimit(testIp, 'login');
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(3);
  });

  it('should block requests exceeding threshold with HTTP 429 indicators', async () => {
    // Threshold for login default is 5
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIp, 'login');
    }

    // 6th attempt should be blocked
    const blockedRes = await checkRateLimit(testIp, 'login');
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInSeconds).toBeGreaterThan(0);
  });

  it('should calculate progressive delays on repeated login attempts', async () => {
    const r1 = await checkRateLimit(testIp, 'login');
    expect(r1.delayMs).toBe(0);

    const r2 = await checkRateLimit(testIp, 'login');
    expect(r2.delayMs).toBe(200);

    const r3 = await checkRateLimit(testIp, 'login');
    expect(r3.delayMs).toBe(400);
  });

  it('should reset rate limit after reset call', async () => {
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIp, 'login');
    }
    const blocked = await checkRateLimit(testIp, 'login');
    expect(blocked.success).toBe(false);

    resetRateLimit(testIp, 'login');

    const unblocked = await checkRateLimit(testIp, 'login');
    expect(unblocked.success).toBe(true);
  });
});
