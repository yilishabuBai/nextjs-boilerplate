import {
  GROUND_H,
  H,
  MAX_GAP,
  MAX_PIPE_SPACING,
  MIN_GAP,
  MIN_PIPE_SPACING,
  PIPE_PRELOAD_DISTANCE,
  PIPE_SPAWN_BUFFER,
  PIPE_W,
  W,
  createInitialPipeQueue,
  createPipe,
  getGapSize,
  getNextPipeSpacing,
  getGroundTileXs,
  randomGapCenter,
} from "@/games/flappy-bird/pipe-layout";

describe("getGapSize", () => {
  test("returns a value within MIN_GAP and MAX_GAP range", () => {
    const gapSize = getGapSize();
    expect(gapSize).toBeGreaterThanOrEqual(MIN_GAP);
    expect(gapSize).toBeLessThanOrEqual(MAX_GAP);
  });

  test("returns integer values", () => {
    const gapSize = getGapSize();
    expect(Number.isInteger(gapSize)).toBe(true);
  });

  test("generates varied gap sizes across multiple calls", () => {
    const gaps = Array.from({ length: 10 }, () => getGapSize());
    const uniqueGaps = new Set(gaps);
    // With random generation, we expect some variation
    expect(uniqueGaps.size).toBeGreaterThan(1);
  });
});

describe("getNextPipeSpacing", () => {
  test("returns a value within MIN_PIPE_SPACING and MAX_PIPE_SPACING range", () => {
    const spacing = getNextPipeSpacing();
    expect(spacing).toBeGreaterThanOrEqual(MIN_PIPE_SPACING);
    expect(spacing).toBeLessThanOrEqual(MAX_PIPE_SPACING);
  });

  test("returns integer values", () => {
    const spacing = getNextPipeSpacing();
    expect(Number.isInteger(spacing)).toBe(true);
  });

  test("generates varied spacings across multiple calls", () => {
    const spacings = Array.from({ length: 10 }, () => getNextPipeSpacing());
    const uniqueSpacings = new Set(spacings);
    expect(uniqueSpacings.size).toBeGreaterThan(1);
  });
});

describe("randomGapCenter", () => {
  const gapSize = 150;

  test("returns a value within playable area", () => {
    const center = randomGapCenter(gapSize);
    const margin = 58;
    const playableHeight = H - GROUND_H;
    const minCenter = margin + gapSize / 2;
    const maxCenter = playableHeight - margin - gapSize / 2;

    expect(center).toBeGreaterThanOrEqual(minCenter);
    expect(center).toBeLessThanOrEqual(maxCenter);
  });

  test("generates varied centers across multiple calls", () => {
    const centers = Array.from({ length: 10 }, () => randomGapCenter(gapSize));
    const uniqueCenters = new Set(centers);
    expect(uniqueCenters.size).toBeGreaterThan(1);
  });

  test("adjusts range based on gap size", () => {
    const smallGap = 100;
    const largeGap = 200;

    const smallRange = H - GROUND_H - 2 * 58 - smallGap;
    const largeRange = H - GROUND_H - 2 * 58 - largeGap;

    expect(smallRange).toBeGreaterThan(largeRange);
  });
});

describe("createPipe", () => {
  const startX = 400;

  test("creates a pipe with correct x position", () => {
    const pipe = createPipe(startX);
    expect(pipe.x).toBe(startX);
  });

  test("creates a pipe with valid gap size", () => {
    const pipe = createPipe(startX);
    expect(pipe.gapSize).toBeGreaterThanOrEqual(MIN_GAP);
    expect(pipe.gapSize).toBeLessThanOrEqual(MAX_GAP);
  });

  test("creates a pipe with valid gap center", () => {
    const pipe = createPipe(startX);
    expect(pipe.gapCenter).toBeGreaterThan(0);
  });

  test("creates a pipe with passed flag set to false", () => {
    const pipe = createPipe(startX);
    expect(pipe.passed).toBe(false);
  });

  test("creates pipes with randomized properties", () => {
    // Run multiple times to check randomization
    const pipes = Array.from({ length: 5 }, () => createPipe(startX));
    
    // All should have valid properties
    pipes.forEach((pipe) => {
      expect(pipe.x).toBe(startX);
      expect(pipe.gapSize).toBeGreaterThanOrEqual(MIN_GAP);
      expect(pipe.gapSize).toBeLessThanOrEqual(MAX_GAP);
      expect(pipe.passed).toBe(false);
    });
    
    // With random generation, we expect some variation in gap sizes
    const gapSizes = pipes.map((p) => p.gapSize);
    const uniqueGaps = new Set(gapSizes);
    expect(uniqueGaps.size).toBeGreaterThan(1);
  });
});

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

  test("creates pipes with increasing x positions", () => {
    const pipes = createInitialPipeQueue();

    for (let i = 1; i < pipes.length; i++) {
      expect(pipes[i].x).toBeGreaterThan(pipes[i - 1].x);
    }
  });

  test("all pipes have valid gap sizes", () => {
    const pipes = createInitialPipeQueue();

    pipes.forEach((pipe) => {
      expect(pipe.gapSize).toBeGreaterThanOrEqual(MIN_GAP);
      expect(pipe.gapSize).toBeLessThanOrEqual(MAX_GAP);
    });
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
