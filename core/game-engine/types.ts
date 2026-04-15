export type GameCategory = "arcade" | "story" | "casual" | "utility";

export type GameDifficulty = "easy" | "medium" | "hard";

export interface GameManifest {
  slug: string;
  title: string;
  shortDescription: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  emoji: string;
  /** Tailwind gradient from-* to-* classes for cards */
  gradient: string;
}

export interface GameScoreRecord {
  gameId: string;
  bestScore: number;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: string;
}
