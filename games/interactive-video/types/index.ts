export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  personality: string;
  currentAffection: number;
  maxAffection: number;
  birthday: string;
  zodiac: string;
  hobby: string;
  specialSkill: string;
  favoriteFood: string;
  weakness: string;
}

export interface Choice {
  id: string;
  text: string;
  affectionChange: number;
  nextScene: string;
  consequence: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  background: string;
  characters: string[];
  dialogue: string;
  choices: Choice[];
}

export interface GameState {
  currentScene: Scene;
  characterList: Character[];
  selectedChoice: Choice | null;
  showConsequence: boolean;
  gameHistory: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockCondition: string;
}

export interface GameStats {
  totalChoices: number;
  totalAffection: number;
  favoriteCharacter: string;
  playTime: number;
  scenesCompleted: number;
}

export interface Ending {
  id: string;
  title: string;
  character: string;
  type: 'romance' | 'friendship' | 'acquaintance' | 'distant';
  description: string;
  background: string;
  requirements: {
    minAffection: number;
    scenesCompleted: string[];
  };
  rewards: {
    affectionBonus: number;
    achievement: string;
    specialItem: string;
  };
  dialogue: string;
  choices: {
    id: string;
    text: string;
    consequence: string;
  }[];
}

export interface EndingResult {
  ending: Ending;
  character: Character;
  totalAffection: number;
  playTime: number;
  scenesCompleted: number;
  achievementsUnlocked: string[];
}
