const STORAGE_PREFIX = "game-hall:";

function keyBestScore(gameId: string) {
  return `${STORAGE_PREFIX}best:${gameId}`;
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
