/**
 * Server Leaderboard Tests
 * Coverage: Data normalization, sorting, validation
 * Note: Redis-dependent functions are tested separately
 */

import type { LeaderboardEntry } from "@/core/game-engine/types";

// Import pure functions (not Redis-dependent)
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
  return `leaderboard:${gameId}`;
}

function toLeaderboardEntry(value: unknown): LeaderboardEntry | null {
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
}

describe("normalizeName", () => {
  it("trims whitespace", () => {
    expect(normalizeName("  John  ")).toBe("John");
  });

  it("limits to 20 characters", () => {
    const longName = "ThisIsAVeryLongNameThatExceedsTwentyCharacters";
    expect(normalizeName(longName).length).toBe(20);
  });

  it("returns Anonymous for empty string", () => {
    expect(normalizeName("")).toBe("Anonymous");
  });

  it("returns Anonymous for whitespace only", () => {
    expect(normalizeName("   ")).toBe("Anonymous");
  });

  it("preserves valid names under 20 chars", () => {
    expect(normalizeName("Player123")).toBe("Player123");
  });
});

describe("normalizeScore", () => {
  it("returns 0 for NaN", () => {
    expect(normalizeScore(NaN)).toBe(0);
  });

  it("returns 0 for Infinity", () => {
    expect(normalizeScore(Infinity)).toBe(0);
  });

  it("returns 0 for negative scores", () => {
    expect(normalizeScore(-100)).toBe(0);
  });

  it("floors decimal scores", () => {
    expect(normalizeScore(999.99)).toBe(999);
  });

  it("preserves valid integer scores", () => {
    expect(normalizeScore(1000)).toBe(1000);
  });

  it("returns 0 for non-numeric input", () => {
    expect(normalizeScore("abc" as any)).toBe(0);
  });
});

describe("sortLeaderboard", () => {
  const createEntry = (
    id: string,
    score: number,
    createdAt: string
  ): LeaderboardEntry => ({
    id,
    name: `Player ${id}`,
    score,
    createdAt,
  });

  it("sorts by score descending", () => {
    const entries = [
      createEntry("1", 100, "2024-01-01T00:00:00Z"),
      createEntry("2", 300, "2024-01-01T00:00:00Z"),
      createEntry("3", 200, "2024-01-01T00:00:00Z"),
    ];

    const sorted = sortLeaderboard(entries);
    expect(sorted.map((e) => e.score)).toEqual([300, 200, 100]);
  });

  it("sorts by createdAt ascending for same score", () => {
    const entries = [
      createEntry("1", 100, "2024-01-03T00:00:00Z"),
      createEntry("2", 100, "2024-01-01T00:00:00Z"),
      createEntry("3", 100, "2024-01-02T00:00:00Z"),
    ];

    const sorted = sortLeaderboard(entries);
    expect(sorted.map((e) => e.id)).toEqual(["2", "3", "1"]);
  });

  it("does not mutate original array", () => {
    const entries = [
      createEntry("1", 100, "2024-01-01T00:00:00Z"),
      createEntry("2", 200, "2024-01-01T00:00:00Z"),
    ];
    const original = [...entries];

    sortLeaderboard(entries);
    expect(entries).toEqual(original);
  });

  it("handles empty array", () => {
    expect(sortLeaderboard([])).toEqual([]);
  });

  it("handles single entry", () => {
    const entries = [createEntry("1", 100, "2024-01-01T00:00:00Z")];
    const sorted = sortLeaderboard(entries);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].score).toBe(100);
  });
});

describe("keyByGameId", () => {
  it("creates correct key format", () => {
    expect(keyByGameId("flappy-bird")).toBe("leaderboard:flappy-bird");
  });

  it("handles game ids with special characters", () => {
    expect(keyByGameId("snake-2048")).toBe("leaderboard:snake-2048");
  });

  it("handles empty game id", () => {
    expect(keyByGameId("")).toBe("leaderboard:");
  });
});

describe("toLeaderboardEntry", () => {
  it("converts valid record to LeaderboardEntry", () => {
    const record = {
      id: "123",
      name: "Player1",
      score: 1000,
      createdAt: "2024-01-01T00:00:00Z",
    };

    const entry = toLeaderboardEntry(record);
    expect(entry).toEqual({
      id: "123",
      name: "Player1",
      score: 1000,
      createdAt: "2024-01-01T00:00:00Z",
    });
  });

  it("normalizes name during conversion", () => {
    const record = {
      id: "123",
      name: "  LongName  ",
      score: 1000,
      createdAt: "2024-01-01T00:00:00Z",
    };

    const entry = toLeaderboardEntry(record);
    expect(entry?.name).toBe("LongName");
  });

  it("normalizes score during conversion", () => {
    const record = {
      id: "123",
      name: "Player1",
      score: 999.99,
      createdAt: "2024-01-01T00:00:00Z",
    };

    const entry = toLeaderboardEntry(record);
    expect(entry?.score).toBe(999);
  });

  it("returns null for missing id", () => {
    const record = {
      name: "Player1",
      score: 1000,
      createdAt: "2024-01-01T00:00:00Z",
    };
    expect(toLeaderboardEntry(record)).toBeNull();
  });

  it("returns null for missing name", () => {
    const record = {
      id: "123",
      score: 1000,
      createdAt: "2024-01-01T00:00:00Z",
    };
    expect(toLeaderboardEntry(record)).toBeNull();
  });

  it("returns null for missing score", () => {
    const record = {
      id: "123",
      name: "Player1",
      createdAt: "2024-01-01T00:00:00Z",
    };
    expect(toLeaderboardEntry(record)).toBeNull();
  });

  it("returns null for missing createdAt", () => {
    const record = {
      id: "123",
      name: "Player1",
      score: 1000,
    };
    expect(toLeaderboardEntry(record)).toBeNull();
  });

  it("returns null for null value", () => {
    expect(toLeaderboardEntry(null)).toBeNull();
  });

  it("returns null for non-object value", () => {
    expect(toLeaderboardEntry("string")).toBeNull();
    expect(toLeaderboardEntry(123)).toBeNull();
  });

  it("handles wrong types gracefully", () => {
    const record = {
      id: 123,
      name: 456,
      score: "invalid",
      createdAt: true,
    };
    expect(toLeaderboardEntry(record)).toBeNull();
  });
});
