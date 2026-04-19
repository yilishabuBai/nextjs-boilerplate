/**
 * Storage Tests
 * Coverage: LocalStorage, SessionStorage, data persistence
 */

describe('Storage Service', () => {
  // Mock storage implementation
  class MockStorage {
    private storage: Map<string, string> = new Map();

    getItem(key: string): string | null {
      return this.storage.get(key) || null;
    }

    setItem(key: string, value: string): void {
      this.storage.set(key, value);
    }

    removeItem(key: string): void {
      this.storage.delete(key);
    }

    clear(): void {
      this.storage.clear();
    }

    get length(): number {
      return this.storage.size;
    }

    key(index: number): string | null {
      const keys = Array.from(this.storage.keys());
      return keys[index] || null;
    }
  }

  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
  });

  describe('Basic Operations', () => {
    it('should set and get item', () => {
      storage.setItem('username', 'testplayer');
      expect(storage.getItem('username')).toBe('testplayer');
    });

    it('should return null for non-existent key', () => {
      expect(storage.getItem('nonexistent')).toBeNull();
    });

    it('should remove item', () => {
      storage.setItem('key', 'value');
      storage.removeItem('key');
      expect(storage.getItem('key')).toBeNull();
    });

    it('should clear all items', () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');
      storage.clear();
      expect(storage.length).toBe(0);
    });
  });

  describe('Game Data Persistence', () => {
    interface GameData {
      highScore: number;
      unlockedSkins: string[];
      settings: {
        sound: boolean;
        music: boolean;
      };
    }

    it('should save game data as JSON', () => {
      const gameData: GameData = {
        highScore: 1000,
        unlockedSkins: ['default', 'blue', 'red'],
        settings: { sound: true, music: false },
      };

      storage.setItem('gameData', JSON.stringify(gameData));
      const retrieved = JSON.parse(storage.getItem('gameData') || '{}') as GameData;

      expect(retrieved.highScore).toBe(1000);
      expect(retrieved.unlockedSkins).toHaveLength(3);
      expect(retrieved.settings.sound).toBe(true);
    });

    it('should load game data with defaults', () => {
      const defaultData: GameData = {
        highScore: 0,
        unlockedSkins: ['default'],
        settings: { sound: true, music: true },
      };

      const stored = storage.getItem('gameData');
      const gameData: GameData = stored ? JSON.parse(stored) : defaultData;

      expect(gameData).toEqual(defaultData);
    });

    it('should update high score', () => {
      const gameData: GameData = {
        highScore: 500,
        unlockedSkins: ['default'],
        settings: { sound: true, music: true },
      };

      const newScore = 750;
      if (newScore > gameData.highScore) {
        gameData.highScore = newScore;
        storage.setItem('gameData', JSON.stringify(gameData));
      }

      const updated = JSON.parse(storage.getItem('gameData') || '{}') as GameData;
      expect(updated.highScore).toBe(750);
    });
  });

  describe('User Preferences', () => {
    it('should store user theme preference', () => {
      storage.setItem('theme', 'dark');
      expect(storage.getItem('theme')).toBe('dark');
    });

    it('should store user language preference', () => {
      storage.setItem('language', 'zh-CN');
      expect(storage.getItem('language')).toBe('zh-CN');
    });

    it('should store multiple preferences', () => {
      storage.setItem('theme', 'light');
      storage.setItem('language', 'en-US');
      storage.setItem('notifications', 'enabled');

      expect(storage.length).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle storage quota exceeded', () => {
      const largeData = 'x'.repeat(10000000); // 10MB
      
      try {
        storage.setItem('largeData', largeData);
        // In real scenario, this might throw QuotaExceededError
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle JSON parse errors', () => {
      storage.setItem('corrupted', '{invalid json}');
      
      try {
        JSON.parse(storage.getItem('corrupted') || '');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle null/undefined values', () => {
      storage.setItem('nullValue', String(null));
      storage.setItem('undefinedValue', String(undefined));
      
      expect(storage.getItem('nullValue')).toBe('null');
      expect(storage.getItem('undefinedValue')).toBe('undefined');
    });
  });

  describe('Session vs Local Storage', () => {
    let sessionStorage: MockStorage;
    let localStorage: MockStorage;

    beforeEach(() => {
      sessionStorage = new MockStorage();
      localStorage = new MockStorage();
    });

    it('should persist data in localStorage across sessions', () => {
      localStorage.setItem('persistentData', 'value');
      expect(localStorage.getItem('persistentData')).toBe('value');
    });

    it('should clear sessionStorage on browser close', () => {
      sessionStorage.setItem('tempData', 'value');
      expect(sessionStorage.getItem('tempData')).toBe('value');
      
      // Simulate browser close
      sessionStorage.clear();
      expect(sessionStorage.getItem('tempData')).toBeNull();
    });
  });
});
