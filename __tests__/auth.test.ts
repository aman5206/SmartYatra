import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateSecureToken, hashToken } from '../src/lib/security';
import { db } from '../src/lib/db';

describe('Security & Authentication Tests', () => {
  it('should hash passwords with Argon2id and verify correctly', async () => {
    const password = 'SecurePassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash).toContain('$argon2id$');

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword123!', hash);
    expect(isInvalid).toBe(false);
  });

  it('should reject short passwords less than 8 characters', async () => {
    await expect(hashPassword('short')).rejects.toThrow();
  });

  it('should generate cryptographically random tokens and produce distinct SHA-256 hashes', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);

    const hash1 = hashToken(token1);
    const hash2 = hashToken(token2);
    expect(hash1).not.toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('should support single-use hashed password reset tokens', async () => {
    const email = 'traveler@example.com';
    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);

    await db.tokens.create(email, tokenHash, 'PASSWORD_RESET', 30);

    const validRecord = await db.tokens.findAndValidate(tokenHash, 'PASSWORD_RESET');
    expect(validRecord).toBeDefined();
    expect(validRecord?.identifier).toBe(email);

    // Mark as used
    await db.tokens.markUsed(tokenHash);

    // Second retrieval should fail (Single-use security guarantee)
    const secondTry = await db.tokens.findAndValidate(tokenHash, 'PASSWORD_RESET');
    expect(secondTry).toBeNull();
  });
});
