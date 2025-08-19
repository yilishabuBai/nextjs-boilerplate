import { Scene, Choice } from '../types';

interface SceneDisplayProps {
  scene: Scene;
  onChoiceSelect: (choice: Choice) => void;
}

export default function SceneDisplay({ scene, onChoiceSelect }: SceneDisplayProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/50 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">{scene.title}</h2>
        <p className="text-gray-700 text-lg">{scene.description}</p>
      </div>

      {/* 背景图片占位符 */}
      <div className="w-full h-48 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg mb-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">🏪</div>
          <p>场景背景图片</p>
          <p className="text-sm">{scene.background}</p>
        </div>
      </div>

      {/* 对话内容 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200 mb-6">
        <p className="text-xl text-gray-800 text-center italic">
          "{scene.dialogue}"
        </p>
      </div>

      {/* 选择选项 */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-purple-700 mb-4 text-center">做出你的选择</h3>
        {scene.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoiceSelect(choice)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/20 text-left"
          >
            <div className="flex items-center justify-between">
              <span>{choice.text}</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">
                {choice.affectionChange > 0 ? '+' : ''}{choice.affectionChange} 好感度
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
