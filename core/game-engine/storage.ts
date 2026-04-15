import type { LeaderboardEntry } from "./types";

const STORAGE_PREFIX = "game-hall:";
const LEADERBOARD_LIMIT = 20;

function keyBestScore(gameId: string) {
  return `${STORAGE_PREFIX}best:${gameId}`;
}

function keyLeaderboard(gameId: string) {
  return `${STORAGE_PREFIX}leaderboard:${gameId}`;
}

function keyRecent() {
  return `${STORAGE_PREFIX}recent`;
}

export function getBestScore(gameId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(keyBestScore(gameId));
    if (!raw) return 0;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(gameId: string, score: number): void {
  if (typeof window === "undefined") return;
  try {
    const prev = getBestScore(gameId);
    if (score > prev) {
      window.localStorage.setItem(keyBestScore(gameId), String(Math.floor(score)));
    }
  } catch {
    /* ignore */
  }
}

const MAX_RECENT = 8;

export function touchRecentGame(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(keyRecent());
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    window.localStorage.setItem(keyRecent(), JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getRecentGameSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(keyRecent());
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown;
    return Array.isArray(list) ? list.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function normalizeName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 20) : "Anonymous";
}

function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

export function getLeaderboard(gameId: string): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(keyLeaderboard(gameId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const entries: LeaderboardEntry[] = parsed
      .map((item) => {
        if (
          typeof item !== "object" ||
          !item ||
          typeof item.id !== "string" ||
          typeof item.name !== "string" ||
          typeof item.score !== "number" ||
          typeof item.createdAt !== "string"
        ) {
          return null;
        }
        return {
          id: item.id,
          name: normalizeName(item.name),
          score: Math.max(0, Math.floor(item.score)),
          createdAt: item.createdAt,
        };
      })
      .filter((item): item is LeaderboardEntry => Boolean(item));
    return sortLeaderboard(entries).slice(0, LEADERBOARD_LIMIT);
  } catch {
    return [];
  }
}

export function isScoreInTopLeaderboard(gameId: string, score: number): boolean {
  const normalized = Math.max(0, Math.floor(score));
  if (normalized <= 0) return false;
  const list = getLeaderboard(gameId);
  if (list.length < LEADERBOARD_LIMIT) return true;
  return normalized >= list[list.length - 1].score;
}

export function submitLeaderboardScore(
  gameId: string,
  score: number,
  name: string
): LeaderboardEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const normalizedScore = Math.max(0, Math.floor(score));
    if (!isScoreInTopLeaderboard(gameId, normalizedScore)) {
      return getLeaderboard(gameId);
    }
    const list = getLeaderboard(gameId);
    const nextEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizeName(name),
      score: normalizedScore,
      createdAt: new Date().toISOString(),
    };
    const next = sortLeaderboard([...list, nextEntry]).slice(0, LEADERBOARD_LIMIT);
    window.localStorage.setItem(keyLeaderboard(gameId), JSON.stringify(next));
    return next;
  } catch {
    return getLeaderboard(gameId);
  }
}
