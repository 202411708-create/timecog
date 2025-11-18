import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import Card from '../common/Card';
import Button from '../common/Button';
import MujiIcon from '../common/MujiIcon';

export default function TimeSenseGame() {
  const { phase, currentRound, totalRounds, targetTime, recordResult, nextRound, startGame } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ measured: number; error: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === 'ready') {
      setIsRunning(false);
      setElapsedTime(0);
      setShowResult(false);
      setLastResult(null);
    }
  }, [phase, currentRound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    setElapsedTime(0);
    setShowResult(false);
    startTimeRef.current = performance.now();

    const updateTimer = () => {
      if (startTimeRef.current) {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        setElapsedTime(elapsed);
        timerRef.current = requestAnimationFrame(updateTimer);
      }
    };

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);

    const measuredTime = elapsedTime;
    const error = measuredTime - targetTime;
    setLastResult({ measured: measuredTime, error });
    setShowResult(true);
    recordResult(measuredTime);
  };

  const handleNext = () => {
    nextRound();
  };

  if (phase === 'intro') {
    return (
      <Card>
        <div className="text-center space-y-6">
          <MujiIcon type="clock" size={64} className="mx-auto text-muji-dark" />
          <h1 className="text-3xl font-bold text-muji-dark">시간 인지 능력 테스트</h1>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="border-l-4 border-muji-dark pl-4">
              <h2 className="font-bold text-muji-dark mb-2">PET 전략</h2>
              <ul className="space-y-2 text-muji-mid">
                <li><span className="font-bold text-muji-dark">P</span> (Pause): 잠깐 멈추기</li>
                <li><span className="font-bold text-muji-dark">E</span> (Evaluate): 평가하기</li>
                <li><span className="font-bold text-muji-dark">T</span> (Trust): 신뢰하기</li>
              </ul>
            </div>
            <div className="bg-muji-bg p-4 rounded-lg">
              <h3 className="font-bold text-muji-dark mb-2">게임 방법</h3>
              <ol className="list-decimal list-inside space-y-1 text-muji-mid">
                <li>시작 버튼을 누르면 타이머가 작동합니다</li>
                <li>정확히 10초가 지났다고 생각되면 정지 버튼을 누르세요</li>
                <li>총 5번 반복합니다</li>
                <li>다양한 차트와 분석으로 결과를 확인할 수 있습니다</li>
              </ol>
            </div>
          </div>
          <Button onClick={startGame} size="lg">
            시작하기
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === 'ready' && !isRunning) {
    return (
      <Card>
        <div className="text-center space-y-8">
          <div>
            <div className="text-muji-mid text-sm mb-2">라운드</div>
            <div className="text-5xl font-bold text-muji-dark">
              {currentRound} / {totalRounds}
            </div>
          </div>
          <div className="bg-muji-bg p-6 rounded-lg">
            <p className="text-muji-mid mb-4">시작 버튼을 누르고</p>
            <p className="text-xl font-bold text-muji-dark">정확히 10초 후 정지 버튼을 누르세요</p>
          </div>
          <Button onClick={startTimer} size="lg">
            <div className="flex items-center gap-2">
              <MujiIcon type="play" size={20} />
              <span>시작</span>
            </div>
          </Button>
        </div>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card>
        <div className="text-center space-y-12">
          <div>
            <div className="text-muji-mid text-sm mb-4">라운드 {currentRound}</div>
            <motion.div
              className="w-32 h-32 mx-auto rounded-full border-8 border-muji-dark flex items-center justify-center mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <MujiIcon type="clock" size={64} className="text-muji-dark" />
            </motion.div>
            <div className="text-2xl font-bold text-muji-dark">
              10초가 지났다고 생각되면<br />정지 버튼을 누르세요
            </div>
          </div>
          <Button onClick={stopTimer} size="lg" variant="secondary">
            <div className="flex items-center gap-2">
              <MujiIcon type="pause" size={20} />
              <span>정지</span>
            </div>
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === 'roundResult' && showResult && lastResult) {
    const errorSeconds = Math.abs(lastResult.error / 1000);
    const isFast = lastResult.error < 0;
    const errorPercentage = Math.abs((lastResult.error / targetTime) * 100);

    return (
      <Card>
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <MujiIcon type="check" size={64} className="text-muji-dark" />
          </div>
          <h2 className="text-2xl font-bold text-muji-dark">라운드 {currentRound} 결과</h2>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-muji-bg p-4 rounded-lg">
              <div className="text-muji-mid text-sm mb-1">목표 시간</div>
              <div className="text-3xl font-bold text-muji-dark">{(targetTime / 1000).toFixed(1)}초</div>
            </div>
            <div className="bg-muji-beige p-4 rounded-lg">
              <div className="text-muji-mid text-sm mb-1">측정 시간</div>
              <div className="text-3xl font-bold text-muji-dark">{(lastResult.measured / 1000).toFixed(2)}초</div>
            </div>
          </div>

          <div className="bg-white border-2 border-muji-dark p-6 rounded-lg max-w-md mx-auto">
            <div className="text-muji-mid text-sm mb-2">오차</div>
            <div className={`text-4xl font-bold ${isFast ? 'text-blue-600' : 'text-orange-600'}`}>
              {isFast ? '-' : '+'}{errorSeconds.toFixed(2)}초
            </div>
            <div className="text-muji-mid mt-2">
              ({errorPercentage.toFixed(1)}% {isFast ? '빠름' : '느림'})
            </div>
          </div>

          <div className="text-muji-mid text-sm">
            {isFast ? '시간이 실제보다 빠르게 느껴지는 경향이 있습니다' : '시간이 실제보다 느리게 느껴지는 경향이 있습니다'}
          </div>

          <Button onClick={handleNext} size="lg">
            {currentRound < totalRounds ? '다음 라운드' : '최종 결과 보기'}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
