"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { touchRecentGame } from "@/core/game-engine/storage";
import type { LeaderboardEntry } from "@/core/game-engine/types";
import {
  GROUND_H,
  H,
  PIPE_PRELOAD_DISTANCE,
  PIPE_W,
  W,
  createInitialPipeQueue,
  createPipe,
  getGroundTileXs,
  getNextPipeSpacing,
  type Pipe,
} from "@/games/flappy-bird/pipe-layout";

const GAME_ID = "flappy-bird";
const BIRD_X = 100;
const BIRD_R = 16;
const GRAVITY = 0.42;
const JUMP = -8.2;
const PIPE_SPEED = 3.2;
const PIPE_SPRITE_H = 320;
const PIPE_CAP_H = 26;
const PIPE_OVERLAP_PX = 1;

type GamePhase = "idle" | "playing" | "over";

interface FlappyAssets {
  background: HTMLImageElement;
  base: HTMLImageElement;
  pipeGreen: HTMLImageElement;
  birdFrames: [HTMLImageElement, HTMLImageElement, HTMLImageElement];
  message: HTMLImageElement;
  gameOver: HTMLImageElement;
  digits: HTMLImageElement[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function drawPipeSection(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  height: number
) {
  const imageHeight = image.height || PIPE_SPRITE_H;
  const capHeight = Math.min(PIPE_CAP_H, imageHeight);
  const bodySourceHeight = Math.max(1, imageHeight - capHeight);

  if (height <= 0) return;

  if (height <= capHeight) {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      height,
      x,
      y,
      PIPE_W,
      height
    );
    return;
  }

  const bodyHeight = height - capHeight + PIPE_OVERLAP_PX;
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    capHeight,
    x,
    y,
    PIPE_W,
    capHeight
  );
  ctx.drawImage(
    image,
    0,
    capHeight,
    image.width,
    bodySourceHeight,
    x,
    y + capHeight - PIPE_OVERLAP_PX,
    PIPE_W,
    bodyHeight
  );
}

