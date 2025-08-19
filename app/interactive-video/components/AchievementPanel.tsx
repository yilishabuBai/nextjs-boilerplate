import { Achievement } from '../types';

interface AchievementPanelProps {
  achievements: Achievement[];
}

export default function AchievementPanel({ achievements }: AchievementPanelProps) {
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/50">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">成就系统</h2>

      {/* 成就统计 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-purple-700">
            成就进度: {unlockedAchievements.length} / {achievements.length}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 已解锁成就 */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-3">已解锁成就</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                    <p className="text-sm text-green-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 未解锁成就 */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">未解锁成就</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedAchievements.slice(0, 6).map((achievement) => (
              <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 opacity-60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-600">{achievement.name}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      解锁条件: {achievement.unlockCondition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {lockedAchievements.length > 6 && (
            <p className="text-sm text-gray-500 text-center mt-3">
              还有 {lockedAchievements.length - 6} 个成就等待解锁...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
