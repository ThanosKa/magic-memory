import { Redis } from "@upstash/redis"
import { redisLogger } from "@/lib/logger"

let redisClient: Redis | null = null

export function getRedisClient(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisLogger.warn("Redis credentials not configured, free credit tracking will use DB fallback")
    return null
  }

  if (redisClient) {
    return redisClient
  }

  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  return redisClient
}

// Get seconds until midnight UTC for TTL
export function getSecondsUntilMidnightUTC(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setUTCHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

// Free credit key pattern: free_credit:{userId}:{date}
export function getFreeCreditKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  return `free_credit:${userId}:${today}`
}

// Check if user has used their free daily credit
export async function hasUsedFreeCredit(userId: string): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) return false // Fallback to DB check if Redis not available

  try {
    const key = getFreeCreditKey(userId)
    const used = await redis.get<string>(key)
    return used === "1"
  } catch (error) {
    redisLogger.error({ error, userId }, "Error checking free credit in Redis")
    return false
  }
}

// Mark free credit as used with TTL until midnight UTC
export async function markFreeCreditUsed(userId: string): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) return false

  try {
    const key = getFreeCreditKey(userId)
    const ttl = getSecondsUntilMidnightUTC()
    await redis.set(key, "1", { ex: ttl })
    redisLogger.info({ userId, ttl }, "Marked free credit as used")
    return true
  } catch (error) {
    redisLogger.error({ error, userId }, "Error marking free credit in Redis")
    return false
  }
}
