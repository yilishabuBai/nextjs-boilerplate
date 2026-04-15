import { NextResponse } from "next/server";
import {
  getServerLeaderboard,
  submitServerLeaderboardScore,
} from "@/core/game-engine/server-leaderboard";

const GAME_ID_MAX_LENGTH = 64;

function normalizeGameId(gameId: unknown): string {
  if (typeof gameId !== "string") return "";
  return gameId.trim().slice(0, GAME_ID_MAX_LENGTH);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const gameId = normalizeGameId(url.searchParams.get("gameId"));
    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 });
    }

    const entries = await getServerLeaderboard(gameId);
    return NextResponse.json({ entries, limit: 20 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to load leaderboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const gameId = normalizeGameId((body as { gameId?: unknown })?.gameId);
  const score = Number((body as { score?: unknown })?.score);
  const name = String((body as { name?: unknown })?.name ?? "");

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  if (!Number.isFinite(score)) {
    return NextResponse.json({ error: "score must be a number" }, { status: 400 });
  }

  try {
    const result = await submitServerLeaderboardScore(gameId, score, name);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to submit score";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

