import {
  getLeaderboard,
  isScoreInTopLeaderboard,
  submitLeaderboardScore,
} from "@/core/game-engine/storage";

describe("per-game leaderboard storage", () => {
  const gameA = "flappy-bird";
  const gameB = "another-game";

  beforeEach(() => {
    window.localStorage.clear();
  });

  test("stores leaderboard entries independently for each game", () => {
    submitLeaderboardScore(gameA, 12, "Alice");
    submitLeaderboardScore(gameB, 15, "Bob");

    const listA = getLeaderboard(gameA);
    const listB = getLeaderboard(gameB);

    expect(listA).toHaveLength(1);
    expect(listB).toHaveLength(1);
    expect(listA[0].name).toBe("Alice");
    expect(listB[0].name).toBe("Bob");
  });

  test("keeps only top 20 scores in descending order", () => {
    for (let i = 1; i <= 25; i += 1) {
      submitLeaderboardScore(gameA, i, `P${i}`);
    }

    const list = getLeaderboard(gameA);
    expect(list).toHaveLength(20);
    expect(list[0].score).toBe(25);
    expect(list[19].score).toBe(6);
  });

  test("qualify check works for empty and full leaderboard", () => {
    expect(isScoreInTopLeaderboard(gameA, 1)).toBe(true);
    expect(isScoreInTopLeaderboard(gameA, 0)).toBe(false);

    for (let i = 1; i <= 20; i += 1) {
      submitLeaderboardScore(gameA, i, `P${i}`);
    }

    expect(isScoreInTopLeaderboard(gameA, 1)).toBe(true);
    expect(isScoreInTopLeaderboard(gameA, 0)).toBe(false);
  });
});
