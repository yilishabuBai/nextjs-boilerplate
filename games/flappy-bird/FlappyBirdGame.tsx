"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getBestScore, setBestScore, touchRecentGame } from "@/core/game-engine/storage";

const GAME_ID = "flappy-bird";

const W = 400;
const H = 600;
const BIRD_X = 100;
const BIRD_R = 16;
const GRAVITY = 0.42;
const JUMP = -8.2;
const PIPE_W = 52;
const PIPE_SPEED = 3.2;
const GAP = 150;
const SPAWN_EVERY = 2000;
const GROUND_H = 112;

type GamePhase = "idle" | "playing" | "over";

interface Pipe {
  x: number;
  gapCenter: number;
  passed: boolean;
}

interface FlappyAssets {
  background: HTMLImageElement;
  base: HTMLImageElement;
  pipeGreen: HTMLImageElement;
  birdFrames: [HTMLImageElement, HTMLImageElement, HTMLImageElement];
  message: HTMLImageElement;
  gameOver: HTMLImageElement;
  digits: HTMLImageElement[];
}

function randomGapCenter(): number {
  const margin = 100;
  const playableBottom = H - GROUND_H - margin;
  return margin + Math.random() * (playableBottom - margin - GAP);
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

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const phaseRef = useRef<GamePhase>("idle");
  const birdYRef = useRef(H / 2);
  const birdVelRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const baseOffsetRef = useRef(0);
  const assetsRef = useRef<FlappyAssets | null>(null);
  const birdFrameRef = useRef(0);
  const birdFrameTsRef = useRef(0);

  const [uiScore, setUiScore] = useState(0);
  const [best, setBest] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    setBest(getBestScore(GAME_ID));
    touchRecentGame(GAME_ID);
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
    pipesRef.current = [];
    scoreRef.current = 0;
    lastSpawnRef.current = performance.now();
    baseOffsetRef.current = 0;
    birdFrameRef.current = 0;
    birdFrameTsRef.current = 0;
    setUiScore(0);
  }, []);

  const endGame = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    phaseRef.current = "over";
    const s = scoreRef.current;
    setBestScore(GAME_ID, s);
    setBest(getBestScore(GAME_ID));
  }, []);

  const jump = useCallback(() => {
    if (phaseRef.current === "idle") {
      phaseRef.current = "playing";
      birdVelRef.current = JUMP;
      lastSpawnRef.current = performance.now();
      pipesRef.current = [
        { x: W + 40, gapCenter: randomGapCenter(), passed: false },
      ];
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

        if (ts - lastSpawnRef.current > SPAWN_EVERY) {
          lastSpawnRef.current = ts;
          pipes.push({ x: W + 30, gapCenter: randomGapCenter(), passed: false });
        }

        for (const p of pipes) {
          const topH = p.gapCenter - GAP / 2;
          const bottomY = p.gapCenter + GAP / 2;

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
        const topH = p.gapCenter - GAP / 2;
        const bottomY = p.gapCenter + GAP / 2;
        ctx.drawImage(assets.pipeGreen, p.x, bottomY, PIPE_W, groundY - bottomY);
        ctx.save();
        ctx.translate(p.x + PIPE_W / 2, topH / 2);
        ctx.scale(1, -1);
        ctx.drawImage(assets.pipeGreen, -PIPE_W / 2, -topH / 2, PIPE_W, topH);
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
      ctx.drawImage(assets.base, -offset, groundY, baseWidth, GROUND_H);
      ctx.drawImage(assets.base, baseWidth - offset, groundY, baseWidth, GROUND_H);
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
      </div>
    </div>
  );
}
