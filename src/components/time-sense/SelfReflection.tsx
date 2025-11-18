import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../common/Card';
import Button from '../common/Button';
import MujiIcon from '../common/MujiIcon';

export default function SelfReflection() {
  const { results, saveReflection, resetGame } = useAppStore();
  const [timePerception, setTimePerception] = useState('');
  const [taskImpact, setTaskImpact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const averageError = results.reduce((sum, r) => sum + r.error, 0) / results.length;
  const tendency = averageError < -500 ? '짧게' : averageError > 500 ? '길게' : '정확하게';

  const handleSubmit = () => {
    if (timePerception.trim() && taskImpact.trim()) {
      saveReflection(timePerception, taskImpact);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setTimePerception('');
    setTaskImpact('');
    setSubmitted(false);
    resetGame();
  };

  if (submitted) {
    return (
      <Card>
        <div className="text-center space-y-6">
          <MujiIcon type="check" size={64} className="mx-auto text-muji-dark" />
          <h2 className="text-2xl font-bold text-muji-dark">성찰 완료!</h2>
          <div className="bg-muji-bg p-6 rounded-lg text-left max-w-2xl mx-auto space-y-4">
            <div>
              <h3 className="font-bold text-muji-dark mb-2">나의 시간 감각</h3>
              <p className="text-muji-mid whitespace-pre-wrap">{timePerception}</p>
            </div>
            <div>
              <h3 className="font-bold text-muji-dark mb-2">과제에 미치는 영향</h3>
              <p className="text-muji-mid whitespace-pre-wrap">{taskImpact}</p>
            </div>
          </div>
          <div className="border-t border-muji-beige pt-6">
            <p className="text-muji-mid mb-4">자신의 시간 감각을 인식하는 것이 시간 관리의 첫걸음입니다.</p>
            <p className="text-sm text-muji-mid mb-6">앞으로 과제를 할 때 이 점을 기억하고 계획을 세워보세요!</p>
            <Button onClick={handleReset} variant="outline">
              <div className="flex items-center gap-2">
                <MujiIcon type="refresh" size={20} />
                <span>다시 시작하기</span>
              </div>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <MujiIcon type="think" size={64} className="mx-auto text-muji-dark mb-4" />
          <h2 className="text-2xl font-bold text-muji-dark mb-2">자기성찰</h2>
          <p className="text-muji-mid">테스트 결과를 바탕으로 자신을 돌아봅시다</p>
        </div>

        <div className="bg-muji-beige p-4 rounded-lg text-center">
          <p className="text-muji-mid">테스트 결과, 나는 시간이</p>
          <p className="text-2xl font-bold text-muji-dark mt-2">{tendency} 느껴지는 편입니다</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-muji-dark font-bold mb-2">
              1. 내가 시간이 {tendency} 느껴지는 편인가요?
            </label>
            <p className="text-sm text-muji-mid mb-3">
              일상생활에서 시간이 빠르게 또는 느리게 지나간다고 느낀 경험을 생각해보세요.
            </p>
            <textarea
              value={timePerception}
              onChange={(e) => setTimePerception(e.target.value)}
              className="w-full p-4 border-2 border-muji-beige rounded-lg focus:outline-none focus:border-muji-dark resize-none"
              rows={4}
              placeholder="예: 게임을 할 때는 시간이 빠르게 가는 것 같고, 공부할 때는 느리게 가는 것 같아요..."
            />
          </div>

          <div>
            <label className="block text-muji-dark font-bold mb-2">
              2. 과제할 때 이 감각이 어떤 영향을 줄까요?
            </label>
            <p className="text-sm text-muji-mid mb-3">
              시간 감각이 과제 계획이나 실행에 어떤 영향을 미칠 수 있을지 생각해보세요.
            </p>
            <textarea
              value={taskImpact}
              onChange={(e) => setTaskImpact(e.target.value)}
              className="w-full p-4 border-2 border-muji-beige rounded-lg focus:outline-none focus:border-muji-dark resize-none"
              rows={4}
              placeholder="예: 과제 시간을 짧게 생각해서 항상 늦게 시작하는 것 같아요..."
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={handleReset} variant="outline">
            처음으로
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!timePerception.trim() || !taskImpact.trim()}
            size="lg"
          >
            완료
          </Button>
        </div>
      </div>
    </Card>
  );
}
