import { Character } from '../types';

interface CharacterDetailProps {
  character: Character;
  onClose: () => void;
}

export default function CharacterDetail({ character, onClose }: CharacterDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {character.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{character.name}</h2>
                <p className="text-pink-100">{character.personality}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">基本信息</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">生日:</span>
                <p className="font-medium">{character.birthday}</p>
              </div>
              <div>
                <span className="text-gray-600">星座:</span>
                <p className="font-medium">{character.zodiac}</p>
              </div>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">角色描述</h3>
            <p className="text-gray-700 leading-relaxed">{character.description}</p>
          </div>

          {/* 爱好 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">兴趣爱好</h3>
            <p className="text-gray-700">{character.hobby}</p>
          </div>

          {/* 特殊技能 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">特殊技能</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
              <p className="text-purple-700 font-medium">{character.specialSkill}</p>
            </div>
          </div>

          {/* 最喜欢的食物 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">最喜欢的食物</h3>
            <p className="text-gray-700">{character.favoriteFood}</p>
          </div>

          {/* 弱点 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">小弱点</h3>
            <p className="text-gray-700">{character.weakness}</p>
          </div>

          {/* 好感度 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">当前好感度</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">进度</span>
                <span className="font-medium">{character.currentAffection} / {character.maxAffection}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(character.currentAffection / character.maxAffection) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
