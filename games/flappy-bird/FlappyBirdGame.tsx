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

type GamePhase = "idle" | "playing" | "over";

interface Pipe {
  x: number;
  gapCenter: number;
  passed: boolean;
}

function randomGapCenter(): number {
  const margin = 100;
  return margin + Math.random() * (H - 2 * margin - GAP);
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

  const [uiScore, setUiScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(getBestScore(GAME_ID));
    touchRecentGame(GAME_ID);
  }, []);

  const resetGame = useCallback(() => {
    phaseRef.current = "idle";
    birdYRef.current = H / 2;
    birdVelRef.current = 0;
    pipesRef.current = [];
    scoreRef.current = 0;
    lastSpawnRef.current = performance.now();
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(32, ts - last);
      lastTsRef.current = ts;

      if (phaseRef.current === "playing") {
        birdVelRef.current += GRAVITY * (dt / 16);
        birdYRef.current += birdVelRef.current * (dt / 16);

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
              H - bottomY
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
          if (birdYRef.current - BIRD_R < 0 || birdYRef.current + BIRD_R > H - 40) {
            endGameRef.current();
          }
        }
      }

      ctx.fillStyle = "#7dd3fc";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#38bdf8";
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(i * 60 - ((ts / 20) % 60), H - 48, 40, 48);
      }
      ctx.fillStyle = "#86efac";
      ctx.fillRect(0, H - 40, W, 40);

      for (const p of pipesRef.current) {
        const topH = p.gapCenter - GAP / 2;
        const bottomY = p.gapCenter + GAP / 2;
        ctx.fillStyle = "#16a34a";
        ctx.fillRect(p.x, 0, PIPE_W, topH);
        ctx.fillRect(p.x, bottomY, PIPE_W, H - bottomY);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(p.x - 4, topH - 24, PIPE_W + 8, 24);
        ctx.fillRect(p.x - 4, bottomY, PIPE_W + 8, 24);
      }

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(BIRD_X, birdYRef.current, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(BIRD_X + 8, birdYRef.current - 4, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, 44);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px system-ui";
      ctx.fillText(`分数 ${scoreRef.current}`, 14, 28);

      if (phaseRef.current === "idle") {
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.fillRect(40, 220, W - 80, 120);
        ctx.fillStyle = "#0f172a";
        ctx.font = "600 16px system-ui";
        ctx.fillText("点击画面或按空格", 88, 268);
        ctx.font = "14px system-ui";
        ctx.fillText("开始游戏", 158, 298);
      }

      if (phaseRef.current === "over") {
        ctx.fillStyle = "rgba(15,23,42,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 22px system-ui";
        ctx.fillText("游戏结束", 150, 260);
        ctx.font = "16px system-ui";
        ctx.fillText(`得分 ${scoreRef.current}`, 164, 300);
        ctx.fillText("点击再来一局", 132, 340);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

        <p className="mt-6 text-center text-xs text-slate-500">
          提示：失败后可以立刻点击画布再来一局
        </p>
      </div>
    </div>
  );
}
