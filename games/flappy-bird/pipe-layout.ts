export const W = 400;
export const H = 600;
export const PIPE_W = 52;
export const GROUND_H = 112;
export const MIN_GAP = 112;
export const MAX_GAP = 190;
export const MIN_PIPE_SPACING = 220;
export const MAX_PIPE_SPACING = 360;
export const PIPE_SPAWN_BUFFER = 150;
export const PIPE_PRELOAD_DISTANCE = PIPE_SPAWN_BUFFER + MAX_PIPE_SPACING * 2;
const INITIAL_PIPE_VISIBLE_WIDTH = 18;

export interface Pipe {
  x: number;
  gapCenter: number;
  gapSize: number;
  passed: boolean;
}

export function getGapSize(): number {
  return Math.round(MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
}

export function getNextPipeSpacing(): number {
  return Math.round(
    MIN_PIPE_SPACING + Math.random() * (MAX_PIPE_SPACING - MIN_PIPE_SPACING)
  );
}

export function randomGapCenter(gapSize: number): number {
  const margin = 58;
  const playableHeight = H - GROUND_H;
  const minCenter = margin + gapSize / 2;
  const maxCenter = playableHeight - margin - gapSize / 2;
  return minCenter + Math.random() * (maxCenter - minCenter);
}

export function createPipe(startX: number): Pipe {
  const gapSize = getGapSize();
  return {
    x: startX,
    gapCenter: randomGapCenter(gapSize),
    gapSize,
    passed: false,
  };
}

export function createInitialPipeQueue(): Pipe[] {
  const pipes: Pipe[] = [createPipe(W - INITIAL_PIPE_VISIBLE_WIDTH)];

  while (pipes[pipes.length - 1].x < W + PIPE_PRELOAD_DISTANCE) {
    const lastPipe = pipes[pipes.length - 1];
    pipes.push(createPipe(lastPipe.x + getNextPipeSpacing()));
  }

  return pipes;
}

export function getGroundTileXs(
  offset: number,
  tileWidth: number,
  viewportWidth: number
): number[] {
  const normalizedOffset = ((offset % tileWidth) + tileWidth) % tileWidth;
  const xs: number[] = [];
  let x = normalizedOffset === 0 ? 0 : -normalizedOffset;

  while (x < viewportWidth) {
    xs.push(x);
    x += tileWidth;
  }

  return xs;
}
