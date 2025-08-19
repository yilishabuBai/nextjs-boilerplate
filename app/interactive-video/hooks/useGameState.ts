import { useState, useCallback } from 'react';
import { Character, Choice, Scene, GameState } from '../types';
import { characters } from '../data/characters';
import { getInitialScene } from '../data/scenes';
import { updateCharacterAffection, getNextScene } from '../utils/gameLogic';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentScene: getInitialScene(),
    characterList: characters,
    selectedChoice: null,
    showConsequence: false,
    gameHistory: []
  });

  const handleChoiceSelect = useCallback((choice: Choice) => {
    setGameState(prevState => {
      // 更新好感度
      const updatedCharacters = updateCharacterAffection(
        prevState.characterList,
        prevState.currentScene.characters,
        choice.affectionChange
      );

      // 添加到游戏历史
      const newGameHistory = [...prevState.gameHistory, choice.consequence];

      return {
        ...prevState,
        selectedChoice: choice,
        showConsequence: true,
        characterList: updatedCharacters,
        gameHistory: newGameHistory
      };
    });

    // 延迟切换到下一个场景
    setTimeout(() => {
      const nextScene = getNextScene(choice);
      if (nextScene) {
        setGameState(prevState => ({
          ...prevState,
          currentScene: nextScene,
          showConsequence: false,
          selectedChoice: null
        }));
      }
    }, 3000);
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      currentScene: getInitialScene(),
      characterList: characters,
      selectedChoice: null,
      showConsequence: false,
      gameHistory: []
    });
  }, []);

  const updateCharacterAffectionDirectly = useCallback((characterId: string, affectionChange: number) => {
    setGameState(prevState => ({
      ...prevState,
      characterList: updateCharacterAffection(
        prevState.characterList,
        [characterId],
        affectionChange
      )
    }));
  }, []);

  return {
    gameState,
    handleChoiceSelect,
    resetGame,
    updateCharacterAffectionDirectly
  };
};
