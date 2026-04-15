import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug } from "@/core/game-engine/registry";
import FlappyBirdGame from "@/games/flappy-bird/FlappyBirdGame";

const GAME_COMPONENTS = {
  "flappy-bird": FlappyBirdGame,
} as const;

type GameSlug = keyof typeof GAME_COMPONENTS;

export function generateStaticParams() {
  return (Object.keys(GAME_COMPONENTS) as GameSlug[]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) {
    return { title: "未找到游戏" };
  }
  return {
    title: game.title,
    description: game.shortDescription,
  };
}

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const Comp = GAME_COMPONENTS[slug as GameSlug];
  if (!Comp) notFound();

  return <Comp />;
}
