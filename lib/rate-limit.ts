const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5 // 5 requests per minute

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now - record.timestamp > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS - record.count }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.timestamp > WINDOW_MS) {
      rateLimitMap.delete(ip)
    }
  }
}, WINDOW_MS)
