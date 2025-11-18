import { useAppStore } from './store/appStore';
import TimeSenseGame from './components/time-sense/TimeSenseGame';
import ResultChart from './components/time-sense/ResultChart';
import SelfReflection from './components/time-sense/SelfReflection';
import Card from './components/common/Card';
import Button from './components/common/Button';
import MujiIcon from './components/common/MujiIcon';

function App() {
  const { phase, results, startReflection, goBack, resetGame } = useAppStore();

  const showBackButton = phase !== 'intro';

  // 개발자 도구 열기
  const handleDevReset = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
      resetGame();
    }
  };

  return (
    <div className="min-h-screen bg-muji-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          {showBackButton && (
            <button
              onClick={goBack}
              className="absolute left-0 top-0 text-muji-mid hover:text-muji-dark transition-colors flex items-center gap-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>이전</span>
            </button>
          )}
          <button
            onClick={handleDevReset}
            className="absolute right-0 top-0 text-muji-mid hover:text-muji-dark transition-colors"
            title="처음부터 다시 시작"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <h1 className="text-4xl font-bold text-muji-dark mb-2">TimeCog</h1>
          <p className="text-muji-mid">ADHD 학생을 위한 시간 인지 능력 향상 프로그램</p>
        </header>

        <main>
          {(phase === 'intro' || phase === 'ready' || phase === 'playing' || phase === 'roundResult') && (
            <TimeSenseGame />
          )}

          {phase === 'finalResult' && (
            <Card>
              <div className="space-y-6">
                <div className="text-center">
                  <MujiIcon type="chart" size={64} className="mx-auto text-muji-dark mb-4" />
                  <h2 className="text-3xl font-bold text-muji-dark mb-2">최종 결과</h2>
                  <p className="text-muji-mid">5번의 테스트 결과를 종합 분석했습니다</p>
                </div>

                <ResultChart results={results} />

                <div className="flex justify-center pt-6">
                  <Button onClick={startReflection} size="lg">
                    자기성찰 하기
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {phase === 'reflection' && <SelfReflection />}
        </main>

        <footer className="text-center mt-12 text-muji-mid text-sm">
          <p>© 2024 TimeCog - ADHD 학생의 시간 관리 능력 향상을 위한 프로그램</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
