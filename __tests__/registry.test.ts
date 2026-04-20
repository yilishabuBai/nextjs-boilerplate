/**
 * Game Registry Tests
 * Coverage: Game lookup, filtering, manifest validation
 */

import { getGameBySlug, getGamesByCategory } from "@/core/game-engine/registry";

describe("getGameBySlug", () => {
  it("finds game by slug", () => {
    const game = getGameBySlug("flappy-bird");
    expect(game).toBeDefined();
    expect(game?.slug).toBe("flappy-bird");
    expect(game?.title).toBe("Flappy Bird");
  });

  it("returns undefined for non-existent slug", () => {
    const game = getGameBySlug("non-existent");
    expect(game).toBeUndefined();
  });

  it("is case-sensitive", () => {
    const game = getGameBySlug("Flappy-Bird");
    expect(game).toBeUndefined();
  });

  it("handles empty slug", () => {
    const game = getGameBySlug("");
    expect(game).toBeUndefined();
  });

  it("returns game with all required properties", () => {
    const game = getGameBySlug("flappy-bird");
    expect(game).toMatchObject({
      slug: "flappy-bird",
      title: "Flappy Bird",
      shortDescription: expect.any(String),
      category: expect.any(String),
      difficulty: expect.any(String),
      emoji: expect.any(String),
      gradient: expect.any(String),
    });
  });
});

describe("getGamesByCategory", () => {
  it("returns all games for 'all' category", () => {
    const games = getGamesByCategory("all");
    expect(games.length).toBeGreaterThan(0);
    expect(games).toContainEqual(
      expect.objectContaining({ slug: "flappy-bird" })
    );
  });

  it("filters by category", () => {
    const games = getGamesByCategory("arcade");
    expect(games.length).toBeGreaterThan(0);
    games.forEach((game) => {
      expect(game.category).toBe("arcade");
    });
  });

  it("returns empty array for non-existent category", () => {
    const games = getGamesByCategory("non-existent");
    expect(games).toEqual([]);
  });

  it("returns a new array (not reference)", () => {
    const games1 = getGamesByCategory("all");
    const games2 = getGamesByCategory("all");
    expect(games1).not.toBe(games2);
    expect(games1).toEqual(games2);
  });

  it("handles empty category string", () => {
    const games = getGamesByCategory("");
    expect(games).toEqual([]);
  });
});

describe("Game Manifest Structure", () => {
  it("flappy-bird has valid manifest", () => {
    const game = getGameBySlug("flappy-bird");
    expect(game).toBeDefined();
    expect(game?.slug).toMatch(/^[a-z0-9-]+$/);
    expect(game?.title.length).toBeGreaterThan(0);
    expect(game?.shortDescription.length).toBeGreaterThan(0);
    expect(["arcade", "puzzle", "strategy", "action"]).toContain(
      game?.category
    );
    expect(["easy", "medium", "hard"]).toContain(game?.difficulty);
    expect(game?.emoji).toMatch(/[\p{Emoji}]/u);
    expect(game?.gradient).toMatch(/^from-\w+-\d+ to-\w+-\d+$/);
  });
});
