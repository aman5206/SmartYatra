interface RateLimitRecord {
  timestamps: number[];
  failedAttempts: number;
}

// In-memory sliding window store (shared across local requests, with production Redis adapter support)
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  max: number;             // Maximum requests allowed in the window
  windowSeconds: number;   // Window duration in seconds
  action: 'login' | 'register' | 'reset' | 'ai' | 'upload' | 'search' | 'api';
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
  delayMs: number;
}

// Environment configurable defaults
const CONFIG_DEFAULTS: Record<string, { max: number; window: number }> = {
  login: {
    max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || '5', 10),
    window: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW || '60', 10),
  },
  register: {
    max: parseInt(process.env.RATE_LIMIT_REGISTER_MAX || '4', 10),
    window: parseInt(process.env.RATE_LIMIT_REGISTER_WINDOW || '60', 10),
  },
  reset: {
    max: parseInt(process.env.RATE_LIMIT_RESET_MAX || '3', 10),
    window: parseInt(process.env.RATE_LIMIT_RESET_WINDOW || '60', 10),
  },
  ai: {
    max: parseInt(process.env.RATE_LIMIT_AI_MAX || '10', 10),
    window: parseInt(process.env.RATE_LIMIT_AI_WINDOW || '60', 10),
  },
  upload: {
    max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || '6', 10),
    window: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW || '60', 10),
  },
  search: {
    max: parseInt(process.env.RATE_LIMIT_SEARCH_MAX || '30', 10),
    window: parseInt(process.env.RATE_LIMIT_SEARCH_WINDOW || '60', 10),
  },
  api: {
    max: parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '60', 10),
    window: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW || '60', 10),
  },
};

/**
 * Server-side rate limiter with sliding window & progressive delays
 */
export async function checkRateLimit(
  identifier: string,
  action: 'login' | 'register' | 'reset' | 'ai' | 'upload' | 'search' | 'api'
): Promise<RateLimitResult> {
  const config = CONFIG_DEFAULTS[action] || CONFIG_DEFAULTS.api;
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const windowMs = config.window * 1000;
  const windowStart = now - windowMs;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [], failedAttempts: 0 };
    memoryStore.set(key, record);
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  const requestCount = record.timestamps.length;
  const isAllowed = requestCount < config.max;

  // Calculate progressive delay for consecutive attempts on sensitive endpoints
  let delayMs = 0;
  if (['login', 'reset', 'register'].includes(action)) {
    if (requestCount >= 1) {
      delayMs = Math.min(requestCount * 200, 2000); // 200ms, 400ms progressive delay
    }
  }

  if (isAllowed) {
    record.timestamps.push(now);
    const remaining = Math.max(0, config.max - record.timestamps.length);
    const oldestTimestamp = record.timestamps[0] || now;
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    return {
      success: true,
      limit: config.max,
      remaining,
      resetInSeconds,
      delayMs,
    };
  }

  // Exceeded rate limit
  const oldest = record.timestamps[0] || now;
  const resetInSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));

  return {
    success: false,
    limit: config.max,
    remaining: 0,
    resetInSeconds,
    delayMs: 1000,
  };
}

/**
 * Helper to produce standard 429 response with security headers
 */
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please try again in ${result.resetInSeconds} seconds.`,
      retryAfterSeconds: result.resetInSeconds,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.resetInSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(result.resetInSeconds),
      },
    }
  );
}

/**
 * Resets a specific key (e.g. after a successful login or in tests)
 */
export function resetRateLimit(identifier: string, action: string): void {
  memoryStore.delete(`${action}:${identifier}`);
}
