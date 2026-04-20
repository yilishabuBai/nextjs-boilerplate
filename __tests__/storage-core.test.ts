/**
 * Game Engine Storage Tests
 * Coverage: Best score persistence, recent games tracking
 */

import {
  getBestScore,
  setBestScore,
  getRecentGameSlugs,
  touchRecentGame,
} from "@/core/game-engine/storage";

describe("getBestScore", () => {
  const gameId = "flappy-bird";

  beforeEach(() => {
    localStorage.clear();
  });

  it("returns 0 when no score exists", () => {
    expect(getBestScore(gameId)).toBe(0);
  });

  it("returns stored score", () => {
    localStorage.setItem("game-hall:best:flappy-bird", "1000");
    expect(getBestScore(gameId)).toBe(1000);
  });

  it("returns 0 for invalid stored value", () => {
    localStorage.setItem("game-hall:best:flappy-bird", "invalid");
    expect(getBestScore(gameId)).toBe(0);
  });

  it("returns 0 for negative stored score", () => {
    localStorage.setItem("game-hall:best:flappy-bird", "-50");
    expect(getBestScore(gameId)).toBe(0);
  });

  it("returns 0 in SSR environment", () => {
    // Simulate SSR by checking window is undefined
    const originalWindow = global.window;
    // @ts-expect-error - simulate SSR
    delete global.window;
    expect(getBestScore(gameId)).toBe(0);
    global.window = originalWindow;
  });
});

describe("setBestScore", () => {
  const gameId = "flappy-bird";

  beforeEach(() => {
    localStorage.clear();
  });

  it("stores new best score", () => {
    setBestScore(gameId, 500);
    expect(localStorage.getItem("game-hall:best:flappy-bird")).toBe("500");
  });

  it("updates only if new score is higher", () => {
    localStorage.setItem("game-hall:best:flappy-bird", "1000");
    setBestScore(gameId, 500);
    expect(localStorage.getItem("game-hall:best:flappy-bird")).toBe("1000");
  });

  it("updates when new score is higher", () => {
    localStorage.setItem("game-hall:best:flappy-bird", "500");
    setBestScore(gameId, 1000);
    expect(localStorage.getItem("game-hall:best:flappy-bird")).toBe("1000");
  });

  it("floors decimal scores", () => {
    setBestScore(gameId, 999.99);
    expect(localStorage.getItem("game-hall:best:flappy-bird")).toBe("999");
  });

  it("does nothing in SSR environment", () => {
    const originalWindow = global.window;
    // @ts-expect-error - simulate SSR
    delete global.window;
    expect(() => setBestScore(gameId, 1000)).not.toThrow();
    global.window = originalWindow;
  });

  it("handles storage errors gracefully", () => {
    // Mock localStorage to throw
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("Storage full");
    };
    expect(() => setBestScore(gameId, 1000)).not.toThrow();
    localStorage.setItem = originalSetItem;
  });
});

describe("getRecentGameSlugs", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when no recent games", () => {
    expect(getRecentGameSlugs()).toEqual([]);
  });

  it("returns stored recent games", () => {
    localStorage.setItem(
      "game-hall:recent",
      JSON.stringify(["flappy-bird", "snake", "tetris"])
    );
    expect(getRecentGameSlugs()).toEqual(["flappy-bird", "snake", "tetris"]);
  });

  it("filters out non-string values", () => {
    localStorage.setItem(
      "game-hall:recent",
      JSON.stringify(["flappy-bird", 123, null, "snake"])
    );
    expect(getRecentGameSlugs()).toEqual(["flappy-bird", "snake"]);
  });

  it("returns empty array for invalid JSON", () => {
    localStorage.setItem("game-hall:recent", "invalid-json");
    expect(getRecentGameSlugs()).toEqual([]);
  });

  it("returns empty array in SSR environment", () => {
    const originalWindow = global.window;
    // @ts-expect-error - simulate SSR
    delete global.window;
    expect(getRecentGameSlugs()).toEqual([]);
    global.window = originalWindow;
  });
});

describe("touchRecentGame", () => {
  const slug = "flappy-bird";

  beforeEach(() => {
    localStorage.clear();
  });

  it("adds new game to recent list", () => {
    touchRecentGame(slug);
    const recent = JSON.parse(localStorage.getItem("game-hall:recent") || "[]");
    expect(recent).toEqual([slug]);
  });

  it("moves existing game to front", () => {
    localStorage.setItem(
      "game-hall:recent",
      JSON.stringify(["snake", "flappy-bird", "tetris"])
    );
    touchRecentGame(slug);
    const recent = JSON.parse(localStorage.getItem("game-hall:recent") || "[]");
    expect(recent).toEqual(["flappy-bird", "snake", "tetris"]);
  });

  it("limits to MAX_RECENT games", () => {
    const games = ["game1", "game2", "game3", "game4", "game5", "game6", "game7", "game8", "game9"];
    games.forEach((game) => touchRecentGame(game));
    const recent = JSON.parse(localStorage.getItem("game-hall:recent") || "[]");
    expect(recent.length).toBe(8);
    expect(recent[0]).toBe("game9");
  });

  it("does nothing in SSR environment", () => {
    const originalWindow = global.window;
    // @ts-expect-error - simulate SSR
    delete global.window;
    expect(() => touchRecentGame(slug)).not.toThrow();
    global.window = originalWindow;
  });

  it("handles storage errors gracefully", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("Storage full");
    };
    expect(() => touchRecentGame(slug)).not.toThrow();
    localStorage.setItem = originalSetItem;
  });
});

describe("Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("tracks best score and recent games together", () => {
    // Play flappy-bird
    setBestScore("flappy-bird", 1000);
    touchRecentGame("flappy-bird");

    // Play snake
    setBestScore("snake", 500);
    touchRecentGame("snake");

    expect(getBestScore("flappy-bird")).toBe(1000);
    expect(getBestScore("snake")).toBe(500);
    expect(getRecentGameSlugs()).toEqual(["snake", "flappy-bird"]);
  });

  it("persists data across operations", () => {
    setBestScore("tetris", 2000);
    touchRecentGame("tetris");

    // Clear and verify (simulating page reload)
    expect(getBestScore("tetris")).toBe(2000);
    expect(getRecentGameSlugs()).toContain("tetris");
  });
});
