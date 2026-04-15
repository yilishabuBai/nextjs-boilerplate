import { Choice } from '../types';

interface ChoiceResultProps {
  choice: Choice | null;
  showConsequence: boolean;
}

export default function ChoiceResult({ choice, showConsequence }: ChoiceResultProps) {
  if (!showConsequence || !choice) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div className="text-4xl mb-2">✨</div>
      <h3 className="text-xl font-semibold text-green-700 mb-2">选择结果</h3>
      <p className="text-green-600">{choice.consequence}</p>
      <p className="text-sm text-green-500 mt-2">正在切换到下一个场景...</p>
    </div>
  );
}
