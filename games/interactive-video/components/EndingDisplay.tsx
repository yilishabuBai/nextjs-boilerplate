import { Ending, Character } from '../types';

interface EndingDisplayProps {
  ending: Ending;
  character: Character;
  onRestart: () => void;
  onContinue: () => void;
}

export default function EndingDisplay({ ending, character, onRestart, onContinue }: EndingDisplayProps) {
  const getEndingTypeColor = (type: string) => {
    switch (type) {
      case 'romance':
        return 'from-pink-500 to-red-500';
      case 'friendship':
        return 'from-blue-500 to-purple-500';
      case 'acquaintance':
        return 'from-green-500 to-blue-500';
      case 'distant':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const getEndingTypeText = (type: string) => {
    switch (type) {
      case 'romance':
        return '💕 浪漫结局';
      case 'friendship':
        return '🤝 友谊结局';
      case 'acquaintance':
        return '👋 相识结局';
      case 'distant':
        return '👁️ 疏远结局';
      default:
        return '❓ 未知结局';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className={`bg-gradient-to-r ${getEndingTypeColor(ending.type)} text-white p-6 rounded-t-lg`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">{ending.title}</h2>
            <p className="text-lg opacity-90">{getEndingTypeText(ending.type)}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {character.name.charAt(0)}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">{character.name}</h3>
                <p className="text-sm opacity-90">{character.personality}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 结局描述 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">结局描述</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{ending.description}</p>
          </div>

          {/* 角色对话 */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {character.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{character.name}</h4>
                <p className="text-sm text-gray-600">最终告白</p>
              </div>
            </div>
            <p className="text-xl text-gray-800 text-center italic">
              "{ending.dialogue}"
            </p>
          </div>

          {/* 最终选择 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">最终选择</h3>
            <div className="space-y-3">
              {ending.choices.map((choice) => (
                <div key={choice.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-700 font-medium mb-2">{choice.text}</p>
                  <p className="text-blue-600 text-sm">{choice.consequence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 奖励信息 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">获得奖励</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">💕</div>
                <h4 className="font-semibold text-green-800">好感度奖励</h4>
                <p className="text-green-600">+{ending.rewards.affectionBonus}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-semibold text-purple-800">解锁成就</h4>
                <p className="text-purple-600">{ending.rewards.achievement}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="font-semibold text-yellow-800">特殊物品</h4>
                <p className="text-yellow-600">{ending.rewards.specialItem}</p>
              </div>
            </div>
          </div>

          {/* 角色统计 */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">角色统计</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">最终好感度:</span>
                  <p className="font-medium text-lg">{character.currentAffection} / {character.maxAffection}</p>
                </div>
                <div>
                  <span className="text-gray-600">好感度等级:</span>
                  <p className="font-medium text-lg">
                    {character.currentAffection >= 80 ? '❤️ 深爱' :
                     character.currentAffection >= 60 ? '💕 喜欢' :
                     character.currentAffection >= 40 ? '😊 好感' :
                     character.currentAffection >= 20 ? '😐 一般' : '😑 陌生'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(character.currentAffection / character.maxAffection) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            重新开始
          </button>
          <button
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  );
}
