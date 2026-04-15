'use client';

import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { touchRecentGame } from '@/core/game-engine/storage';
import CharacterPanel from './components/CharacterPanel';
import SceneDisplay from './components/SceneDisplay';
import ChoiceResult from './components/ChoiceResult';
import GameHistory from './components/GameHistory';
import AchievementPanel from './components/AchievementPanel';
import { achievements } from './data/achievements';

export default function InteractiveVideoGame() {
  const { gameState, handleChoiceSelect } = useGameState();

  useEffect(() => {
    touchRecentGame('interactive-video');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            完蛋！我被美女包围了
          </h1>
          <p className="text-xl text-gray-700">
            选择你的道路，赢得女孩们的芳心
          </p>
          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
            <span>🎮 互动选择</span>
            <span>💕 好感度系统</span>
            <span>🏆 成就收集</span>
            <span>🌟 多角色互动</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：角色信息面板 */}
          <div className="lg:col-span-1">
            <CharacterPanel characters={gameState.characterList} />
          </div>

          {/* 中间：主要游戏区域 */}
          <div className="lg:col-span-2">
            <SceneDisplay
              scene={gameState.currentScene}
              onChoiceSelect={handleChoiceSelect}
            />

            <ChoiceResult
              choice={gameState.selectedChoice}
              showConsequence={gameState.showConsequence}
            />
          </div>

          {/* 右侧：成就系统 */}
          <div className="lg:col-span-1">
            <AchievementPanel achievements={achievements} />
          </div>
        </div>

        {/* 游戏历史 */}
        <GameHistory gameHistory={gameState.gameHistory} />

        {/* 游戏统计信息 */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/50">
            <h3 className="text-xl font-bold text-purple-700 mb-4">游戏统计</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500 mb-2">
                  {gameState.gameHistory.length}
                </div>
                <p className="text-gray-600">选择次数</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {gameState.characterList.length}
                </div>
                <p className="text-gray-600">角色数量</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {gameState.characterList.reduce((total, char) => total + char.currentAffection, 0)}
                </div>
                <p className="text-gray-600">总好感度</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <p className="text-gray-600">解锁成就</p>
              </div>
            </div>
          </div>
        </div>

        {/* 返回主页按钮 */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回主页
          </a>
        </div>
      </div>
    </div>
  );
}
