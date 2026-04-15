interface GameHistoryProps {
  gameHistory: string[];
}

export default function GameHistory({ gameHistory }: GameHistoryProps) {
  if (gameHistory.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/50">
        <h3 className="text-xl font-bold text-purple-700 mb-4">游戏历程</h3>
        <div className="space-y-2">
          {gameHistory.map((history, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
              <p className="text-blue-700 text-sm">{history}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
