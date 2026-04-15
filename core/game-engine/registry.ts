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
  {
    slug: "interactive-video",
    title: "完蛋！我被美女包围了",
    shortDescription: "互动视觉小说，选择分支与好感度系统。",
    category: "story",
    difficulty: "easy",
    emoji: "💕",
    gradient: "from-pink-400 to-purple-600",
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
