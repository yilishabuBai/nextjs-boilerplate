import type { GameManifest } from "./types";

export const GAMES: readonly GameManifest[] = [
  {
    slug: "flappy-bird",
    title: "Flappy Bird",
    shortDescription: "点击或空格让小鸟穿过管道，挑战最高分。",
    category: "arcade",
    difficulty: "medium",
    emoji: "🐦",
    gradient: "from-sky-400 to-cyan-600",
  },
];

export function getGameBySlug(slug: string): GameManifest | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getGamesByCategory(
  category: GameManifest["category"] | "all"
): GameManifest[] {
  if (category === "all") return [...GAMES];
  return GAMES.filter((g) => g.category === category);
}
