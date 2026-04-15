import { Character, Choice, Scene } from '../types';
import { getSceneById } from '../data/scenes';

export const getAffectionLevel = (affection: number): string => {
  if (affection >= 80) return '❤️ 深爱';
  if (affection >= 60) return '💕 喜欢';
  if (affection >= 40) return '😊 好感';
  if (affection >= 20) return '😐 一般';
  return '😑 陌生';
};

export const updateCharacterAffection = (
  characters: Character[],
  sceneCharacters: string[],
  affectionChange: number
): Character[] => {
  return characters.map(char => {
    if (sceneCharacters.includes(char.id)) {
      return {
        ...char,
        currentAffection: Math.min(char.currentAffection + affectionChange, char.maxAffection)
      };
    }
    return char;
  });
};

export const getNextScene = (choice: Choice): Scene | null => {
  const nextScene = getSceneById(choice.nextScene);
  return nextScene || null;
};

export const calculateTotalAffection = (characters: Character[]): number => {
  return characters.reduce((total, char) => total + char.currentAffection, 0);
};

export const getCharacterWithHighestAffection = (characters: Character[]): Character | null => {
  if (characters.length === 0) return null;

  return characters.reduce((highest, current) =>
    current.currentAffection > highest.currentAffection ? current : highest
  );
};

export const getAffectionPercentage = (character: Character): number => {
  return (character.currentAffection / character.maxAffection) * 100;
};