function circleRectOverlap(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  const nx = Math.max(rx, Math.min(cx, rx + rw));
  const ny = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy < r * r;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function loadAssets(): Promise<FlappyAssets> {
  const [
    background,
    base,
    pipeGreen,
    birdDown,
    birdMid,
    birdUp,
    message,
    gameOver,
    ...digits
  ] = await Promise.all([
    loadImage("/flappy/background-day.png"),
    loadImage("/flappy/base.png"),
    loadImage("/flappy/pipe-green.png"),
    loadImage("/flappy/yellowbird-downflap.png"),
    loadImage("/flappy/yellowbird-midflap.png"),
    loadImage("/flappy/yellowbird-upflap.png"),
    loadImage("/flappy/message.png"),
    loadImage("/flappy/gameover.png"),
    ...Array.from({ length: 10 }, (_, i) => loadImage(`/flappy/${i}.png`)),
  ]);

  return {
    background,
    base,
    pipeGreen,
    birdFrames: [birdDown, birdMid, birdUp],
    message,
    gameOver,
    digits,
  };
}

function drawNumber(
  ctx: CanvasRenderingContext2D,
  digits: HTMLImageElement[],
  score: number,
  x: number,
  y: number
) {
  const chars = String(Math.max(0, score)).split("");
  const totalW = chars.reduce((sum, c) => sum + (digits[Number(c)]?.width ?? 0), 0);
  let cur = x - totalW / 2;
  for (const c of chars) {
    const img = digits[Number(c)];
    if (!img) continue;
    ctx.drawImage(img, cur, y);
    cur += img.width;
  }
}

async function fetchLeaderboard(gameId: string): Promise<LeaderboardEntry[]> {
  const res = await fetch(`/api/leaderboard?gameId=${encodeURIComponent(gameId)}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as { entries?: LeaderboardEntry[]; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch leaderboard");
  }
  return Array.isArray(data.entries) ? data.entries : [];
}

async function submitScore(
  gameId: string,
  score: number,
  name: string
): Promise<{ qualified: boolean; entries: LeaderboardEntry[] }> {
  const res = await fetch("/api/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId, score, name }),
  });
  const data = (await res.json()) as {
    qualified?: boolean;
    entries?: LeaderboardEntry[];
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to submit score");
  }
  return {
    qualified: Boolean(data.qualified),
    entries: Array.isArray(data.entries) ? data.entries : [],
  };
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const phaseRef = useRef<GamePhase>("idle");
  const birdYRef = useRef(H / 2);
  const birdVelRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const baseOffsetRef = useRef(0);
  const assetsRef = useRef<FlappyAssets | null>(null);
  const birdFrameRef = useRef(0);
  const birdFrameTsRef = useRef(0);

  const [uiScore, setUiScore] = useState(0);
  const [best, setBest] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    touchRecentGame(GAME_ID);
    fetchLeaderboard(GAME_ID)
      .then((entries) => {
        setLeaderboard(entries);
        setBest(entries[0]?.score ?? 0);
      })
      .catch(() => {
        setLeaderboardError("排行榜加载失败，请稍后重试");
      });
    loadAssets()
      .then((assets) => {
        assetsRef.current = assets;
        setAssetsReady(true);
      })
      .catch(() => {
        setAssetsReady(false);
      });
  }, []);

  const resetGame = useCallback(() => {
    phaseRef.current = "idle";
    birdYRef.current = H / 2;
    birdVelRef.current = 0;
    pipesRef.current = createInitialPipeQueue();
    scoreRef.current = 0;
    baseOffsetRef.current = 0;
    birdFrameRef.current = 0;
    birdFrameTsRef.current = 0;
    setUiScore(0);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const endGame = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    phaseRef.current = "over";
    const s = scoreRef.current;
    const defaultName = `玩家${Math.max(1, Math.floor(Math.random() * 1000))}`;
    const userInput = window.prompt(
      "尝试冲榜！请输入你的名字（最多20字，不上榜不会保存）",
      defaultName
    );
    const name = userInput ?? defaultName;
    void submitScore(GAME_ID, s, name)
      .then((result) => {
        setLeaderboard(result.entries);
        setBest(result.entries[0]?.score ?? 0);
      })
      .catch(() => {
        setLeaderboardError("成绩提交失败，请检查网络后重试");
      });
  }, []);

  const jump = useCallback(() => {
    if (phaseRef.current === "idle") {
      phaseRef.current = "playing";
      birdVelRef.current = JUMP;
    } else if (phaseRef.current === "playing") {
      birdVelRef.current = JUMP;
    } else {
      resetGame();
    }
  }, [resetGame]);

  const jumpRef = useRef(jump);
  jumpRef.current = jump;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jumpRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const endGameRef = useRef(endGame);
  endGameRef.current = endGame;

  useEffect(() => {
    if (!assetsReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const draw = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(32, ts - last);
      lastTsRef.current = ts;
      const assets = assetsRef.current;
      if (!assets) return;

      const groundY = H - GROUND_H;

      if (phaseRef.current === "playing") {
        birdVelRef.current += GRAVITY * (dt / 16);
        birdYRef.current += birdVelRef.current * (dt / 16);
        baseOffsetRef.current += PIPE_SPEED * (dt / 16);

        if (ts - birdFrameTsRef.current > 90) {
          birdFrameTsRef.current = ts;
          birdFrameRef.current = (birdFrameRef.current + 1) % assets.birdFrames.length;
        }

        const pipes = pipesRef.current;
        for (const p of pipes) {
          p.x -= PIPE_SPEED * (dt / 16);
        }

        while (pipes.length && pipes[0].x + PIPE_W < -20) {
          pipes.shift();
        }

        if (!pipes.length) {
          pipes.push(...createInitialPipeQueue());
        }

        while (pipes[pipes.length - 1].x < W + PIPE_PRELOAD_DISTANCE) {
          const lastPipe = pipes[pipes.length - 1];
          const nextSpacing = getNextPipeSpacing();
          pipes.push(createPipe(lastPipe.x + nextSpacing));
        }

        for (const p of pipes) {
          const topH = p.gapCenter - p.gapSize / 2;
          const bottomY = p.gapCenter + p.gapSize / 2;

          if (
            circleRectOverlap(BIRD_X, birdYRef.current, BIRD_R, p.x, 0, PIPE_W, topH) ||
            circleRectOverlap(
              BIRD_X,
              birdYRef.current,
              BIRD_R,
              p.x,
              bottomY,
              PIPE_W,
              groundY - bottomY
            )
          ) {
            endGameRef.current();
            break;
          }

          if (!p.passed && p.x + PIPE_W < BIRD_X) {
            p.passed = true;
            scoreRef.current += 1;
            setUiScore(scoreRef.current);
          }
        }

        if (phaseRef.current === "playing") {
          if (birdYRef.current - BIRD_R < 0 || birdYRef.current + BIRD_R > groundY) {
            endGameRef.current();
          }
        }
      }

      ctx.drawImage(assets.background, 0, 0, W, H);

      for (const p of pipesRef.current) {
        const topH = p.gapCenter - p.gapSize / 2;
        const bottomY = p.gapCenter + p.gapSize / 2;
        drawPipeSection(ctx, assets.pipeGreen, p.x, bottomY, groundY - bottomY);
        ctx.save();
        ctx.translate(p.x + PIPE_W / 2, topH / 2);
        ctx.scale(1, -1);
        drawPipeSection(ctx, assets.pipeGreen, -PIPE_W / 2, -topH / 2, topH);
        ctx.restore();
      }

      const birdFrame = assets.birdFrames[birdFrameRef.current];
      const birdTilt = Math.max(-0.5, Math.min(1.1, birdVelRef.current / 10));
      ctx.save();
      ctx.translate(BIRD_X, birdYRef.current);
      ctx.rotate(birdTilt);
      ctx.drawImage(
        birdFrame,
        -birdFrame.width / 2,
        -birdFrame.height / 2,
        birdFrame.width,
        birdFrame.height
      );
      ctx.restore();

      const baseWidth = assets.base.width || 336;
      const offset = baseOffsetRef.current % baseWidth;
      for (const tileX of getGroundTileXs(offset, baseWidth, W)) {
        ctx.drawImage(assets.base, tileX, groundY, baseWidth, GROUND_H);
      }
      drawNumber(ctx, assets.digits, scoreRef.current, W / 2, 20);

      if (phaseRef.current === "idle") {
        ctx.drawImage(assets.message, (W - assets.message.width) / 2, 145);
        ctx.fillStyle = "rgba(15,23,42,0.65)";
        ctx.fillRect(70, 345, 260, 44);
        ctx.fillStyle = "#fff";
        ctx.font = "600 16px system-ui";
        ctx.fillText("点击画面或按空格开始", 92, 373);
      }

      if (phaseRef.current === "over") {
        ctx.fillStyle = "rgba(15,23,42,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(assets.gameOver, (W - assets.gameOver.width) / 2, 170);
        drawNumber(ctx, assets.digits, scoreRef.current, W / 2, 250);
        ctx.fillStyle = "#fff";
        ctx.font = "600 16px system-ui";
        ctx.fillText("点击再来一局", 138, 330);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [assetsReady]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            ← 返回大厅
          </Link>
          <div className="text-right text-sm text-slate-400">
            <div>最高分：{best}</div>
            <div className="text-emerald-400">当前：{uiScore}</div>
          </div>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight">
          Flappy Bird
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          空格或点击控制 · 穿过绿色管道
        </p>

        <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-cyan-500/10">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={() => jumpRef.current()}
            className="block h-auto w-full cursor-pointer touch-manipulation bg-sky-300"
            role="img"
            aria-label="Flappy Bird 游戏画面"
          />
        </div>

        {!assetsReady && (
          <p className="mt-4 text-center text-xs text-amber-300">
            正在加载官方素材...
          </p>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          提示：失败后可以立刻点击画布再来一局
        </p>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">排行榜 Top 20</h2>
            <span className="text-xs text-slate-400">仅当前游戏</span>
          </div>
          {leaderboard.length === 0 ? (
            <p className="text-sm text-slate-400">暂无上榜记录，快来拿下第一名。</p>
          ) : (
            <ol className="space-y-1.5">
              {leaderboard.map((entry, idx) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-8 text-slate-400">#{idx + 1}</span>
                    <span className="truncate text-slate-100">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-emerald-300">{entry.score}</span>
                </li>
              ))}
            </ol>
          )}
          {leaderboardError && (
            <p className="mt-3 text-xs text-amber-300">{leaderboardError}</p>
          )}
        </section>
      </div>
    </div>
  );
}
