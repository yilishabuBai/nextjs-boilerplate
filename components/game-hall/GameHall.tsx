"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GAMES } from "@/core/game-engine/registry";
import type { GameManifest } from "@/core/game-engine/types";
import { getRecentGameSlugs } from "@/core/game-engine/storage";

const categoryLabel: Record<GameManifest["category"], string> = {
  arcade: "街机",
  story: "剧情",
  casual: "休闲",
  utility: "工具",
};

const difficultyLabel: Record<GameManifest["difficulty"], string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

function GameCard({ game }: { game: GameManifest }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:border-white/25 hover:bg-white/10"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30 blur-3xl transition group-hover:opacity-50 ${game.gradient}`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-4xl" aria-hidden>
          {game.emoji}
        </span>
        <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-xs text-white/80">
          {difficultyLabel[game.difficulty]}
        </span>
      </div>
      <h2 className="relative mt-4 text-lg font-semibold tracking-tight text-white">
        {game.title}
      </h2>
      <p className="relative mt-2 line-clamp-2 text-sm text-slate-400">
        {game.shortDescription}
      </p>
      <div className="relative mt-4 flex flex-wrap gap-2">
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-slate-200">
          {categoryLabel[game.category]}
        </span>
        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
          开玩 →
        </span>
      </div>
    </Link>
  );
}

export function GameHall() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentGameSlugs());
  }, []);

  const recentGames = recent
    .map((slug) => GAMES.find((g) => g.slug === slug))
    .filter((g): g is GameManifest => Boolean(g));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <header className="relative border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:py-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-fuchsia-300/90">
              Game Arcade
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              像素大厅
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-400">
              多款小游戏一站畅玩。挑选一款，立刻开始——进度与最高分保存在本机浏览器。
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            沉浸游戏时光
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-12">
        {recentGames.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              最近玩过
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentGames.map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 transition hover:border-fuchsia-500/40 hover:bg-fuchsia-500/10"
                >
                  <span>{g.emoji}</span>
                  {g.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">全部游戏</h2>
              <p className="mt-1 text-sm text-slate-500">
                共 {GAMES.length} 款，持续更新中
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {GAMES.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-white/5 pt-10 text-center text-sm text-slate-500">
          <p>Next.js 游戏合辑 · 本地存储最高分与最近游玩记录</p>
        </footer>
      </main>
    </div>
  );
}
