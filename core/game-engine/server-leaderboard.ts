import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeaderboardEntry } from "./types";

const LEADERBOARD_LIMIT = 20;
const DATA_FILE_PATH = path.join(process.cwd(), "data", "leaderboards.json");

type LeaderboardStore = Record<string, LeaderboardEntry[]>;

let writeQueue: Promise<void> = Promise.resolve();

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

async function readStore(): Promise<LeaderboardStore> {
  try {
    const raw = await readFile(DATA_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as LeaderboardStore;
  } catch {
    return {};
  }
}

async function writeStore(store: LeaderboardStore): Promise<void> {
  await mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await writeFile(DATA_FILE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function sanitizeEntries(entries: unknown): LeaderboardEntry[] {
  if (!Array.isArray(entries)) return [];
  const sanitized = entries
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
        score: normalizeScore(item.score),
        createdAt: item.createdAt,
      };
    })
    .filter((item): item is LeaderboardEntry => Boolean(item));
  return sortLeaderboard(sanitized).slice(0, LEADERBOARD_LIMIT);
}

function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function getServerLeaderboard(gameId: string): Promise<LeaderboardEntry[]> {
  const store = await readStore();
  return sanitizeEntries(store[gameId]);
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

  return withWriteLock(async () => {
    const store = await readStore();
    const current = sanitizeEntries(store[gameId]);
    const minScore = current[current.length - 1]?.score ?? 0;
    const qualified =
      current.length < LEADERBOARD_LIMIT || normalizedScore >= minScore;

    if (!qualified) {
      return { qualified: false, entries: current };
    }

    const nextEntry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizeName(name),
      score: normalizedScore,
      createdAt: new Date().toISOString(),
    };
    const next = sortLeaderboard([...current, nextEntry]).slice(0, LEADERBOARD_LIMIT);
    store[gameId] = next;
    await writeStore(store);
    return { qualified: true, entries: next };
  });
}

