import { useState } from 'react';
import { Character } from '../types';
import { getAffectionLevel, getAffectionPercentage } from '../utils/gameLogic';
import CharacterDetail from './CharacterDetail';
import { achievements } from '../data/achievements';

interface CharacterPanelProps {
  characters: Character[];
}

export default function CharacterPanel({ characters }: CharacterPanelProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const closeCharacterDetail = () => {
    setSelectedCharacter(null);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/50">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">角色状态</h2>
        <div className="space-y-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-white/60 rounded-lg p-4 border border-purple-200 cursor-pointer hover:bg-white/80 hover:border-purple-300 transition-all duration-300"
              onClick={() => handleCharacterClick(character)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {character.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{character.name}</h3>
                  <p className="text-sm text-gray-600">{getAffectionLevel(character.currentAffection)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{character.zodiac}</p>
                  <p className="text-xs text-gray-500">{character.birthday}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{character.description}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getAffectionPercentage(character)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600">
                  {character.currentAffection} / {character.maxAffection}
                </p>
                <p className="text-xs text-purple-600 font-medium">
                  点击查看详情 →
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 成就系统预览 */}
        <div className="mt-6 pt-6 border-t border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">成就进度</h3>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-700">总体进度</span>
              <span className="text-sm text-purple-600">
                {achievements.filter(a => a.unlocked).length} / {achievements.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 角色详情弹窗 */}
      {selectedCharacter && (
        <CharacterDetail
          character={selectedCharacter}
          onClose={closeCharacterDetail}
        />
      )}
    </>
  );
}
