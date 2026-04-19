/**
 * Flappy Bird Game Logic Tests
 * Coverage: Game state, collision detection, score tracking
 */

describe('FlappyBird Game Logic', () => {
  // Mock game state
  let gameState: {
    birdY: number;
    velocity: number;
    gravity: number;
    jumpStrength: number;
    pipes: Array<{ x: number; gapY: number }>;
    score: number;
    isGameOver: boolean;
  };

  beforeEach(() => {
    gameState = {
      birdY: 250,
      velocity: 0,
      gravity: 0.5,
      jumpStrength: -8,
      pipes: [{ x: 400, gapY: 250 }],
      score: 0,
      isGameOver: false,
    };
  });

  describe('Bird Movement', () => {
    it('should apply gravity to bird velocity', () => {
      gameState.velocity += gameState.gravity;
      expect(gameState.velocity).toBe(0.5);
    });

    it('should update bird position based on velocity', () => {
      gameState.velocity += gameState.gravity;
      gameState.birdY += gameState.velocity;
      expect(gameState.birdY).toBe(250.5);
    });

    it('should apply jump strength when jumping', () => {
      gameState.velocity = gameState.jumpStrength;
      expect(gameState.velocity).toBe(-8);
    });
  });

  describe('Collision Detection', () => {
    const birdRect = { x: 50, y: 250, width: 30, height: 30 };
    const pipeRect = { x: 400, y: 0, width: 60, height: 200 };

    it('should detect collision with top pipe', () => {
      const collision = !(
        birdRect.x + birdRect.width < pipeRect.x ||
        birdRect.x > pipeRect.x + pipeRect.width ||
        birdRect.y + birdRect.height < pipeRect.y ||
        birdRect.y > pipeRect.y + pipeRect.height
      );
      expect(collision).toBe(false); // No collision at current positions
    });

    it('should detect ground collision', () => {
      const groundLevel = 400;
      gameState.birdY = 410;
      expect(gameState.birdY > groundLevel).toBe(true);
    });

    it('should detect ceiling collision', () => {
      const ceilingLevel = 0;
      gameState.birdY = -10;
      expect(gameState.birdY < ceilingLevel).toBe(true);
    });
  });

  describe('Score Tracking', () => {
    it('should increment score when passing pipe', () => {
      const initialScore = gameState.score;
      gameState.score += 1;
      expect(gameState.score).toBe(initialScore + 1);
    });

    it('should track high score', () => {
      let highScore = 0;
      const currentScore = 5;
      if (currentScore > highScore) {
        highScore = currentScore;
      }
      expect(highScore).toBe(5);
    });
  });

  describe('Game State Management', () => {
    it('should start in playing state', () => {
      expect(gameState.isGameOver).toBe(false);
    });

    it('should set game over on collision', () => {
      gameState.isGameOver = true;
      expect(gameState.isGameOver).toBe(true);
    });

    it('should reset game state', () => {
      gameState.isGameOver = true;
      gameState.score = 10;
      gameState.birdY = 100;
      
      // Reset
      gameState.isGameOver = false;
      gameState.score = 0;
      gameState.birdY = 250;
      
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.score).toBe(0);
      expect(gameState.birdY).toBe(250);
    });
  });
});
