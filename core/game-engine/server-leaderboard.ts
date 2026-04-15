import { Redis } from "@upstash/redis";
import type { LeaderboardEntry } from "./types";

const LEADERBOARD_LIMIT = 20;
const KEY_PREFIX = "leaderboard";
const REDIS_CONFIG_ERROR =
  "Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.";

let redisClient: Redis | null = null;

function normalizeName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 20) : "Anonymous";
}

function normalizeScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.floor(score));
}

function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

function keyByGameId(gameId: string): string {
  return `${KEY_PREFIX}:${gameId}`;
}

function getRedis(): Redis {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(REDIS_CONFIG_ERROR);
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

function parseMember(raw: string): LeaderboardEntry | null {
  try {
    const value = JSON.parse(raw) as unknown;
    const record = value as Record<string, unknown>;
    if (
      !value ||
      typeof value !== "object" ||
      typeof record.id !== "string" ||
      typeof record.name !== "string" ||
      typeof record.score !== "number" ||
      typeof record.createdAt !== "string"
    ) {
      return null;
    }
    return {
      id: record.id,
      name: normalizeName(record.name),
      score: normalizeScore(record.score),
      createdAt: record.createdAt,
    };
  } catch {
    return null;
  }
}

export async function getServerLeaderboard(gameId: string): Promise<LeaderboardEntry[]> {
  const redis = getRedis();
  const key = keyByGameId(gameId);
  const rawMembers = await redis.zrange<string[]>(key, 0, LEADERBOARD_LIMIT - 1, {
    rev: true,
  });
  const parsed = rawMembers
    .map((raw) => parseMember(raw))
    .filter((entry): entry is LeaderboardEntry => Boolean(entry));
  return sortLeaderboard(parsed).slice(0, LEADERBOARD_LIMIT);
}

export async function submitServerLeaderboardScore(
  gameId: string,
  score: number,
  name: string
): Promise<{ qualified: boolean; entries: LeaderboardEntry[] }> {
  const normalizedScore = normalizeScore(score);
  if (normalizedScore <= 0) {
    return { qualified: false, entries: await getServerLeaderboard(gameId) };
  }

  const redis = getRedis();
  const key = keyByGameId(gameId);
  const current = await getServerLeaderboard(gameId);
  const minScore = current[current.length - 1]?.score ?? 0;
  const qualified = current.length < LEADERBOARD_LIMIT || normalizedScore >= minScore;
  if (!qualified) {
    return { qualified: false, entries: current };
  }

  const nextEntry: LeaderboardEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: normalizeName(name),
    score: normalizedScore,
    createdAt: new Date().toISOString(),
  };

  await redis.zadd(key, { score: normalizedScore, member: JSON.stringify(nextEntry) });
  const size = await redis.zcard(key);
  if (size > LEADERBOARD_LIMIT) {
    await redis.zremrangebyrank(key, 0, size - LEADERBOARD_LIMIT - 1);
  }
  return { qualified: true, entries: await getServerLeaderboard(gameId) };
}

