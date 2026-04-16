import {
  GROUND_H,
  PIPE_PRELOAD_DISTANCE,
  PIPE_SPAWN_BUFFER,
  PIPE_W,
  W,
  createInitialPipeQueue,
  getGroundTileXs,
} from "@/games/flappy-bird/pipe-layout";

describe("createInitialPipeQueue", () => {
  test("seeds the first pipe close enough to be visible immediately", () => {
    const pipes = createInitialPipeQueue();

    expect(pipes.length).toBeGreaterThan(0);
    expect(pipes[0].x).toBeLessThan(W);
    expect(pipes[0].x + PIPE_W).toBeGreaterThan(W);
  });

  test("preloads enough upcoming pipes beyond the viewport", () => {
    const pipes = createInitialPipeQueue();
    const lastPipe = pipes.at(-1);

    expect(lastPipe).toBeDefined();
    expect(lastPipe!.x).toBeGreaterThanOrEqual(W + PIPE_PRELOAD_DISTANCE);
    expect(lastPipe!.x).toBeGreaterThan(pipes[0].x + PIPE_SPAWN_BUFFER);
  });
});

describe("getGroundTileXs", () => {
  test("covers the full viewport even at the initial offset", () => {
    const xs = getGroundTileXs(0, 336, W);
    const rightEdge = Math.max(...xs.map((x) => x + 336));

    expect(xs[0]).toBe(0);
    expect(rightEdge).toBeGreaterThanOrEqual(W);
  });

  test("covers the full viewport while scrolling", () => {
    const xs = getGroundTileXs(335, 336, W);
    const leftEdge = Math.min(...xs);
    const rightEdge = Math.max(...xs.map((x) => x + 336));

    expect(leftEdge).toBeLessThanOrEqual(0);
    expect(rightEdge).toBeGreaterThanOrEqual(W);
  });
});
